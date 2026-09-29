import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
// @ts-ignore - Vite wasm URL loader
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import questionsData from './questions.json';

// --- TYPES ---
export type Subject =
  | 'Língua Portuguesa'
  | 'Matemática'
  | 'História'
  | 'Geografia'
  | 'Ciências';

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface Question {
  id: number;
  subject: Subject | string;
  topic: string;
  difficulty: Difficulty | string;
  year: string;
  source: string;
  context_text?: string | null;
  statement: string;
  options: string[];
  correct_index: number;
  explanation: string;
  study_url?: string;
  study_title?: string;
}

export interface QuestionHistoryRecord {
  id?: number;
  question_id: number;
  selected_index: number;
  is_correct: boolean;
  time_spent_seconds: number;
  answered_at: string;
  simulado_id?: string | null;
}

export interface SimuladoAnswer {
  questionId: number;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  flagged?: boolean;
}

export interface SimuladoRecord {
  id: string;
  title: string;
  mode: 'full' | 'express' | 'subject' | 'custom' | 'review';
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  time_spent_seconds: number;
  created_at: string;
  answers: SimuladoAnswer[];
}

export interface BookmarkRecord {
  question_id: number;
  created_at: string;
  note?: string;
}

export interface FlashcardRecord {
  id: number;
  subject: string;
  topic: string;
  front: string;
  back: string;
  interval: number;
  repetitions: number;
  ease_factor: number;
  due_date: string;
}

export interface SubjectStats {
  subject: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  averageTimeSeconds: number;
}

export interface PerformanceStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalSimulados: number;
  averageSimuladoScore: number;
  totalStudyTimeSeconds: number;
  streakDays: number;
  subjectStats: SubjectStats[];
  difficultyStats: { difficulty: string; answered: number; correct: number; accuracy: number }[];
  recentSimulados: SimuladoRecord[];
  wrongQuestionIds: number[];
}

export interface FilterOptions {
  subject?: string;
  topic?: string;
  difficulty?: string;
  year?: string;
  searchTerm?: string;
  status?: 'all' | 'unanswered' | 'correct' | 'wrong' | 'bookmarked';
}


const DB_STORAGE_KEY = 'simulaif_sqlite_db_v1';
const DB_NAME = 'SimulaIF_DB';
const STORE_NAME = 'sqlite_binary';

// @ts-ignore
import initSqlJsAsm from 'sql.js/dist/sql-asm.js';

let sqlJsInstanceCache: SqlJsStatic | null = null;

async function loadSqlInstance(): Promise<SqlJsStatic> {
  if (sqlJsInstanceCache) return sqlJsInstanceCache;

  // 1. Pure JavaScript ASM.JS SQLite (100% reliable, zero network dependency, no WASM fetch or CSP errors)
  try {
    const SQL = await (initSqlJsAsm as unknown as () => Promise<SqlJsStatic>)();
    sqlJsInstanceCache = SQL;
    return SQL;
  } catch (err1) {
    console.warn('ASM.js initialization failed, attempting WASM...', err1);
  }

  // 2. Fallback to WASM
  try {
    const SQL = await initSqlJs({
      locateFile: () => sqlWasmUrl
    });
    sqlJsInstanceCache = SQL;
    return SQL;
  } catch (err2) {
    console.error('All SQLite initializations failed:', err2);
    throw err2;
  }
}

class SqliteService {
  private db: Database | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.isInitialized && this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const SQL = await loadSqlInstance();

        const savedData = await this.loadFromIndexedDB();
        if (savedData && savedData.length > 0) {
          try {
            this.db = new SQL.Database(savedData);
          } catch (err) {
            console.warn('Could not load existing SQLite binary, creating fresh DB', err);
            this.db = new SQL.Database();
          }
        } else {
          this.db = new SQL.Database();
        }

        this.createSchema();
        this.syncQuestionsFromJSON();
        this.seedDefaultFlashcards();
        this.isInitialized = true;
        await this.persistToIndexedDB();
      } catch (err) {
        console.error('Error initializing SQLite DB:', err);
        throw err;
      }
    })();

    return this.initPromise;
  }

  private createSchema(): void {
    if (!this.db) return;

    this.db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        year TEXT NOT NULL,
        source TEXT NOT NULL,
        context_text TEXT,
        statement TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_index INTEGER NOT NULL,
        explanation TEXT NOT NULL,
        study_url TEXT,
        study_title TEXT
      );

      CREATE TABLE IF NOT EXISTS question_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        selected_index INTEGER NOT NULL,
        is_correct INTEGER NOT NULL,
        time_spent_seconds INTEGER NOT NULL,
        answered_at TEXT NOT NULL,
        simulado_id TEXT
      );

      CREATE TABLE IF NOT EXISTS simulados (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        mode TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        score_percentage REAL NOT NULL,
        time_spent_seconds INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        answers_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        question_id INTEGER PRIMARY KEY,
        created_at TEXT NOT NULL,
        note TEXT
      );

      CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        interval INTEGER DEFAULT 1,
        repetitions INTEGER DEFAULT 0,
        ease_factor REAL DEFAULT 2.5,
        due_date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS study_goals (
        id INTEGER PRIMARY KEY,
        daily_target_questions INTEGER DEFAULT 20,
        daily_target_minutes INTEGER DEFAULT 45,
        streak_days INTEGER DEFAULT 0,
        last_study_date TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
      CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
      CREATE INDEX IF NOT EXISTS idx_history_qid ON question_history(question_id);
    `);

    // Defensive migrations in case DB was previously restored from older IndexedDB cache
    try {
      this.db.run('ALTER TABLE questions ADD COLUMN study_url TEXT;');
    } catch {
      // Column may already exist
    }
    try {
      this.db.run('ALTER TABLE questions ADD COLUMN study_title TEXT;');
    } catch {
      // Column may already exist
    }
    try {
      this.db.run("UPDATE questions SET subject = 'Ciências' WHERE subject IN ('Física', 'Química', 'Biologia');");
      this.db.run("UPDATE flashcards SET subject = 'Ciências' WHERE subject IN ('Física', 'Química', 'Biologia');");
    } catch {
      // ignore
    }
  }

  private syncQuestionsFromJSON(): void {
    if (!this.db) return;

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO questions 
      (id, subject, topic, difficulty, year, source, context_text, statement, options_json, correct_index, explanation, study_url, study_title)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      this.db.run('BEGIN TRANSACTION;');
      for (const q of questionsData as Question[]) {
        stmt.run([
          q.id,
          q.subject,
          q.topic,
          q.difficulty,
          q.year,
          q.source,
          q.context_text || null,
          q.statement,
          JSON.stringify(q.options),
          q.correct_index,
          q.explanation,
          q.study_url || null,
          q.study_title || null
        ]);
      }
      this.db.run('COMMIT;');
    } catch (e) {
      this.db.run('ROLLBACK;');
      console.error('Error syncing questions to SQLite:', e);
    } finally {
      stmt.free();
    }
  }

  private seedDefaultFlashcards(): void {
    if (!this.db) return;

    const res = this.db.exec('SELECT COUNT(*) as count FROM flashcards;');
    const count = (res[0]?.values[0]?.[0] as number) || 0;
    if (count > 0) return;

    const defaultFlashcards = [
      {
        subject: 'Matemática',
        topic: 'Geometria Plana',
        front: 'Qual é o Teorema de Pitágoras e em que tipo de triângulo se aplica?',
        back: 'Aplica-se em triângulos retângulos: a² = b² + c² (o quadrado da hipotenusa é igual à soma dos quadrados dos catetos).'
      },
      {
        subject: 'Matemática',
        topic: 'Álgebra',
        front: 'Qual é a fórmula de Bhaskara e do discriminante (Delta)?',
        back: 'Δ = b² - 4ac. As raízes são dadas por: x = (-b ± √Δ) / (2a).'
      },
      {
        subject: 'Ciências',
        topic: 'Eletrodinâmica',
        front: 'Qual é a 1ª Lei de Ohm e a fórmula de potência elétrica?',
        back: '1ª Lei de Ohm: U = R · i (Tensão = Resistência × Corrente). Potência: P = U · i = R · i².'
      },
      {
        subject: 'Ciências',
        topic: 'Cinemática',
        front: 'Qual a fórmula da velocidade escalar média?',
        back: 'Vm = ΔS / Δt (Variação do espaço dividida pela variação do tempo).'
      },
      {
        subject: 'Ciências',
        topic: 'Funções Inorgânicas',
        front: 'O que caracteriza uma reação de Neutralização Total?',
        back: 'Ácido + Base → Sal + Água. Exemplo: HCl + NaOH → NaCl + H₂O.'
      },
      {
        subject: 'Língua Portuguesa',
        topic: 'Sintaxe e Crase',
        front: 'Quais são as três regras proibitivas fundamentais do uso da crase?',
        back: '1) Antes de palavras masculinas; 2) Antes de verbos; 3) Antes de pronomes que não aceitam artigo (ex: ela, esta, alguém, todos).'
      },
      {
        subject: 'História',
        topic: 'Pernambuco',
        front: 'O que foi a Revolução Pernambucana de 1817?',
        back: 'Movimento republicano e separatista de 1817 motivado pela insatisfação contra os altos impostos da corte de D. João VI, a seca de 1816 e crise açucareira.'
      },
      {
        subject: 'Geografia',
        topic: 'Pernambuco',
        front: 'Quais são as quatro mesorregiões geográficas de Pernambuco do litoral ao interior?',
        back: '1) Metropolitana do Recife; 2) Zona da Mata (Mata Atlântica); 3) Agreste (faixa de transição / Planalto da Borborema); 4) Sertão (Semiárido / Caatinga).'
      },
      {
        subject: 'Ciências',
        topic: 'Citologia',
        front: 'Qual a função da Mitocôndria e do Ribossomo?',
        back: 'Mitocôndria: Respiração celular e síntese de ATP (energia). Ribossomo: Síntese de proteínas.'
      }
    ];

    const today = new Date().toISOString().split('T')[0];
    const stmt = this.db.prepare(`
      INSERT INTO flashcards (subject, topic, front, back, interval, repetitions, ease_factor, due_date)
      VALUES (?, ?, ?, ?, 1, 0, 2.5, ?)
    `);

    for (const card of defaultFlashcards) {
      stmt.run([card.subject, card.topic, card.front, card.back, today]);
    }
    stmt.free();
  }

  private openIDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async persistToIndexedDB(): Promise<void> {
    if (!this.db) return;
    try {
      const binary = this.db.export();
      const idb = await this.openIDB();
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(binary, 'sqlite_file');
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Could not persist SQLite to IndexedDB, fallback to localStorage cache', err);
    }
  }

  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    try {
      const idb = await this.openIDB();
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('sqlite_file');
      return new Promise((resolve) => {
        req.onsuccess = () => {
          if (req.result instanceof Uint8Array) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // --- HELPER MAPPING ---

  private mapRowToQuestion(row: any[]): Question {
    return {
      id: row[0] as number,
      subject: row[1] as string,
      topic: row[2] as string,
      difficulty: row[3] as string,
      year: row[4] as string,
      source: row[5] as string,
      context_text: (row[6] as string) || null,
      statement: row[7] as string,
      options: JSON.parse((row[8] as string) || '[]'),
      correct_index: row[9] as number,
      explanation: row[10] as string,
      study_url: (row[11] as string) || undefined,
      study_title: (row[12] as string) || undefined
    };
  }

  // --- QUERY METHODS ---

  getAllQuestions(): Question[] {
    if (!this.db) return [];
    const res = this.db.exec(`
      SELECT id, subject, topic, difficulty, year, source, context_text, statement, options_json, correct_index, explanation, study_url, study_title
      FROM questions ORDER BY id ASC
    `);
    if (!res[0]) return [];

    return res[0].values.map((row) => this.mapRowToQuestion(row));
  }

  getFilteredQuestions(filters: FilterOptions): Question[] {
    if (!this.db) return [];

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.subject && filters.subject !== 'Todas') {
      conditions.push('q.subject = ?');
      params.push(filters.subject);
    }

    if (filters.topic && filters.topic !== 'Todos') {
      conditions.push('q.topic LIKE ?');
      params.push(`%${filters.topic}%`);
    }

    if (filters.difficulty && filters.difficulty !== 'Todas') {
      conditions.push('q.difficulty = ?');
      params.push(filters.difficulty);
    }

    if (filters.year && filters.year !== 'Todos') {
      conditions.push('q.year = ?');
      params.push(filters.year);
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      conditions.push('(q.statement LIKE ? OR q.topic LIKE ? OR q.explanation LIKE ?)');
      const term = `%${filters.searchTerm.trim()}%`;
      params.push(term, term, term);
    }

    let joinBookmarks = '';
    let joinHistory = '';

    if (filters.status === 'bookmarked') {
      joinBookmarks = 'INNER JOIN bookmarks b ON q.id = b.question_id';
    } else if (filters.status === 'wrong') {
      conditions.push(`q.id IN (
        SELECT question_id FROM question_history WHERE is_correct = 0
      )`);
    } else if (filters.status === 'correct') {
      conditions.push(`q.id IN (
        SELECT question_id FROM question_history WHERE is_correct = 1
      )`);
    } else if (filters.status === 'unanswered') {
      conditions.push(`q.id NOT IN (
        SELECT DISTINCT question_id FROM question_history
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT q.id, q.subject, q.topic, q.difficulty, q.year, q.source, q.context_text, q.statement, q.options_json, q.correct_index, q.explanation, q.study_url, q.study_title
      FROM questions q
      ${joinBookmarks}
      ${joinHistory}
      ${whereClause}
      ORDER BY q.id ASC
    `;

    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const questions: Question[] = [];

    while (stmt.step()) {
      questions.push(this.mapRowToQuestion(stmt.get()));
    }
    stmt.free();
    return questions;
  }

  getRandomSimuladoQuestions(count = 30, subject?: string): Question[] {
    if (!this.db) return [];
    let sql = `
      SELECT q.id, q.subject, q.topic, q.difficulty, q.year, q.source, q.context_text, q.statement, q.options_json, q.correct_index, q.explanation, q.study_url, q.study_title
      FROM questions q
      LEFT JOIN (
        SELECT question_id, COUNT(*) as answer_count
        FROM question_history
        GROUP BY question_id
      ) h ON q.id = h.question_id
    `;
    const params: (string | number)[] = [];

    if (subject && subject !== 'Geral') {
      sql += ` WHERE q.subject = ?`;
      params.push(subject);
    }

    // Prioritize questions with fewest previous answers, then randomize
    sql += ` ORDER BY COALESCE(h.answer_count, 0) ASC, RANDOM() LIMIT ?;`;
    params.push(count);

    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const questions: Question[] = [];

    while (stmt.step()) {
      questions.push(this.mapRowToQuestion(stmt.get()));
    }
    stmt.free();
    return questions;
  }

  // --- SPECIALIZED OFFICIAL EXAM GENERATORS ---

  querySubjectQuestions(subject: string, limit: number): Question[] {
    if (!this.db) return [];
    const sql = `
      SELECT q.id, q.subject, q.topic, q.difficulty, q.year, q.source, q.context_text, q.statement, q.options_json, q.correct_index, q.explanation, q.study_url, q.study_title
      FROM questions q
      LEFT JOIN (
        SELECT question_id, COUNT(*) as answer_count
        FROM question_history
        GROUP BY question_id
      ) h ON q.id = h.question_id
      WHERE q.subject = ?
      ORDER BY COALESCE(h.answer_count, 0) ASC, RANDOM()
      LIMIT ?;
    `;
    const stmt = this.db.prepare(sql);
    stmt.bind([subject, limit]);
    const list: Question[] = [];
    while (stmt.step()) {
      list.push(this.mapRowToQuestion(stmt.get()));
    }
    stmt.free();
    return list;
  }

  queryGeneralKnowledgeQuestions(limit: number): Question[] {
    if (!this.db) return [];
    const sql = `
      SELECT q.id, q.subject, q.topic, q.difficulty, q.year, q.source, q.context_text, q.statement, q.options_json, q.correct_index, q.explanation, q.study_url, q.study_title
      FROM questions q
      LEFT JOIN (
        SELECT question_id, COUNT(*) as answer_count
        FROM question_history
        GROUP BY question_id
      ) h ON q.id = h.question_id
      WHERE q.subject IN ('História', 'Geografia', 'Ciências')
      ORDER BY COALESCE(h.answer_count, 0) ASC, RANDOM()
      LIMIT ?;
    `;
    const stmt = this.db.prepare(sql);
    stmt.bind([limit]);
    const list: Question[] = [];
    while (stmt.step()) {
      list.push(this.mapRowToQuestion(stmt.get()));
    }
    stmt.free();
    return list;
  }

  getSimuladoETEQuestions(): Question[] {
    // Exact ETEPE pattern: 10 Língua Portuguesa + 10 Matemática = 20 questions
    const portugues = this.querySubjectQuestions('Língua Portuguesa', 10);
    const matematica = this.querySubjectQuestions('Matemática', 10);
    return [...portugues, ...matematica];
  }

  getSimuladoIFPEQuestions(): Question[] {
    // Exact IFPE pattern: 10 Português + 10 Matemática + 10 Conhecimentos Gerais = 30 questions
    const portugues = this.querySubjectQuestions('Língua Portuguesa', 10);
    const matematica = this.querySubjectQuestions('Matemática', 10);
    const gerais = this.queryGeneralKnowledgeQuestions(10);
    return [...portugues, ...matematica, ...gerais];
  }

  getWrongQuestions(): Question[] {
    if (!this.db) return [];
    const sql = `
      SELECT DISTINCT q.id, q.subject, q.topic, q.difficulty, q.year, q.source, q.context_text, q.statement, q.options_json, q.correct_index, q.explanation, q.study_url, q.study_title
      FROM questions q
      INNER JOIN question_history h ON q.id = h.question_id
      WHERE h.is_correct = 0
      ORDER BY h.id DESC
      LIMIT 100;
    `;
    const stmt = this.db.prepare(sql);
    const list: Question[] = [];
    while (stmt.step()) {
      list.push(this.mapRowToQuestion(stmt.get()));
    }
    stmt.free();
    return list;
  }

  getDistinctSubjects(): string[] {
    if (!this.db) return [];
    const res = this.db.exec('SELECT DISTINCT subject FROM questions ORDER BY subject ASC');
    if (!res[0]) return [];
    return res[0].values.map((v) => v[0] as string);
  }

  getDistinctTopics(subject?: string): string[] {
    if (!this.db) return [];
    let sql = 'SELECT DISTINCT topic FROM questions';
    const params: string[] = [];
    if (subject && subject !== 'Todas') {
      sql += ' WHERE subject = ?';
      params.push(subject);
    }
    sql += ' ORDER BY topic ASC';
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const topics: string[] = [];
    while (stmt.step()) {
      topics.push(stmt.get()[0] as string);
    }
    stmt.free();
    return topics;
  }

  // --- RECORDING ACTIONS ---

  recordAnswer(record: QuestionHistoryRecord): void {
    if (!this.db) return;
    const stmt = this.db.prepare(`
      INSERT INTO question_history (question_id, selected_index, is_correct, time_spent_seconds, answered_at, simulado_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      record.question_id,
      record.selected_index,
      record.is_correct ? 1 : 0,
      record.time_spent_seconds,
      record.answered_at,
      record.simulado_id || null
    ]);
    stmt.free();
    this.updateStudyStreak();
    this.persistToIndexedDB();
  }

  saveSimulado(record: SimuladoRecord): void {
    if (!this.db) return;

    this.db.run('BEGIN TRANSACTION;');
    try {
      const stmt = this.db.prepare(`
        INSERT INTO simulados (id, title, mode, total_questions, correct_count, score_percentage, time_spent_seconds, created_at, answers_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run([
        record.id,
        record.title,
        record.mode,
        record.total_questions,
        record.correct_count,
        record.score_percentage,
        record.time_spent_seconds,
        record.created_at,
        JSON.stringify(record.answers)
      ]);
      stmt.free();

      const histStmt = this.db.prepare(`
        INSERT INTO question_history (question_id, selected_index, is_correct, time_spent_seconds, answered_at, simulado_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const ans of record.answers) {
        if (ans.selectedIndex !== null) {
          histStmt.run([
            ans.questionId,
            ans.selectedIndex,
            ans.isCorrect ? 1 : 0,
            ans.timeSpentSeconds,
            record.created_at,
            record.id
          ]);
        }
      }
      histStmt.free();

      this.db.run('COMMIT;');
      this.updateStudyStreak();
      this.persistToIndexedDB();
    } catch (e) {
      this.db.run('ROLLBACK;');
      console.error('Error saving simulado:', e);
    }
  }

  getSimuladosHistory(): SimuladoRecord[] {
    if (!this.db) return [];
    const res = this.db.exec(`
      SELECT id, title, mode, total_questions, correct_count, score_percentage, time_spent_seconds, created_at, answers_json
      FROM simulados
      ORDER BY created_at DESC
    `);
    if (!res[0]) return [];

    return res[0].values.map((row) => ({
      id: row[0] as string,
      title: row[1] as string,
      mode: row[2] as any,
      total_questions: row[3] as number,
      correct_count: row[4] as number,
      score_percentage: row[5] as number,
      time_spent_seconds: row[6] as number,
      created_at: row[7] as string,
      answers: JSON.parse((row[8] as string) || '[]')
    }));
  }

  // --- BOOKMARKS ---

  toggleBookmark(questionId: number, note = ''): boolean {
    if (!this.db) return false;
    const isBookmarked = this.isBookmarked(questionId);
    if (isBookmarked) {
      const stmt = this.db.prepare('DELETE FROM bookmarks WHERE question_id = ?');
      stmt.run([questionId]);
      stmt.free();
      this.persistToIndexedDB();
      return false;
    } else {
      const stmt = this.db.prepare('INSERT INTO bookmarks (question_id, created_at, note) VALUES (?, ?, ?)');
      stmt.run([questionId, new Date().toISOString(), note]);
      stmt.free();
      this.persistToIndexedDB();
      return true;
    }
  }

  isBookmarked(questionId: number): boolean {
    if (!this.db) return false;
    const stmt = this.db.prepare('SELECT 1 FROM bookmarks WHERE question_id = ?');
    stmt.bind([questionId]);
    const exists = stmt.step();
    stmt.free();
    return exists;
  }

  getBookmarkedIds(): number[] {
    if (!this.db) return [];
    const res = this.db.exec('SELECT question_id FROM bookmarks');
    if (!res[0]) return [];
    return res[0].values.map((v) => v[0] as number);
  }

  // --- FLASHCARDS ---

  getFlashcards(): FlashcardRecord[] {
    if (!this.db) return [];
    const res = this.db.exec(`
      SELECT id, subject, topic, front, back, interval, repetitions, ease_factor, due_date
      FROM flashcards
      ORDER BY id ASC
    `);
    if (!res[0]) return [];

    return res[0].values.map((row) => ({
      id: row[0] as number,
      subject: row[1] as string,
      topic: row[2] as string,
      front: row[3] as string,
      back: row[4] as string,
      interval: row[5] as number,
      repetitions: row[6] as number,
      ease_factor: row[7] as number,
      due_date: row[8] as string
    }));
  }

  createFlashcard(card: { subject: string; topic: string; front: string; back: string }): void {
    if (!this.db) return;
    const today = new Date().toISOString().split('T')[0];
    const stmt = this.db.prepare(`
      INSERT INTO flashcards (subject, topic, front, back, interval, repetitions, ease_factor, due_date)
      VALUES (?, ?, ?, ?, 1, 0, 2.5, ?)
    `);
    stmt.run([card.subject, card.topic, card.front, card.back, today]);
    stmt.free();
    this.persistToIndexedDB();
  }

  deleteFlashcard(id: number): void {
    if (!this.db) return;
    const stmt = this.db.prepare('DELETE FROM flashcards WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    this.persistToIndexedDB();
  }

  reviewFlashcard(id: number, rating: 'easy' | 'good' | 'hard'): void {
    if (!this.db) return;
    const stmt = this.db.prepare('SELECT interval, repetitions, ease_factor FROM flashcards WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      let [interval, reps, ease] = stmt.get() as [number, number, number];
      stmt.free();

      if (rating === 'easy') {
        ease += 0.15;
        interval = Math.round(interval * ease * 1.3);
        reps += 1;
      } else if (rating === 'good') {
        interval = Math.round(interval * ease);
        reps += 1;
      } else {
        ease = Math.max(1.3, ease - 0.2);
        interval = 1;
        reps = 0;
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      const dueDateStr = nextDate.toISOString().split('T')[0];

      const updateStmt = this.db.prepare(`
        UPDATE flashcards SET interval = ?, repetitions = ?, ease_factor = ?, due_date = ?
        WHERE id = ?
      `);
      updateStmt.run([interval, reps, ease, dueDateStr, id]);
      updateStmt.free();
      this.persistToIndexedDB();
    } else {
      stmt.free();
    }
  }

  // --- STATS & PERFORMANCE ---

  getPerformanceStats(): PerformanceStats {
    if (!this.db) {
      return {
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        totalSimulados: 0,
        averageSimuladoScore: 0,
        totalStudyTimeSeconds: 0,
        streakDays: 0,
        subjectStats: [],
        difficultyStats: [],
        recentSimulados: [],
        wrongQuestionIds: []
      };
    }

    // Aggregated totals
    const totalRes = this.db.exec(`
      SELECT 
        COUNT(*) as total,
        SUM(is_correct) as correct,
        SUM(time_spent_seconds) as total_time
      FROM question_history
    `);

    let totalQuestionsAnswered = 0;
    let totalCorrect = 0;
    let totalStudyTimeSeconds = 0;

    if (totalRes[0]?.values[0]) {
      totalQuestionsAnswered = (totalRes[0].values[0][0] as number) || 0;
      totalCorrect = (totalRes[0].values[0][1] as number) || 0;
      totalStudyTimeSeconds = (totalRes[0].values[0][2] as number) || 0;
    }

    const overallAccuracy =
      totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

    // Simulados Stats
    const simRes = this.db.exec(`
      SELECT 
        COUNT(*) as count,
        AVG(score_percentage) as avg_score
      FROM simulados
    `);
    const totalSimulados = (simRes[0]?.values[0]?.[0] as number) || 0;
    const averageSimuladoScore = Math.round((simRes[0]?.values[0]?.[1] as number) || 0);

    // Subject breakdown
    const subjRes = this.db.exec(`
      SELECT 
        q.subject,
        COUNT(h.id) as total,
        SUM(h.is_correct) as correct,
        AVG(h.time_spent_seconds) as avg_time
      FROM question_history h
      JOIN questions q ON h.question_id = q.id
      GROUP BY q.subject
      ORDER BY total DESC
    `);

    const subjectStats: SubjectStats[] = (subjRes[0]?.values || []).map((row) => {
      const total = row[1] as number;
      const correct = (row[2] as number) || 0;
      return {
        subject: row[0] as string,
        totalAnswered: total,
        totalCorrect: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        averageTimeSeconds: Math.round((row[3] as number) || 0)
      };
    });

    // Difficulty breakdown
    const diffRes = this.db.exec(`
      SELECT 
        q.difficulty,
        COUNT(h.id) as total,
        SUM(h.is_correct) as correct
      FROM question_history h
      JOIN questions q ON h.question_id = q.id
      GROUP BY q.difficulty
    `);

    const difficultyStats = (diffRes[0]?.values || []).map((row) => {
      const total = row[1] as number;
      const correct = (row[2] as number) || 0;
      return {
        difficulty: row[0] as string,
        answered: total,
        correct: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
      };
    });

    // Wrong Question IDs (Questions answered incorrectly most recently or ever)
    const wrongRes = this.db.exec(`
      SELECT DISTINCT question_id
      FROM question_history
      WHERE is_correct = 0
      ORDER BY id DESC
      LIMIT 100
    `);
    const wrongQuestionIds = (wrongRes[0]?.values || []).map((row) => row[0] as number);

    // Streak
    const streakRes = this.db.exec('SELECT streak_days FROM study_goals WHERE id = 1');
    const streakDays = (streakRes[0]?.values[0]?.[0] as number) || 1;

    const recentSimulados = this.getSimuladosHistory().slice(0, 5);

    return {
      totalQuestionsAnswered,
      totalCorrect,
      overallAccuracy,
      totalSimulados,
      averageSimuladoScore,
      totalStudyTimeSeconds,
      streakDays,
      subjectStats,
      difficultyStats,
      recentSimulados,
      wrongQuestionIds
    };
  }

  private updateStudyStreak(): void {
    if (!this.db) return;
    const today = new Date().toISOString().split('T')[0];

    const res = this.db.exec('SELECT streak_days, last_study_date FROM study_goals WHERE id = 1');
    if (!res[0] || res[0].values.length === 0) {
      this.db.run(`
        INSERT INTO study_goals (id, daily_target_questions, daily_target_minutes, streak_days, last_study_date)
        VALUES (1, 20, 45, 1, ?)
      `, [today]);
      return;
    }

    const currentStreak = (res[0].values[0][0] as number) || 0;
    const lastDate = res[0].values[0][1] as string;

    if (lastDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDate === yestStr) {
      newStreak = currentStreak + 1;
    }

    this.db.run(`
      UPDATE study_goals SET streak_days = ?, last_study_date = ? WHERE id = 1
    `, [newStreak, today]);
  }

  // --- SQL CONSOLE / EXECUTION & BACKUP ---

  executeRawQuery(sql: string): { columns: string[]; values: any[][] }[] {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.exec(sql);
  }

  exportDatabaseBinary(): Uint8Array {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.export();
  }

  async importDatabaseBinary(data: Uint8Array): Promise<void> {
    const SQL = await loadSqlInstance();
    this.db = new SQL.Database(data);
    await this.persistToIndexedDB();
  }

  async resetDatabaseToDefault(): Promise<void> {
    const SQL = await loadSqlInstance();
    this.db = new SQL.Database();
    this.createSchema();
    this.syncQuestionsFromJSON();
    this.seedDefaultFlashcards();
    await this.persistToIndexedDB();
  }
}

export const sqliteService = new SqliteService();
