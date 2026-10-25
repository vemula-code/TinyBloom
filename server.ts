import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Generous limit for high-resolution baby growth screenshots
  app.use(express.json({ limit: '50mb' }));

  // Initialize Gemini AI with standard User-Agent header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'dtracker-backend' });
  });

  // Extract growth data from uploaded screenshots/photos
  app.post('/api/extract-growth-data', async (req, res) => {
    try {
      const { images, birthDate } = req.body;
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: 'Please provide at least one image.' });
      }

      const allExtractedRecords: any[] = [];

      // Process each uploaded image
      for (const img of images) {
        let base64Data = img.base64;
        let mimeType = img.mimeType || 'image/jpeg';
        if (base64Data.includes(',')) {
          const parts = base64Data.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          if (mimeMatch) mimeType = mimeMatch[1];
          base64Data = parts[1];
        }

        const promptText = `You are a medical & pediatric data extraction specialist.
Examine this screenshot or photo of baby growth logs/charts (e.g. from Nara Baby, pediatrician health records, or baby growth trackers).
Baby birth date: ${birthDate || '2026-03-28'}.

Extract ALL growth measurement entries found in this image.
For every entry extract:
- date: string in format "YYYY-MM-DD". If the year is omitted in the image (e.g. "Oct 14"), infer the year 2026.
- weightKg: number in kg (e.g. 7.88, 7.8, 3.4). If given in lbs & oz (e.g. "17 lb 6 oz"), convert precisely to kg (1 lb = 0.45359237 kg, 1 oz = 0.02834952 kg).
- weightLbs: number in lbs (e.g. 17.375 for 17 lb 6 oz, 7.5 for 7 lb 8 oz).
- heightCm: number in cm (e.g. 71.1, 50.8). If given in inches (e.g. "28 in"), convert to cm (1 in = 2.54 cm).
- heightIn: number in inches (e.g. 28.0, 20.0).
- headCircumferenceCm: number in cm (e.g. 44.5, 35.0). If given in inches, convert to cm.
- headCircumferenceIn: number in inches (e.g. 17.5).
- ageDescription: string with the age label shown on that row (e.g. "Age 6m 2w 2d", "Age 5d", "Birth").
- notes: string describing any notes, milestones, or pediatrician visit label.

Be accurate and preserve all dates and values precisely as shown.`;

        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not configured on the server.');
        }

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini OCR request timed out after 20 seconds.')), 20000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  weightKg: { type: Type.NUMBER },
                  weightLbs: { type: Type.NUMBER },
                  heightCm: { type: Type.NUMBER },
                  heightIn: { type: Type.NUMBER },
                  headCircumferenceCm: { type: Type.NUMBER },
                  headCircumferenceIn: { type: Type.NUMBER },
                  ageDescription: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
                required: ['date'],
              },
            },
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const rawJson = response.text || '[]';
        try {
          const parsed = JSON.parse(rawJson);
          if (Array.isArray(parsed)) {
            allExtractedRecords.push(...parsed);
          }
        } catch (e) {
          console.error('Error parsing Gemini output:', e, rawJson);
        }
      }

      // De-duplicate and merge records sharing the same date (e.g. weight and height from separate tabs)
      const dateMap = new Map<string, any>();
      for (const rec of allExtractedRecords) {
        if (!rec.date) continue;
        const existing = dateMap.get(rec.date);
        if (existing) {
          dateMap.set(rec.date, {
            ...existing,
            ...rec,
            weightKg: rec.weightKg ?? existing.weightKg,
            weightLbs: rec.weightLbs ?? existing.weightLbs,
            heightCm: rec.heightCm ?? existing.heightCm,
            heightIn: rec.heightIn ?? existing.heightIn,
            headCircumferenceCm: rec.headCircumferenceCm ?? existing.headCircumferenceCm,
            headCircumferenceIn: rec.headCircumferenceIn ?? existing.headCircumferenceIn,
            notes: [existing.notes, rec.notes].filter(Boolean).join(' · '),
          });
        } else {
          dateMap.set(rec.date, rec);
        }
      }

      const mergedList = Array.from(dateMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return res.json({
        success: true,
        count: mergedList.length,
        records: mergedList,
      });
    } catch (error: any) {
      console.error('OCR Extraction error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze screenshots with AI.',
      });
    }
  });

  // In development, hook up Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DTracker Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
