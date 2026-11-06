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
  const PORT = Number(process.env.PORT) || 3000;

  // Allow larger payload for screenshot images from phone and web
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Local status endpoint (no personal data transmitted)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TinyBloom Local Server',
      privacy: '100% on-device offline storage',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Extract baby growth data from screenshots of other apps (Huckleberry, Sprout, Hatch, Paper records, etc.)
  app.post('/api/extract-growth-screenshot', async (req, res) => {
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

      // Strip standard data:image/...;base64, prefix if present
      const cleanBase64 = String(imageBase64).replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      const prompt = `You are an expert pediatric medical records assistant.
Examine this screenshot or photo from a baby tracking app (e.g., Huckleberry, Baby Tracker, Sprout, Hatch Baby, Cubtale, Ovia, hospital discharge papers, clinic growth chart, or pediatrician visit summary).

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
  * sourceApp: name of app or document (e.g., "Huckleberry", "Sprout", "Baby Tracker", "Hatch", "Pediatrician Slip").

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
                    mimeType: mimeType || 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
            config: {
              systemInstruction: 'You are an accurate pediatric assistant extracting growth metrics (date, age in months, weight, height, head circumference) from baby tracking app screenshots and doctor papers.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  sourceDetected: {
                    type: Type.STRING,
                    description: 'The app or document source detected (e.g., Huckleberry, Baby Tracker, Sprout, Hatch, Clinic Chart)',
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
                        confidence: { type: Type.STRING, description: 'high | medium | low' },
                      },
                      required: ['date'],
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

      const parsedData = JSON.parse(responseText || '{}');
      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Gemini screenshot extraction error:', err);
      return res.status(500).json({
        error: err.message || 'Error processing growth screenshot with Gemini API',
      });
    }
  });

  // Explicit error handling middleware: ensure API requests always receive structured JSON, never HTML error pages
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      console.error('Server error handler caught:', err);
      const status = err.status || err.statusCode || 500;
      if (err.type === 'entity.too.large' || status === 413) {
        return res.status(413).json({
          error: 'Screenshot image payload is too large. Please crop the screenshot or upload a smaller image.',
        });
      }
      return res.status(status).json({
        error: err.message || 'An unexpected error occurred while processing the request.',
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
