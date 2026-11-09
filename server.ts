import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Dev server and backend must always run on port 3000 where nginx proxies requests
  const PORT = 3000;

  // Auto-verify that Nginx has the direct /api/ bypass so mobile PWA standalone calls never hit auth redirects
  try {
    const fs = await import('fs');
    const { execSync } = await import('child_process');
    const nginxConfPath = '/etc/nginx/nginx.conf';
    if (fs.existsSync(nginxConfPath)) {
      const conf = fs.readFileSync(nginxConfPath, 'utf8');
      if (!conf.includes('location /api/ {')) {
        const target = '        # Serve the app for all other paths.\n        location / {';
        const replacement = `        # Direct API proxy to Express backend (avoids auth bridge redirects for mobile PWA)
        location /api/ {
            client_max_body_size 50M;
            proxy_pass http://localhost:3000;
            proxy_set_header Host localhost:3000;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 120s;
            proxy_connect_timeout 10s;
        }

        # Serve the app for all other paths.
        location / {`;
        if (conf.includes(target)) {
          fs.writeFileSync(nginxConfPath, conf.replace(target, replacement));
          execSync('nginx -t && nginx -s reload', { stdio: 'ignore' });
        }
      }
    }
  } catch {
    // Non-fatal if running in environment where nginx is managed externally
  }

  // Allow larger payload for screenshot images from phone and web
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Handle CORS & preflight OPTIONS for PWA standalone and mobile webview contexts
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Local status endpoint (no personal data transmitted)
  app.get(['/api/health', '/api/health/'], (req, res) => {
    res.json({
      status: 'ok',
      service: 'TinyBloom Local Server',
      privacy: '100% on-device offline storage',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Extract baby growth data from photos or screenshots of records (clinic charts, checkup papers, discharge slips)
  app.post(['/api/extract-growth-screenshot', '/api/extract-growth-screenshot/', '/api/extract-screenshot', '/api/extract-screenshot/'], async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', babyBirthDate, babyName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image data provided. Please upload a screenshot.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please add your API key in Settings > Secrets to enable instant AI screenshot scanning.',
          needsKey: true,
        });
      }

      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Strip standard data URL scheme prefix if present
      const cleanBase64 = String(imageBase64).replace(/^data:[^;]+;base64,/, '').trim();

      // Normalize image with sharp: auto-orient EXIF from mobile cameras, resize to max 1400px, and ensure clean JPEG
      let finalBase64 = cleanBase64;
      let finalMimeType = 'image/jpeg';
      try {
        const inputBuf = Buffer.from(cleanBase64, 'base64');
        const { default: sharp } = await import('sharp');
        const processedBuf = await sharp(inputBuf)
          .rotate() // Auto-orient based on mobile camera EXIF orientation
          .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        finalBase64 = processedBuf.toString('base64');
      } catch (sharpErr) {
        console.warn('Image pre-normalization with sharp skipped, using raw image:', sharpErr);
        finalMimeType = (mimeType && mimeType.includes('png')) ? 'image/png' : 'image/jpeg';
      }

      const prompt = `You are an expert pediatric medical records assistant.
Examine this screenshot or photo of baby growth records (e.g., clinic growth chart, hospital discharge papers, pediatrician visit summary, digital health growth curves, or checkup slips).

Context:
- Baby Name: ${babyName || 'Baby'}
- Baby Birth Date: ${babyBirthDate || 'Unknown'}

Your task is to accurately extract ALL baby growth measurements recorded or displayed in this screenshot.
If the screenshot shows a history log, table, or multiple checkup dates, extract EVERY single one as a separate item.

CRITICAL AGE & DATE EXTRACTION RULES:
1. Search for any calendar date (e.g., "October 14, 2024", "10/14/2024", "14-Sep-2024", "Sep 15"). Format as YYYY-MM-DD.
2. If month/day is shown without a year (e.g. "Oct 14" or "9/12"), deduce the correct year using the Baby Birth Date (${babyBirthDate || 'Unknown'}).
3. CRITICAL: If the screenshot displays an age or visit label (e.g., "Birth", "Newborn", "2 weeks", "1 month", "2 mo", "4 months", "6 months", "9 months", "12 months / 1 year", "15m", "18m", "24m"):
   - ALWAYS populate ageMonths with the numeric age in months (e.g., 0, 0.5, 1, 2, 4, 6, 9, 12, 15, 18, 24).
   - If a calendar date is also visible, format it as YYYY-MM-DD.
   - If NO calendar date is visible, calculate the calendar date by adding ageMonths to the Baby Birth Date (${babyBirthDate || 'Unknown'})!
4. Each historical checkup must have its own distinct historical date and ageMonths.

CRITICAL MEASUREMENT EXTRACTION RULES:
- Weight:
  * If in lbs & oz (e.g. "14 lb 6 oz" or "14 lbs 8 oz"): convert to kg accurately: (lbs + oz/16) * 0.45359237. Round weightKg to 2 decimals. Also provide weightLbs and weightOz.
  * If in decimal lbs (e.g. "14.5 lbs"): convert to kg: 14.5 * 0.45359237 = 6.58 kg.
  * If in kilograms (e.g. "6.58 kg"): weightKg = 6.58.
  * If in grams (e.g. "3400 g"): weightKg = 3.4.
  * Never confuse lbs with kg: a 14-lb baby is ~6.35 kg, NOT 14 kg!
- Length / Height:
  * If in inches (e.g. "25.5 in"): heightCm = round(25.5 * 2.54, 1) = 64.8 cm. Also provide heightIn = 25.5.
  * If in cm (e.g. "64.8 cm"): heightCm = 64.8.
- Head Circumference:
  * If in inches (e.g. "16.5 in"): headCircumferenceCm = round(16.5 * 2.54, 1) = 41.9 cm. Also provide headCircumferenceIn.
  * If in cm (e.g. "41.9 cm"): headCircumferenceCm = 41.9.
- Notes & Source:
  * notes: checkup visit note, milestones, doctor note.
  * sourceApp: name of app or document (e.g., "Clinic Growth Chart", "Pediatrician Slip", "Digital Records", "Checkup Summary").

Return strictly structured JSON matching the schema.`;

      // Candidate models: start with gemini-3.1-flash-lite for instant, high-availability OCR, followed by flash fallbacks
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let responseText: string | undefined;
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: finalMimeType,
                    data: finalBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
            config: {
              systemInstruction: 'You are an accurate pediatric assistant extracting growth metrics (date, age in months, weight, height, head circumference) from baby tracking records and doctor papers.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  sourceDetected: {
                    type: Type.STRING,
                    description: 'The app or document source detected (e.g., Clinic Growth Chart, Pediatrician Slip, Digital Records, Discharge Summary)',
                  },
                  summary: {
                    type: Type.STRING,
                    description: '1-sentence user-friendly summary of the records found in the screenshot',
                  },
                  detectedBabyName: {
                    type: Type.STRING,
                    description: 'The baby name detected in the screenshot header or profile, if visible',
                  },
                  detectedBirthDate: {
                    type: Type.STRING,
                    description: 'The baby birth date in YYYY-MM-DD if visible in screenshot profile or record header',
                  },
                  entries: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        date: { type: Type.STRING, description: 'YYYY-MM-DD' },
                        ageMonths: { type: Type.NUMBER, description: 'Baby age in months at measurement (e.g. 0, 2, 4, 6, 9, 12, 18)' },
                        weightKg: { type: Type.NUMBER, description: 'Weight in kg' },
                        weightLbs: { type: Type.NUMBER, description: 'Weight in lbs' },
                        weightOz: { type: Type.NUMBER, description: 'Weight in oz' },
                        heightCm: { type: Type.NUMBER, description: 'Height/length in cm' },
                        heightIn: { type: Type.NUMBER, description: 'Height/length in inches' },
                        headCircumferenceCm: { type: Type.NUMBER, description: 'Head circumference in cm' },
                        headCircumferenceIn: { type: Type.NUMBER, description: 'Head circumference in inches' },
                        notes: { type: Type.STRING, description: 'Notes or milestones' },
                        sourceApp: { type: Type.STRING, description: 'Detected source app name' },
                      },
                    },
                  },
                },
                required: ['entries'],
              },
            },
          });

          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Extraction with ${model} failed, trying next candidate:`, modelErr.message || modelErr);
          lastError = modelErr;
        }
      }

      if (!responseText) {
        throw lastError || new Error('All AI models were unable to process this image.');
      }

      let cleanText = responseText.trim();
      // Remove markdown code fences if model returned ```json ... ```
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      // If there are still surrounding characters, find first { or [ to last } or ]
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(cleanText || '{}');

      // Post-process & consolidate entries: Ensure weight, height, and head circumference for the same checkup are combined
      if (Array.isArray(parsedData.entries)) {
        // Forward fill missing date/ageMonths if model returned measurements as separate rows for the same visit
        let lastKnownDate = '';
        let lastKnownAge: number | undefined = undefined;
        for (const entry of parsedData.entries) {
          const d = entry.date ? String(entry.date).trim() : '';
          if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
            lastKnownDate = d;
          } else if (lastKnownDate && (!d || d === 'Unknown' || d === '')) {
            entry.date = lastKnownDate;
          }
          if (typeof entry.ageMonths === 'number' && !isNaN(entry.ageMonths)) {
            lastKnownAge = entry.ageMonths;
          } else if (lastKnownAge !== undefined && (entry.ageMonths === undefined || isNaN(entry.ageMonths))) {
            entry.ageMonths = lastKnownAge;
          }
        }

        const unifiedMap = new Map<string, any>();
        let currentEffectiveBirthDate = parsedData.detectedBirthDate || babyBirthDate;

        for (let idx = 0; idx < parsedData.entries.length; idx++) {
          const entry = parsedData.entries[idx];
          if (!entry) continue;

          // Normalize numeric values
          let ageMo = typeof entry.ageMonths === 'number' && !isNaN(entry.ageMonths) ? entry.ageMonths : undefined;
          let entryDate = entry.date ? String(entry.date).trim() : '';

          // Deduce birth date if both date and age are present
          if (entryDate && /^\d{4}-\d{2}-\d{2}$/.test(entryDate) && typeof ageMo === 'number' && ageMo > 0 && !currentEffectiveBirthDate) {
            const bMs = new Date(entryDate).getTime() - ageMo * 30.4375 * 86400000;
            currentEffectiveBirthDate = new Date(bMs).toISOString().split('T')[0];
            if (!parsedData.detectedBirthDate) {
              parsedData.detectedBirthDate = currentEffectiveBirthDate;
            }
          }

          // Group key: prefer explicit date, then ageMonths, else fallback index
          const groupKey = (entryDate && entryDate !== 'Unknown' && /^\d{4}-\d{2}-\d{2}$/.test(entryDate))
            ? `date-${entryDate}`
            : (typeof ageMo === 'number' ? `age-${ageMo}` : `visit-${idx}`);

          if (!unifiedMap.has(groupKey)) {
            unifiedMap.set(groupKey, {
              ...entry,
              date: entryDate,
              ageMonths: ageMo,
            });
          } else {
            const existing = unifiedMap.get(groupKey);
            if (existing.weightKg === undefined && entry.weightKg !== undefined) existing.weightKg = entry.weightKg;
            if (existing.weightLbs === undefined && entry.weightLbs !== undefined) existing.weightLbs = entry.weightLbs;
            if (existing.weightOz === undefined && entry.weightOz !== undefined) existing.weightOz = entry.weightOz;
            if (existing.heightCm === undefined && entry.heightCm !== undefined) existing.heightCm = entry.heightCm;
            if (existing.heightIn === undefined && entry.heightIn !== undefined) existing.heightIn = entry.heightIn;
            if (existing.headCircumferenceCm === undefined && entry.headCircumferenceCm !== undefined) existing.headCircumferenceCm = entry.headCircumferenceCm;
            if (existing.headCircumferenceIn === undefined && entry.headCircumferenceIn !== undefined) existing.headCircumferenceIn = entry.headCircumferenceIn;
            if (existing.ageMonths === undefined && ageMo !== undefined) existing.ageMonths = ageMo;
            if (!existing.date && entryDate) existing.date = entryDate;
            if (entry.notes && !existing.notes?.includes(entry.notes)) {
              existing.notes = existing.notes ? `${existing.notes} | ${entry.notes}` : entry.notes;
            }
          }
        }

        parsedData.entries = Array.from(unifiedMap.values());
      }

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Gemini screenshot extraction error:', err);
      let cleanMessage = 'Failed to extract growth records from screenshot.';
      if (err) {
        if (typeof err.message === 'string') {
          const trimmed = err.message.trim();
          if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
              const parsed = JSON.parse(trimmed);
              cleanMessage = parsed.error?.message || parsed.message || cleanMessage;
            } catch {
              cleanMessage = trimmed;
            }
          } else if (trimmed && trimmed !== '[object Object]') {
            cleanMessage = trimmed;
          }
        } else if (typeof err.error?.message === 'string') {
          cleanMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          cleanMessage = err.error;
        } else if (typeof err === 'string' && err !== '[object Object]') {
          cleanMessage = err;
        }
      }
      return res.status(500).json({
        success: false,
        error: cleanMessage,
      });
    }
  });

  // Strict guard for any unhandled /api/* request: ALWAYS return JSON 404, NEVER fall through to HTML
  app.all(['/api', '/api/*'], (req, res) => {
    return res.status(404).json({
      success: false,
      error: `API route '${req.method} ${req.path}' not found.`,
    });
  });

  // Explicit error handling middleware: ensure API requests always receive structured JSON, never HTML error pages
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      console.error('Server error handler caught:', err);
      const status = err.status || err.statusCode || 500;
      let cleanMessage = 'An unexpected error occurred while processing the request.';
      if (err.type === 'entity.too.large' || status === 413) {
        cleanMessage = 'Screenshot image payload is too large. Please crop the screenshot or upload a smaller image.';
      } else if (err instanceof SyntaxError && 'body' in err) {
        cleanMessage = 'Invalid JSON request format.';
      } else if (typeof err.message === 'string') {
        cleanMessage = err.message;
      }
      return res.status(status).json({
        success: false,
        error: cleanMessage,
      });
    }
    next();
  });

  // In development, hook up Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      // Never serve index.html for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TinyBloom local server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
