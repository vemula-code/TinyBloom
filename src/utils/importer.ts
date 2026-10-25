import { GrowthEntry } from '../types/growth';
import { calculateAge, inchesToCm, lbsOzToKg } from '../data/whoGrowthStandards';

export interface ParsedImportResult {
  entries: GrowthEntry[];
  errors: string[];
  totalParsed: number;
}

/**
 * Smart parser that accepts:
 * 1. Nara Baby CSV export
 * 2. Standard CSV (Date, Weight, Height, Head Circumference, Notes)
 * 3. Freeform text lines (e.g. "2026-03-24: 7.6 lbs, 20 in, notes: first checkup")
 */
export function parsePastGrowthData(
  rawText: string,
  birthDate: string
): ParsedImportResult {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const entries: GrowthEntry[] = [];
  const errors: string[] = [];

  if (lines.length === 0) {
    return { entries: [], errors: ['No data found in input.'], totalParsed: 0 };
  }

  // Check if first line is a CSV header
  const isCSV = lines[0].includes(',') || lines[0].includes('\t');
  let startIndex = 0;
  let headerMap: Record<string, number> = {};

  if (isCSV) {
    const headerCols = lines[0].split(/[,\t]/).map((c) => c.toLowerCase().trim().replace(/["']/g, ''));
    if (headerCols.some((c) => c.includes('date') || c.includes('time') || c.includes('weight') || c.includes('height') || c.includes('length'))) {
      headerCols.forEach((col, idx) => {
        if (col.includes('date') || col.includes('time')) headerMap['date'] = idx;
        else if (col.includes('weight') || col.includes('wt') || col.includes('lbs') || col.includes('kg')) headerMap['weight'] = idx;
        else if (col.includes('height') || col.includes('length') || col.includes('len') || col.includes('ht') || col.includes('cm') || col.includes('in')) headerMap['height'] = idx;
        else if (col.includes('head') || col.includes('hc') || col.includes('circum')) headerMap['head'] = idx;
        else if (col.includes('note') || col.includes('memo') || col.includes('comment')) headerMap['notes'] = idx;
      });
      startIndex = 1;
    }
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;

    try {
      let dateStr = '';
      let weightKg: number | undefined;
      let heightCm: number | undefined;
      let headCircumferenceCm: number | undefined;
      let notes = '';

      if (isCSV && Object.keys(headerMap).length > 0) {
        // Parse CSV row respecting potential quotes
        const cols = line.split(/[,\t]/).map((c) => c.trim().replace(/^["']|["']$/g, ''));
        if (headerMap['date'] !== undefined && cols[headerMap['date']]) {
          dateStr = parseDateString(cols[headerMap['date']]);
        }
        if (headerMap['weight'] !== undefined && cols[headerMap['weight']]) {
          weightKg = parseWeightToKg(cols[headerMap['weight']]);
        }
        if (headerMap['height'] !== undefined && cols[headerMap['height']]) {
          heightCm = parseLengthToCm(cols[headerMap['height']]);
        }
        if (headerMap['head'] !== undefined && cols[headerMap['head']]) {
          headCircumferenceCm = parseLengthToCm(cols[headerMap['head']]);
        }
        if (headerMap['notes'] !== undefined && cols[headerMap['notes']]) {
          notes = cols[headerMap['notes']];
        }
      } else {
        // Freeform line parsing
        // Example: 2026-03-24: 7.6 lbs, 20 in, 13.8 in - birth notes
        const dateMatch = line.match(/(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/);
        if (dateMatch) {
          dateStr = parseDateString(dateMatch[1]);
        }

        // Look for weight (e.g. "8.4 kg", "18 lb 9 oz", "18.5 lbs", "7 lbs 8 oz")
        const weightLbsOzMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\s*(?:(\d+(?:\.\d+)?)\s*(?:oz|ounces?))?/i);
        const weightKgMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)/i);

        if (weightKgMatch) {
          weightKg = parseFloat(weightKgMatch[1]);
        } else if (weightLbsOzMatch) {
          const lbs = parseFloat(weightLbsOzMatch[1]) || 0;
          const oz = parseFloat(weightLbsOzMatch[2]) || 0;
          weightKg = lbsOzToKg(lbs, oz);
        }

        // Look for height/length (e.g. "69.8 cm", "27.5 in", "27.5 inches")
        const heightCmMatch = line.match(/(\d+(?:\.\d+)?)\s*cm/i);
        const heightInMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:in|inches|''|")/i);

        if (heightCmMatch) {
          heightCm = parseFloat(heightCmMatch[1]);
        } else if (heightInMatch) {
          heightCm = inchesToCm(parseFloat(heightInMatch[1]));
        }

        // Notes: rest of string or after dash/colon
        const notesMatch = line.match(/(?:notes?|memo|comment|pediatrician)?:?\s*[-:–]\s*(.+)$/i);
        if (notesMatch) {
          notes = notesMatch[1].trim();
        }
      }

      if (dateStr) {
        const age = calculateAge(birthDate, dateStr);
        entries.push({
          id: `imported-${Date.now()}-${i}`,
          date: dateStr,
          ageMonths: age.exactMonths,
          weightKg,
          heightCm,
          headCircumferenceCm,
          notes: notes || undefined,
        });
      } else {
        errors.push(`Row ${i + 1}: Could not find a valid date in "${line.slice(0, 40)}..."`);
      }
    } catch (err) {
      errors.push(`Row ${i + 1}: Error parsing row.`);
    }
  }

  // Sort chronologically
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    entries,
    errors,
    totalParsed: entries.length,
  };
}

function parseDateString(str: string): string {
  // Normalize formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY
  const cleaned = str.trim().split(' ')[0].replace(/[/.]/g, '-');
  const parts = cleaned.split('-');

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const y = parts[0];
      const m = parts[1].padStart(2, '0');
      const d = parts[2].padStart(2, '0');
      return `${y}-${m}-${d}`;
    } else if (parts[2].length === 4) {
      // MM-DD-YYYY
      const m = parts[0].padStart(2, '0');
      const d = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return '';
}

function parseWeightToKg(val: string): number | undefined {
  const cleaned = val.toLowerCase().trim();
  if (cleaned.includes('kg')) {
    const num = parseFloat(cleaned.replace('kg', ''));
    return !isNaN(num) ? num : undefined;
  }
  if (cleaned.includes('lb') || cleaned.includes('oz')) {
    const lbsMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*lb/);
    const ozMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*oz/);
    const lbs = lbsMatch ? parseFloat(lbsMatch[1]) : 0;
    const oz = ozMatch ? parseFloat(ozMatch[1]) : 0;
    if (lbs > 0 || oz > 0) return lbsOzToKg(lbs, oz);
  }
  const rawNum = parseFloat(cleaned);
  if (!isNaN(rawNum) && rawNum > 0) {
    // If under 30 and likely kg vs lbs
    // If larger than 15 for infant, could be lbs
    return rawNum > 25 ? lbsOzToKg(rawNum) : rawNum;
  }
  return undefined;
}

function parseLengthToCm(val: string): number | undefined {
  const cleaned = val.toLowerCase().trim();
  if (cleaned.includes('cm')) {
    const num = parseFloat(cleaned.replace('cm', ''));
    return !isNaN(num) ? num : undefined;
  }
  if (cleaned.includes('in') || cleaned.includes('"')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
    return !isNaN(num) ? inchesToCm(num) : undefined;
  }
  const rawNum = parseFloat(cleaned);
  if (!isNaN(rawNum) && rawNum > 0) {
    // If under 40, likely inches for baby length
    return rawNum < 40 ? inchesToCm(rawNum) : rawNum;
  }
  return undefined;
}
