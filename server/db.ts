import fs from 'fs';
import path from 'path';

export interface StoredSubmission {
  id: string;
  sessionId: string;
  studentName: string;
  studentClass: string;
  score: number;
  maxScore: number;
  answers: Record<number, string>;
  createdAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'submissions.json');

// Ensure data folder and file exist
function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

// Read all stored submissions
export function getAllSubmissions(): StoredSubmission[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read submissions:', err);
    return [];
  }
}

// Atomically save a submission, preventing duplicate sessionIds
export function saveSubmission(newSub: StoredSubmission): { saved: boolean; submission: StoredSubmission; isDuplicate: boolean } {
  ensureDataFile();
  const all = getAllSubmissions();

  // Idempotency check: if this session was already submitted, return the existing one
  const existing = all.find((s) => s.sessionId === newSub.sessionId);
  if (existing) {
    return { saved: true, submission: existing, isDuplicate: true };
  }

  all.push(newSub);

  // Atomic write to temporary file, then rename
  const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(all, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return { saved: true, submission: newSub, isDuplicate: false };
  } catch (err) {
    console.error('Failed to write submission:', err);
    if (fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch (_) {}
    }
    throw err;
  }
}

// Compute leaderboard: best score per student (name + class), sorted by score DESC, earlier date ASC
export function getLeaderboard(classFilter?: string) {
  const all = getAllSubmissions();

  // Group by student key
  const studentMap = new Map<
    string,
    {
      bestSubmission: StoredSubmission;
      attemptsCount: number;
    }
  >();

  for (const sub of all) {
    const key = `${sub.studentName.trim().toLowerCase()}___${sub.studentClass.trim().toLowerCase()}`;
    const current = studentMap.get(key);

    if (!current) {
      studentMap.set(key, { bestSubmission: sub, attemptsCount: 1 });
    } else {
      current.attemptsCount += 1;
      // If current submission has higher score, or equal score achieved earlier
      const currentBest = current.bestSubmission;
      if (
        sub.score > currentBest.score ||
        (sub.score === currentBest.score && new Date(sub.createdAt).getTime() < new Date(currentBest.createdAt).getTime())
      ) {
        current.bestSubmission = sub;
      }
    }
  }

  // Convert to leaderboard list
  let entries = Array.from(studentMap.values()).map((item) => {
    const s = item.bestSubmission;
    const dateObj = new Date(s.createdAt);
    const formattedDate = dateObj.toLocaleDateString('kk-KZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      studentName: s.studentName,
      studentClass: s.studentClass,
      score: s.score,
      maxScore: s.maxScore || 10,
      createdAt: s.createdAt,
      formattedDate,
      attemptsCount: item.attemptsCount,
    };
  });

  // Extract unique classes
  const classesSet = new Set<string>();
  for (const sub of all) {
    if (sub.studentClass) {
      classesSet.add(sub.studentClass.trim().toUpperCase());
    }
  }
  const classes = Array.from(classesSet).sort();

  // Apply optional class filter
  if (classFilter && classFilter !== 'all' && classFilter !== 'барлығы') {
    entries = entries.filter(
      (e) => e.studentClass.trim().toUpperCase() === classFilter.trim().toUpperCase()
    );
  }

  // Sort: highest score first, then earliest created first
  entries.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Add 1-based ranks
  const rankedEntries = entries.map((e, index) => ({
    rank: index + 1,
    ...e,
  }));

  return {
    leaderboard: rankedEntries,
    totalSubmissions: all.length,
    classes,
    lastUpdated: new Date().toISOString(),
  };
}

// Teacher reset database
export function resetDatabase(providedKey: string): { success: boolean; message: string } {
  const masterKey = process.env.TEACHER_KEY || 'ustaz2026';
  if (!providedKey || providedKey.trim() !== masterKey) {
    return { success: false, message: 'Құпиясөз қате! Тазалауға рұқсат берілмеді.' };
  }

  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return { success: true, message: 'Барлық оқушылардың нәтижелері сәтті тазаланды.' };
  } catch (err) {
    console.error('Failed to reset database:', err);
    return { success: false, message: 'Дерекқорды тазалау кезінде қате орын алды.' };
  }
}
