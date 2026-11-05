import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { analyzeNewsContent } from './src/lib/mlEngine.ts';
import { AnalysisResult, User } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent database store
interface DBStore {
  users: User[];
  analyses: AnalysisResult[];
}

const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function loadDB(): DBStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading db.json:', err);
  }
  return {
    users: [
      {
        id: 'usr-admin-1',
        name: 'Prof. Radhika Menon',
        email: 'admin@truthscan.ai',
        role: 'admin',
        institution: 'Dept of Computer Science & Engineering',
        createdAt: '2026-09-01T10:00:00Z',
        avatarSeed: 'admin'
      },
      {
        id: 'usr-demo-1',
        name: 'Neha Mehrin',
        email: 'nehanamehrin28@gmail.com',
        role: 'user',
        institution: 'B.Tech CSE Final Year Batch',
        createdAt: '2026-10-15T14:20:00Z',
        avatarSeed: 'neha'
      }
    ],
    analyses: [
      {
        id: 'ts-init-1',
        title: 'WHO Confirms New Global Pediatric Health Advisory for Monsoon Season',
        originalText: 'According to an official statement released by the World Health Organization spokesperson on Tuesday, public health ministries confirmed new clinical guidelines for pediatric care.',
        inputMode: 'article',
        prediction: 'Likely Real News',
        confidenceScore: 92.4,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        modelAlgorithm: 'Passive Aggressive Classifier (TF-IDF Vectorized)',
        diagnostics: {
          subjectivityScore: 18,
          sensationalismIndex: 12,
          syntacticComplexity: 'Moderate',
          readingGradeLevel: 'Standard (High School)',
          emotionalTone: 'Objective',
          keyMarkers: [
            { term: 'official statement', weight: 3.2, type: 'credible', explanation: 'Documented formal communique' },
            { term: 'spokesperson', weight: 2.8, type: 'credible', explanation: 'Attributed institutional spokesperson' },
            { term: 'according to', weight: 2.8, type: 'credible', explanation: 'Standard attribution citation syntax' }
          ],
          wordCount: 31,
          detectedLanguage: 'English'
        },
        limitationsNotice: 'Predictions are automated statistical probability estimates by an NLP model and do not constitute absolute editorial fact-checks.',
        verificationAdvice: [
          'Locate the primary source at the named agency press room.',
          'Verify author credentials and editorial attribution.'
        ],
        userId: 'usr-demo-1'
      },
      {
        id: 'ts-init-2',
        title: 'SHOCKING BOMBSHELL: Miracle fruit banned from TV cures all joint pain in 48 hours!',
        originalText: 'URGENT share before this gets deleted! Secret conspiracy doctors don’t want you to know: unbelievable proof that miraculous ancient fruit cures arthritis!',
        inputMode: 'headline',
        prediction: 'Potentially Fake News',
        confidenceScore: 96.1,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        modelAlgorithm: 'Passive Aggressive Classifier (TF-IDF Vectorized)',
        diagnostics: {
          subjectivityScore: 88,
          sensationalismIndex: 94,
          syntacticComplexity: 'Low',
          readingGradeLevel: 'Elementary / Conversational',
          emotionalTone: 'Sensational / Urgent',
          keyMarkers: [
            { term: 'shocking', weight: -3.4, type: 'suspicious', explanation: 'Sensationalist hyperbolic emotional hook' },
            { term: 'bombshell', weight: -3.8, type: 'suspicious', explanation: 'Tabloid trigger term used to bypass evidence' },
            { term: 'miracle', weight: -3.6, type: 'suspicious', explanation: 'Unscientific pseudoscientific claim indicator' },
            { term: 'conspiracy', weight: -3.2, type: 'suspicious', explanation: 'Unsubstantiated systemic collusion narrative' }
          ],
          wordCount: 23,
          detectedLanguage: 'English'
        },
        limitationsNotice: 'Predictions are automated statistical probability estimates by an NLP model and do not constitute absolute editorial fact-checks.',
        verificationAdvice: [
          'Check scientific registry on PubMed / WHO clinical trials.',
          'Verify if claim relies on artificial urgency tricks.'
        ],
        userId: 'usr-demo-1'
      }
    ]
  };
}

function saveDB(store: DBStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

const db = loadDB();

// SSRF Checker helper
function isSafeUrl(rawUrl: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Protocol must be HTTP or HTTPS.' };
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host === 'metadata.google.internal' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.')
    ) {
      return { safe: false, reason: 'Requests to local or private networks are strictly restricted.' };
    }
    return { safe: true };
  } catch (e) {
    return { safe: false, reason: 'Invalid URL format.' };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'TruthScan Verification Engine',
      classifier: 'Passive Aggressive Classifier',
      accuracy: 0.9385,
      timestamp: new Date().toISOString()
    });
  });

  // URL extraction with SSRF security
  app.post('/api/extract-url', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }
    const check = isSafeUrl(url);
    if (!check.safe) {
      return res.status(400).json({ error: check.reason });
    }

    try {
      const client = url.startsWith('https') ? https : http;
      const requestOptions = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TruthScanBot/2.0; +https://truthscan.ai/bot)'
        },
        timeout: 6000
      };

      const fetchPromise = new Promise<{ title: string; text: string }>((resolve, reject) => {
        const reqNet = client.get(url, requestOptions, (netRes) => {
          if (netRes.statusCode && netRes.statusCode >= 400) {
            return reject(new Error(`Server responded with status code ${netRes.statusCode}`));
          }
          let rawData = '';
          netRes.setEncoding('utf8');
          netRes.on('data', (chunk) => {
            rawData += chunk;
            if (rawData.length > 500000) {
              netRes.destroy();
            }
          });
          netRes.on('end', () => {
            // Simple title and text extract
            const titleMatch = rawData.match(/<title[^>]*>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : 'Extracted News Article';
            
            // Strip scripts and styles
            const cleanHtml = rawData
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            resolve({ title, text: cleanHtml.slice(0, 3000) });
          });
        });
        reqNet.on('error', (e) => reject(e));
        reqNet.on('timeout', () => {
          reqNet.destroy();
          reject(new Error('Request timed out while connecting to destination.'));
        });
      });

      const extracted = await fetchPromise;
      res.json(extracted);
    } catch (err: any) {
      res.status(500).json({ error: `Failed to safely extract article: ${err.message || err}` });
    }
  });

  // Main Analyze route
  app.post('/api/analyze', (req: Request, res: Response) => {
    const { content, type = 'headline', title, url, userId } = req.body;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'News content cannot be empty.' });
    }

    const result = analyzeNewsContent(content, type, title, url);
    if (userId) {
      result.userId = userId;
    }
    
    // Persist in DB
    db.analyses.unshift(result);
    // Keep max 200 items in memory
    if (db.analyses.length > 200) {
      db.analyses = db.analyses.slice(0, 200);
    }
    saveDB(db);

    res.json(result);
  });

  // History endpoints
  app.get('/api/history', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    if (userId) {
      return res.json(db.analyses.filter(a => a.userId === userId));
    }
    res.json(db.analyses);
  });

  app.delete('/api/history/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const initialLen = db.analyses.length;
    db.analyses = db.analyses.filter(a => a.id !== id);
    if (db.analyses.length !== initialLen) {
      saveDB(db);
      res.json({ success: true, message: 'Record deleted.' });
    } else {
      res.status(404).json({ error: 'Analysis record not found.' });
    }
  });

  app.delete('/api/history', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    if (userId) {
      db.analyses = db.analyses.filter(a => a.userId !== userId);
    } else {
      db.analyses = [];
    }
    saveDB(db);
    res.json({ success: true, message: 'History cleared.' });
  });

  // Global and User Statistics
  app.get('/api/stats', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const records = userId ? db.analyses.filter(a => a.userId === userId) : db.analyses;

    const totalAnalyzed = records.length;
    const realCount = records.filter(r => r.prediction === 'Likely Real News').length;
    const fakeCount = records.filter(r => r.prediction === 'Potentially Fake News').length;
    const averageConfidence = totalAnalyzed > 0 
      ? Math.round(records.reduce((acc, r) => acc + r.confidenceScore, 0) / totalAnalyzed * 10) / 10 
      : 0;

    const now = new Date();
    const todayCount = records.filter(r => {
      const d = new Date(r.timestamp);
      return d.toDateString() === now.toDateString();
    }).length;

    const headlineCount = records.filter(r => r.inputMode === 'headline').length;
    const articleCount = records.filter(r => r.inputMode === 'article').length;
    const urlCount = records.filter(r => r.inputMode === 'url').length;

    res.json({
      totalAnalyzed,
      realCount,
      fakeCount,
      averageConfidence,
      todayCount,
      headlineCount,
      articleCount,
      urlCount
    });
  });

  // User management
  app.get('/api/admin/users', (req: Request, res: Response) => {
    res.json(db.users);
  });

  // Vite middlewares setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`TruthScan Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
