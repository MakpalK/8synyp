import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { getClientQuestions, evaluateStudentSubmission } from './server/questions.js';
import { saveSubmission, getLeaderboard, resetDatabase, getAllSubmissions } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsing
app.use(express.json());

// API: Get questions without correct answer keys
app.get('/api/questions', (_req: Request, res: Response) => {
  try {
    const questions = getClientQuestions();
    res.json({ questions, total: questions.length });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Сұрақтарды жүктеу кезінде қате орын алды' });
  }
});

// API: Submit quiz - strictly evaluated on server
app.post('/api/submit', (req: Request, res: Response) => {
  try {
    const { studentName, studentClass, answers, sessionId } = req.body;

    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return res.status(400).json({ error: 'Оқушының атын дұрыс енгізіңіз (кемінде 2 әріп)' });
    }

    if (!studentClass || typeof studentClass !== 'string' || studentClass.trim().length < 1) {
      return res.status(400).json({ error: 'Сыныбыңызды көрсетіңіз (мысалы: 8А)' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Жауаптар толық жіберілмеді' });
    }

    const cleanedName = studentName.trim();
    const cleanedClass = studentClass.trim().toUpperCase();
    const cleanSessionId = typeof sessionId === 'string' && sessionId.trim() ? sessionId.trim() : crypto.randomUUID();

    // Check if all 10 questions are answered
    const questions = getClientQuestions();
    const missing: number[] = [];
    for (const q of questions) {
      if (!answers[q.id] || typeof answers[q.id] !== 'string' || !answers[q.id].trim()) {
        missing.push(q.id);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Ойынды аяқтау үшін барлық сұраққа жауап беру қажет! Жауап берілмеген сұрақтар: № ${missing.join(', ')}`,
        missingQuestionIds: missing,
      });
    }

    // Evaluate answers strictly on server
    const evaluation = evaluateStudentSubmission(answers);

    // Save submission to database (idempotent on sessionId)
    const newRecord = {
      id: crypto.randomUUID(),
      sessionId: cleanSessionId,
      studentName: cleanedName,
      studentClass: cleanedClass,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      answers,
      createdAt: new Date().toISOString(),
    };

    const saveResult = saveSubmission(newRecord);

    return res.json({
      success: true,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      studentName: cleanedName,
      studentClass: cleanedClass,
      sessionId: cleanSessionId,
      createdAt: saveResult.submission.createdAt,
      savedToDatabase: saveResult.saved,
      isDuplicateAttempt: saveResult.isDuplicate,
      results: evaluation.reviewItems,
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    return res.status(500).json({ error: 'Нәтижені өңдеу немесе сақтау кезінде қате орын алды' });
  }
});

// API: Get shared leaderboard (best score per student, sorted)
app.get('/api/leaderboard', (req: Request, res: Response) => {
  try {
    const classFilter = req.query.class as string | undefined;
    const data = getLeaderboard(classFilter);
    res.json(data);
  } catch (err) {
    console.error('Error getting leaderboard:', err);
    res.status(500).json({ error: 'Нәтижелер кестесін жүктеу сәтсіз аяқталды' });
  }
});

// API: Teacher password verification
app.post('/api/teacher/verify', (req: Request, res: Response) => {
  const { teacherKey } = req.body;
  const masterKey = process.env.TEACHER_KEY || 'ustaz2026';
  const isValid = Boolean(teacherKey && teacherKey.trim() === masterKey);
  res.json({ valid: isValid });
});

// API: Teacher reset / clear database
app.post('/api/teacher/reset', (req: Request, res: Response) => {
  const { teacherKey } = req.body;
  const result = resetDatabase(teacherKey);
  if (!result.success) {
    return res.status(403).json(result);
  }
  return res.json(result);
});

// API: Export CSV of results with UTF-8 BOM
app.get('/api/export-csv', (req: Request, res: Response) => {
  try {
    const classFilter = req.query.class as string | undefined;
    const leaderboardData = getLeaderboard(classFilter);

    // UTF-8 BOM for Microsoft Excel compatibility with Cyrillic/Kazakh glyphs
    let csv = '\uFEFF';
    csv += 'Орын,Оқушының аты,Сыныбы,Ұпайы,Максимум,Тапсырған күні,Әрекет саны\n';

    for (const item of leaderboardData.leaderboard) {
      const escapeCsv = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
      csv += `${item.rank},${escapeCsv(item.studentName)},${escapeCsv(item.studentClass)},${item.score},${item.maxScore},${escapeCsv(item.formattedDate)},${item.attemptsCount || 1}\n`;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Formula_Sheberi_Natizheler.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).send('CSV файлын жасау кезінде қате орын алды');
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Formula Sheberi] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
