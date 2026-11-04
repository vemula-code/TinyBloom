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
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

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
Examine this screenshot or photo from another baby tracking app (e.g., Huckleberry, Baby Tracker, Sprout, Hatch Baby, Cubtale, Ovia, hospital discharge papers, clinic growth chart, or pediatrician visit summary).

Context:
- Baby Name: ${babyName || 'Baby'}
- Baby Birth Date: ${babyBirthDate || 'Unknown'}

Your task is to accurately extract ALL baby growth measurements recorded or displayed in this screenshot.
If the screenshot shows a history log, list, or multiple measurements, extract EVERY single one as a separate item.

For each measurement entry, extract:
- date: YYYY-MM-DD format. If year is missing in screenshot, deduce reasonable year based on birth date or recent dates.
- weightKg: decimal weight in kilograms. If displayed in lbs/oz (e.g. "14 lb 6 oz") or grams, convert accurately to kilograms (round to 2 decimals).
- weightLbs: integer or decimal pounds if recorded in imperial.
- weightOz: remaining ounces if recorded in imperial.
- heightCm: length or height in centimeters (round to 1 decimal).
- heightIn: length or height in inches (round to 1 decimal).
- headCircumferenceCm: head circumference in centimeters (round to 1 decimal).
- headCircumferenceIn: head circumference in inches (round to 1 decimal).
- notes: any comments, feeding note, doctor note, or milestone associated with this specific checkup.
- sourceApp: name of app or document type detected (e.g. "Huckleberry", "Sprout", "Baby Tracker", "Hatch", "Pediatrician Checkup Slip", "Epic MyChart", "Paper Record").
- confidence: "high", "medium", or "low".

Return strictly structured JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
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
          systemInstruction: 'You are an accurate pediatric assistant extracting growth metrics (date, weight, height, head circumference) from baby tracking app screenshots and doctor papers.',
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

      const parsedData = JSON.parse(response.text || '{}');
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
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TinyBloom local server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
