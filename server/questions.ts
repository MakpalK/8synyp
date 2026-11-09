import { QuestionClient, QuestionReviewItem, QuestionServerItem } from '../src/types.js';

export const MASTER_QUESTIONS: QuestionServerItem[] = [
  {
    id: 1,
    question: 'B2:B5 ұяшықтарында 12, 8, 15, 5 сандары берілген. =СУММ(B2:B5) формуласының нәтижесі қандай?',
    formula: '=СУММ(B2:B5)',
    targetFunction: 'СУММ',
    spreadsheetData: {
      columns: ['A', 'B', 'C'],
      rows: [
        { rowNum: 1, cells: { A: '№', B: 'Мән (B)', C: 'Ескертпе' } },
        { rowNum: 2, cells: { A: '1', B: 12, C: 'Өнім 1' } },
        { rowNum: 3, cells: { A: '2', B: 8, C: 'Өнім 2' } },
        { rowNum: 4, cells: { A: '3', B: 15, C: 'Өнім 3' } },
        { rowNum: 5, cells: { A: '4', B: 5, C: 'Өнім 4' } },
      ],
      highlightRange: 'B2:B5',
    },
    options: [
      { id: 'A', text: '35' },
      { id: 'B', text: '40' },
      { id: 'C', text: '27' },
      { id: 'D', text: '45' },
    ],
    correctAnswer: 'B',
    explanation: '12 + 8 + 15 + 5 = 40. СУММ() функциясы көрсетілген диапазонның барлық сандарын қосады.',
  },
  {
    id: 2,
    question: '=ABS(-18) формуласының нәтижесі қандай?',
    formula: '=ABS(-18)',
    targetFunction: 'ABS',
    spreadsheetData: {
      columns: ['A', 'B'],
      rows: [
        { rowNum: 1, cells: { A: 'Ұяшық мәні', B: 'Формула' } },
        { rowNum: 2, cells: { A: -18, B: '=ABS(A2)' } },
      ],
      highlightRange: 'A2',
    },
    options: [
      { id: 'A', text: '−18' },
      { id: 'B', text: '0' },
      { id: 'C', text: '18' },
      { id: 'D', text: '36' },
    ],
    correctAnswer: 'C',
    explanation: 'ABS() санның модулін (абсолюттік шамасын) табады. −18 санының модулі — 18.',
  },
  {
    id: 3,
    question: 'Шаршының ауданы 144 м². =КОРЕНЬ(144) формуласымен табылған қабырға ұзындығы қанша?',
    formula: '=КОРЕНЬ(144)',
    targetFunction: 'КОРЕНЬ',
    spreadsheetData: {
      columns: ['A', 'B'],
      rows: [
        { rowNum: 1, cells: { A: 'Параметр', B: 'Мәні' } },
        { rowNum: 2, cells: { A: 'Ауданы (S)', B: 144 } },
        { rowNum: 3, cells: { A: 'Қабырғасы (a)', B: '=КОРЕНЬ(B2)' } },
      ],
      highlightRange: 'B2',
    },
    options: [
      { id: 'A', text: '72 м' },
      { id: 'B', text: '14 м' },
      { id: 'C', text: '24 м' },
      { id: 'D', text: '12 м' },
    ],
    correctAnswer: 'D',
    explanation: '12 × 12 = 144. КОРЕНЬ() функциясы оң санның квадрат түбірін есептейді. Қабырғасы — 12 м.',
  },
  {
    id: 4,
    question: 'Текшенің қыры 4 м. =СТЕПЕНЬ(4;3) формуласы бойынша көлемі қанша?',
    formula: '=СТЕПЕНЬ(4;3)',
    targetFunction: 'СТЕПЕНЬ',
    spreadsheetData: {
      columns: ['A', 'B'],
      rows: [
        { rowNum: 1, cells: { A: 'Текше өлшемі', B: 'Мәні' } },
        { rowNum: 2, cells: { A: 'Қыры (a)', B: 4 } },
        { rowNum: 3, cells: { A: 'Көлемі (V)', B: '=СТЕПЕНЬ(B2;3)' } },
      ],
      highlightRange: 'B2',
    },
    options: [
      { id: 'A', text: '64 м³' },
      { id: 'B', text: '12 м³' },
      { id: 'C', text: '16 м³' },
      { id: 'D', text: '81 м³' },
    ],
    correctAnswer: 'A',
    explanation: '4 × 4 × 4 = 64 м³. СТЕПЕНЬ(сан; дәреже) функциясы санды берілген дәрежеге шығарады.',
  },
  {
    id: 5,
    question: '«Қайта өңдеу» бағытына 12 қаламсауыт және 15 қорап жатады. =СУММЕСЛИ(C2:C5;"Қайта өңдеу";B2:B5) формуласының нәтижесі қандай?',
    formula: '=СУММЕСЛИ(C2:C5;"Қайта өңдеу";B2:B5)',
    targetFunction: 'СУММЕСЛИ',
    spreadsheetData: {
      columns: ['A', 'B', 'C'],
      rows: [
        { rowNum: 1, cells: { A: 'Бұйым', B: 'Саны', C: 'Бағыты' } },
        { rowNum: 2, cells: { A: 'Қаламсауыт', B: 12, C: 'Қайта өңдеу' } },
        { rowNum: 3, cells: { A: 'Құс ұясы', B: 8, C: 'Ағаш' } },
        { rowNum: 4, cells: { A: 'Қорап', B: 15, C: 'Қайта өңдеу' } },
        { rowNum: 5, cells: { A: 'Сөре', B: 5, C: 'Ағаш' } },
      ],
      highlightRange: 'C2:C5 & B2:B5',
    },
    options: [
      { id: 'A', text: '40' },
      { id: 'B', text: '12' },
      { id: 'C', text: '27' },
      { id: 'D', text: '15' },
    ],
    correctAnswer: 'C',
    explanation: 'Шартқа сәйкес сандар қосылады: 12 + 15 = 27 («Қайта өңдеу» бағытындағы бұйымдар).',
  },
  {
    id: 6,
    question: 'C2:C5 — бұйымдардың бағыты, B2:B5 — олардың саны. «Қайта өңдеу» бағытының қосындысын табатын дұрыс формула қайсы?',
    targetFunction: 'СУММЕСЛИ',
    spreadsheetData: {
      columns: ['A', 'B', 'C'],
      rows: [
        { rowNum: 1, cells: { A: 'Бұйым', B: 'Саны (B2:B5)', C: 'Бағыты (C2:C5)' } },
        { rowNum: 2, cells: { A: 'Қаламсауыт', B: 12, C: 'Қайта өңдеу' } },
        { rowNum: 3, cells: { A: 'Құс ұясы', B: 8, C: 'Ағаш' } },
        { rowNum: 4, cells: { A: 'Қорап', B: 15, C: 'Қайта өңдеу' } },
        { rowNum: 5, cells: { A: 'Сөре', B: 5, C: 'Ағаш' } },
      ],
      highlightRange: 'C2:C5',
    },
    options: [
      { id: 'A', text: '=СУММ(C2:C5)' },
      { id: 'B', text: '=СУММЕСЛИ(C2:C5;"Қайта өңдеу";B2:B5)' },
      { id: 'C', text: '=КОРЕНЬ(B2:B5)' },
      { id: 'D', text: '=СУММЕСЛИ(B2:B5;"Қайта өңдеу";C2:C5)' },
    ],
    correctAnswer: 'B',
    explanation: 'Бірінші аргумент — шарт тексерілетін диапазон (C2:C5), екіншісі — шарт ("Қайта өңдеу"), үшіншісі — қосылатын сандар диапазоны (B2:B5).',
  },
  {
    id: 7,
    question: 'F2 ұяшығында жоспар — 45, F3 ұяшығында нақты сан — 40. Айырманың модулін табатын формула қайсы?',
    targetFunction: 'ABS',
    spreadsheetData: {
      columns: ['E', 'F'],
      rows: [
        { rowNum: 1, cells: { E: 'Көрсеткіш', F: 'Мән' } },
        { rowNum: 2, cells: { E: 'Жоспар (F2)', F: 45 } },
        { rowNum: 3, cells: { E: 'Нақты (F3)', F: 40 } },
      ],
      highlightRange: 'F2:F3',
    },
    options: [
      { id: 'A', text: '=СУММ(F2:F3)' },
      { id: 'B', text: '=КОРЕНЬ(F2-F3)' },
      { id: 'C', text: '=ABS(F2-F3)' },
      { id: 'D', text: '=СТЕПЕНЬ(F2;F3)' },
    ],
    correctAnswer: 'C',
    explanation: 'ABS(45 − 40) = 5. =ABS(F2-F3) немесе =ABS(F3-F2) айырманың оң мәнін (модулін) табады.',
  },
  {
    id: 8,
    question: 'Барлық бұйымның саны B2:B5 диапазонында жазылған. =СУММ(B2:B4) формуласын қалай түзету керек?',
    formula: '=СУММ(B2:B4)',
    targetFunction: 'СУММ',
    spreadsheetData: {
      columns: ['A', 'B'],
      rows: [
        { rowNum: 1, cells: { A: 'Бұйым атауы', B: 'Саны' } },
        { rowNum: 2, cells: { A: 'Бұйым 1', B: 12 } },
        { rowNum: 3, cells: { A: 'Бұйым 2', B: 8 } },
        { rowNum: 4, cells: { A: 'Бұйым 3', B: 15 } },
        { rowNum: 5, cells: { A: 'Бұйым 4 (соңғы)', B: 5 } },
      ],
      highlightRange: 'B2:B5',
    },
    options: [
      { id: 'A', text: '=СУММ(B2:B5)' },
      { id: 'B', text: '=СУММ(B2:B3)' },
      { id: 'C', text: '=ABS(B5)' },
      { id: 'D', text: '=СУММ(B3:B5)' },
    ],
    correctAnswer: 'A',
    explanation: 'Бастапқы формула B5 ұяшығын қамтымайды. Барлық бұйымды қосу үшін =СУММ(B2:B5) деп жазу керек.',
  },
  {
    id: 9,
    question: 'E8 ұяшығында −16 саны берілген. Осы сан модулінің квадрат түбірін табатын формула қайсы?',
    targetFunction: 'КОРЕНЬ',
    spreadsheetData: {
      columns: ['D', 'E'],
      rows: [
        { rowNum: 7, cells: { D: 'Параметр', E: 'Мәні' } },
        { rowNum: 8, cells: { D: 'Сан мәні (E8)', E: -16 } },
      ],
      highlightRange: 'E8',
    },
    options: [
      { id: 'A', text: '=ABS(КОРЕНЬ(E8))' },
      { id: 'B', text: '=КОРЕНЬ(ABS(E8))' },
      { id: 'C', text: '=СТЕПЕНЬ(E8;2)' },
      { id: 'D', text: '=КОРЕНЬ(E8)' },
    ],
    correctAnswer: 'B',
    explanation: 'Алдымен ABS(E8) = 16 есептеледі, содан кейін КОРЕНЬ(16) = 4 табылады: =КОРЕНЬ(ABS(E8)). Теріс саннан бірден түбір шығарылмайды.',
  },
  {
    id: 10,
    question: '«Ағаш» бағытына 8 құс ұясы және 5 сөре жатады. =СУММЕСЛИ(C2:C5;"Ағаш";B2:B5) формуласының нәтижесі қандай?',
    formula: '=СУММЕСЛИ(C2:C5;"Ағаш";B2:B5)',
    targetFunction: 'СУММЕСЛИ',
    spreadsheetData: {
      columns: ['A', 'B', 'C'],
      rows: [
        { rowNum: 1, cells: { A: 'Бұйым', B: 'Саны', C: 'Бағыты' } },
        { rowNum: 2, cells: { A: 'Қаламсауыт', B: 12, C: 'Қайта өңдеу' } },
        { rowNum: 3, cells: { A: 'Құс ұясы', B: 8, C: 'Ағаш' } },
        { rowNum: 4, cells: { A: 'Қорап', B: 15, C: 'Қайта өңдеу' } },
        { rowNum: 5, cells: { A: 'Сөре', B: 5, C: 'Ағаш' } },
      ],
      highlightRange: 'C2:C5 & B2:B5',
    },
    options: [
      { id: 'A', text: '40' },
      { id: 'B', text: '8' },
      { id: 'C', text: '27' },
      { id: 'D', text: '13' },
    ],
    correctAnswer: 'D',
    explanation: 'Шартқа сәйкес тек «Ағаш» бағытындағы бұйымдар саналады: 8 + 5 = 13.',
  },
];

// Returns questions for student client without answer keys or explanations
export function getClientQuestions(): QuestionClient[] {
  return MASTER_QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question,
    formula: q.formula,
    targetFunction: q.targetFunction,
    spreadsheetData: q.spreadsheetData,
    options: q.options,
  }));
}

// Strictly evaluate student answers on server side
export function evaluateStudentSubmission(answers: Record<number, string>): {
  score: number;
  maxScore: number;
  reviewItems: QuestionReviewItem[];
} {
  let score = 0;
  const reviewItems: QuestionReviewItem[] = [];

  for (const q of MASTER_QUESTIONS) {
    const studentAnswer = (answers[q.id] || '').trim().toUpperCase();
    const isCorrect = studentAnswer === q.correctAnswer;

    if (isCorrect) {
      score += 1;
    }

    reviewItems.push({
      id: q.id,
      question: q.question,
      formula: q.formula,
      targetFunction: q.targetFunction,
      options: q.options,
      studentAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      spreadsheetData: q.spreadsheetData,
    });
  }

  return {
    score,
    maxScore: MASTER_QUESTIONS.length,
    reviewItems,
  };
}
