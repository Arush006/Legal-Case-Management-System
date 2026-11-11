import Database from "better-sqlite3";
import express from "express";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(here, "data");
const databasePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(dataDirectory, "nyaya.db");
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    case_number TEXT NOT NULL DEFAULT '',
    court TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'Active',
    next_date TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL DEFAULT '',
    case_id INTEGER REFERENCES cases(id) ON DELETE SET NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS legal_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    law_name TEXT NOT NULL,
    section TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    keywords TEXT NOT NULL,
    source_url TEXT NOT NULL,
    UNIQUE(law_name, section)
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS auth_sessions (
    session_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function addUserColumn(tableName) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (!columns.some((column) => column.name === "user_id")) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
  }
}

const hasLegacyAccountTable = Boolean(db.prepare(
  "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'local_account'",
).get());
const sessionColumns = db.prepare("PRAGMA table_info(auth_sessions)").all();
if (!sessionColumns.some((column) => column.name === "user_id")) {
  db.exec("ALTER TABLE auth_sessions ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE");
}
addUserColumn("cases");
addUserColumn("tasks");

const migrateLegacyAccount = db.transaction(() => {
  if (hasLegacyAccountTable) {
    db.exec(`
      INSERT OR IGNORE INTO users (id, name, email, password_salt, password_hash, created_at)
      SELECT id, name, email, password_salt, password_hash, created_at
      FROM local_account
    `);
  }
  const legacyUser = db.prepare("SELECT id FROM users WHERE id = 1").get();
  if (legacyUser) {
    db.prepare("UPDATE cases SET user_id = ? WHERE user_id IS NULL").run(legacyUser.id);
    db.prepare("UPDATE tasks SET user_id = ? WHERE user_id IS NULL").run(legacyUser.id);
    db.prepare("UPDATE auth_sessions SET user_id = ? WHERE user_id IS NULL").run(legacyUser.id);
  }
  db.exec(`
    CREATE INDEX IF NOT EXISTS cases_user_id_idx ON cases(user_id);
    CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
    CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions(user_id);
  `);
});
migrateLegacyAccount();

const sections = [
  {
    law_name: "Bharatiya Nyaya Sanhita, 2023",
    section: "303",
    title_en: "Theft",
    title_hi: "चोरी",
    summary_en: "Concerns dishonest taking of movable property out of another person's possession without consent. The facts and statutory exceptions matter.",
    summary_hi: "किसी व्यक्ति के कब्जे से उसकी सहमति के बिना बेईमानी से चल संपत्ति लेने से संबंधित। तथ्यों और वैधानिक अपवादों की जाँच आवश्यक है।",
    keywords: ["theft", "stole", "stolen", "steal", " चोरी", "चोरी", "चुरा", "चुराया", "संपत्ति चुराना"],
  },
  {
    law_name: "Bharatiya Nyaya Sanhita, 2023",
    section: "318",
    title_en: "Cheating",
    title_hi: "छल",
    summary_en: "Addresses cheating, including deception that may fraudulently or dishonestly induce a person to deliver property or act/omit to act. Intent and evidence must be assessed.",
    summary_hi: "छल से संबंधित, जिसमें धोखे से किसी व्यक्ति को संपत्ति देने या कोई कार्य करने/न करने के लिए बेईमानी से प्रेरित करना शामिल हो सकता है। मंशा और साक्ष्य जाँचना आवश्यक है।",
    keywords: ["cheat", "cheating", "fraud", "scam", "deception", " छल", "धोखा", "ठगी", "धोखाधड़ी", "फ्रॉड"],
  },
  {
    law_name: "Bharatiya Nyaya Sanhita, 2023",
    section: "351",
    title_en: "Criminal intimidation",
    title_hi: "आपराधिक धमकी",
    summary_en: "Concerns threats of injury to a person, reputation, or property made with intent to cause alarm or compel an act or omission. The precise threat and context matter.",
    summary_hi: "किसी व्यक्ति, प्रतिष्ठा या संपत्ति को नुकसान की धमकी देकर भय पैदा करने या कोई कार्य कराने/रोकने से संबंधित। धमकी और संदर्भ का आकलन आवश्यक है।",
    keywords: ["threat", "threatened", "intimidation", "blackmail", " धमकी", "धमकी", "डराना", "ब्लैकमेल"],
  },
  {
    law_name: "Bharatiya Nyaya Sanhita, 2023",
    section: "115",
    title_en: "Voluntarily causing hurt",
    title_hi: "स्वेच्छा से चोट पहुँचाना",
    summary_en: "Addresses voluntarily causing hurt. Medical records, the nature of injury, intent, and applicable exceptions are important to the assessment.",
    summary_hi: "स्वेच्छा से चोट पहुँचाने से संबंधित। चिकित्सकीय रिकॉर्ड, चोट का प्रकार, मंशा और लागू अपवाद महत्त्वपूर्ण हैं।",
    keywords: ["assault", "injured", "injury", "hurt", "beaten", " मारपीट", "चोट", "पीटा", "हमला"],
  },
  {
    law_name: "Bharatiya Nyaya Sanhita, 2023",
    section: "85",
    title_en: "Cruelty by husband or relative",
    title_hi: "पति या रिश्तेदार द्वारा क्रूरता",
    summary_en: "Concerns cruelty by a husband or his relative towards a woman. The statutory definition, relationship, conduct, and supporting evidence must be reviewed.",
    summary_hi: "किसी महिला के प्रति उसके पति या पति के रिश्तेदार द्वारा क्रूरता से संबंधित। कानूनी परिभाषा, संबंध, आचरण और साक्ष्य की समीक्षा आवश्यक है।",
    keywords: ["domestic violence", "dowry", "cruelty", "husband", "in-laws", "घरेलू हिंसा", "दहेज", "ससुराल", "क्रूरता"],
  },
  {
    law_name: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    section: "173",
    title_en: "Information in cognizable cases",
    title_hi: "संज्ञेय मामलों में सूचना",
    summary_en: "Provides the procedure for giving information relating to a cognizable offence to the police, including electronic communication and related safeguards.",
    summary_hi: "संज्ञेय अपराध से संबंधित सूचना पुलिस को देने की प्रक्रिया बताती है, जिसमें इलेक्ट्रॉनिक संचार और संबंधित सुरक्षा उपाय शामिल हैं।",
    keywords: ["fir", "police complaint", "cognizable", "first information", " एफआईआर", "पुलिस शिकायत", "प्राथमिकी"],
  },
  {
    law_name: "Bharatiya Sakshya Adhiniyam, 2023",
    section: "63",
    title_en: "Admissibility of electronic records",
    title_hi: "इलेक्ट्रॉनिक रिकॉर्ड की ग्राह्यता",
    summary_en: "Sets conditions for admissibility of electronic records as evidence. Applicable certification and procedural requirements should be checked for the specific record.",
    summary_hi: "इलेक्ट्रॉनिक रिकॉर्ड को साक्ष्य के रूप में स्वीकार करने की शर्तें निर्धारित करती है। विशिष्ट रिकॉर्ड के लिए प्रमाणन और प्रक्रिया की जाँच करें।",
    keywords: ["digital evidence", "electronic record", "email", "whatsapp", "cctv", "screenshot", "डिजिटल साक्ष्य", "इलेक्ट्रॉनिक रिकॉर्ड", "ईमेल", "व्हाट्सएप", "सीसीटीवी"],
  },
  {
    law_name: "Constitution of India",
    section: "14",
    title_en: "Equality before law",
    title_hi: "विधि के समक्ष समानता",
    summary_en: "Guarantees equality before the law and equal protection of the laws within the territory of India, subject to constitutional interpretation.",
    summary_hi: "भारत के राज्यक्षेत्र में विधि के समक्ष समानता और विधियों के समान संरक्षण की गारंटी देता है। संवैधानिक व्याख्या लागू होती है।",
    keywords: ["discrimination", "unequal treatment", "equality", " भेदभाव", "असमानता", "समानता"],
  },
  {
    law_name: "Constitution of India",
    section: "21",
    title_en: "Protection of life and personal liberty",
    title_hi: "जीवन और व्यक्तिगत स्वतंत्रता का संरक्षण",
    summary_en: "Protects life and personal liberty except according to procedure established by law. Its application depends on the facts and constitutional jurisprudence.",
    summary_hi: "विधि द्वारा स्थापित प्रक्रिया के अनुसार ही जीवन और व्यक्तिगत स्वतंत्रता से वंचित किया जा सकता है। लागू होने का निर्णय तथ्यों और संवैधानिक न्यायशास्त्र पर निर्भर है।",
    keywords: ["personal liberty", "right to life", "illegal detention", "privacy", "जीवन का अधिकार", "व्यक्तिगत स्वतंत्रता", "अवैध हिरासत", "निजता"],
  },
  {
    law_name: "Constitution of India",
    section: "22",
    title_en: "Protection against arrest and detention",
    title_hi: "गिरफ्तारी और निरोध के विरुद्ध संरक्षण",
    summary_en: "Sets constitutional safeguards concerning arrest and detention, subject to the provisions and exceptions in the Constitution and applicable law.",
    summary_hi: "संविधान और लागू कानून के प्रावधानों तथा अपवादों के अधीन गिरफ्तारी और निरोध संबंधी संवैधानिक सुरक्षा उपाय बताता है।",
    keywords: ["arrest", "detention", "custody", "arrested", "गिरफ्तारी", "हिरासत", "निरोध"],
  },
];

const insertSection = db.prepare(`
  INSERT INTO legal_sections
    (law_name, section, title_en, title_hi, summary_en, summary_hi, keywords, source_url)
  VALUES
    (@law_name, @section, @title_en, @title_hi, @summary_en, @summary_hi, @keywords, @source_url)
  ON CONFLICT(law_name, section) DO UPDATE SET
    title_en = excluded.title_en,
    title_hi = excluded.title_hi,
    summary_en = excluded.summary_en,
    summary_hi = excluded.summary_hi,
    keywords = excluded.keywords,
    source_url = excluded.source_url
`);
const seedSections = db.transaction((rows) => {
  for (const section of rows) {
    insertSection.run({
      ...section,
      keywords: JSON.stringify(section.keywords),
      source_url: "https://www.indiacode.nic.in/",
    });
  }
});
seedSections(sections);

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const sessionCookie = "nyaya_session";
const sessionLifetime = 7 * 24 * 60 * 60 * 1000;

function readSessionCookie(req) {
  const cookies = req.headers.cookie?.split(";") ?? [];
  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");
    if (separator < 0 || cookie.slice(0, separator).trim() !== sessionCookie) continue;
    return cookie.slice(separator + 1).trim();
  }
  return "";
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionLifetime / 1000}${secure}`);
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

function issueSession(user, res) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionLifetime).toISOString();
  db.prepare("DELETE FROM auth_sessions WHERE expires_at <= ?").run(new Date().toISOString());
  db.prepare("INSERT INTO auth_sessions (session_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(createHash("sha256").update(token).digest("hex"), user.id, expiresAt);
  setSessionCookie(res, token);
  res.json({ authenticated: true, user: { name: user.name, email: user.email } });
}

function requireAuthentication(req, res, next) {
  const token = readSessionCookie(req);
  if (!token) return res.status(401).json({ error: "Sign in to continue." });
  const sessionHash = createHash("sha256").update(token).digest("hex");
  const session = db.prepare(`
    SELECT users.id, users.name, users.email, auth_sessions.expires_at
    FROM auth_sessions
    JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.session_hash = ?
  `).get(sessionHash);
  if (!session || session.expires_at <= new Date().toISOString()) {
    db.prepare("DELETE FROM auth_sessions WHERE session_hash = ?").run(sessionHash);
    clearSessionCookie(res);
    return res.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
  req.user = { id: session.id, name: session.name, email: session.email };
  next();
}

app.get("/api/auth/status", (req, res) => {
  const accountCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  const token = readSessionCookie(req);
  const session = token && db.prepare(`
    SELECT users.id, users.name, users.email, auth_sessions.expires_at
    FROM auth_sessions JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.session_hash = ?
  `).get(createHash("sha256").update(token).digest("hex"));
  const authenticated = Boolean(session && session.expires_at > new Date().toISOString());
  if (token && !authenticated) clearSessionCookie(res);
  res.json({
    hasAccount: accountCount > 0,
    authenticated,
    user: authenticated ? { name: session.name, email: session.email } : null,
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ error: "Enter your name (up to 100 characters)." });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 10 || password.length > 200) {
    return res.status(400).json({ error: "Choose a password with at least 10 characters." });
  }
  const salt = randomBytes(16);
  const passwordHash = scryptSync(password, salt, 64);
  const user = { name: name.trim(), email: email.trim().toLowerCase() };
  try {
    user.id = Number(db.transaction(() => {
      const hadAccounts = db.prepare("SELECT 1 FROM users LIMIT 1").get();
      const result = db.prepare(`
        INSERT INTO users (name, email, password_salt, password_hash)
        VALUES (?, ?, ?, ?)
      `).run(user.name, user.email, salt.toString("hex"), passwordHash.toString("hex"));
      if (!hadAccounts) {
        db.prepare("UPDATE cases SET user_id = ? WHERE user_id IS NULL").run(result.lastInsertRowid);
        db.prepare("UPDATE tasks SET user_id = ? WHERE user_id IS NULL").run(result.lastInsertRowid);
      }
      return result.lastInsertRowid;
    })());
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "An account with this email already exists on this device. Sign in instead." });
    }
    throw error;
  }
  issueSession(user, res);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your email and password." });
  }
  const account = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (!account) return res.status(401).json({ error: "Email or password is incorrect." });
  const suppliedHash = scryptSync(password, Buffer.from(account.password_salt, "hex"), 64);
  const storedHash = Buffer.from(account.password_hash, "hex");
  const passwordMatches = suppliedHash.length === storedHash.length
    && timingSafeEqual(suppliedHash, storedHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }
  issueSession(account, res);
});

app.post("/api/auth/logout", (req, res) => {
  const token = readSessionCookie(req);
  if (token) {
    db.prepare("DELETE FROM auth_sessions WHERE session_hash = ?")
      .run(createHash("sha256").update(token).digest("hex"));
  }
  clearSessionCookie(res);
  res.status(204).end();
});

const caseFields = `
  id, title, client, case_number AS caseNumber, court, category, status,
  next_date AS nextDate, description, created_at AS createdAt
`;
const taskFields = `
  tasks.id, tasks.title, tasks.due_date AS dueDate, tasks.case_id AS caseId,
  tasks.done, cases.title AS caseTitle
`;

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api", requireAuthentication);

app.get("/api/dashboard", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE user_id = ?").get(req.user.id).count;
  const active = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE user_id = ? AND status = 'Active'").get(req.user.id).count;
  const completed = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE user_id = ? AND status = 'Closed'").get(req.user.id).count;
  const pendingTasks = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND done = 0").get(req.user.id).count;
  const upcoming = db.prepare(`
    SELECT ${taskFields} FROM tasks LEFT JOIN cases
      ON cases.id = tasks.case_id AND cases.user_id = tasks.user_id
    WHERE tasks.user_id = ? AND tasks.done = 0 AND tasks.due_date >= date('now')
    ORDER BY tasks.due_date LIMIT 5
  `).all(req.user.id);
  const recent = db.prepare(`SELECT ${caseFields} FROM cases WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`).all(req.user.id);
  res.json({ total, active, completed, pendingTasks, upcoming, recent });
});

app.get("/api/cases", (req, res) => {
  res.json(db.prepare(`SELECT ${caseFields} FROM cases WHERE user_id = ? ORDER BY created_at DESC`).all(req.user.id));
});

app.post("/api/cases", (req, res) => {
  const { title, client, caseNumber = "", court = "", category = "General", nextDate = "", description = "" } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || title.length > 160) {
    return res.status(400).json({ error: "Enter a case title (up to 160 characters)." });
  }
  if (typeof client !== "string" || !client.trim() || client.length > 120) {
    return res.status(400).json({ error: "Enter a client name (up to 120 characters)." });
  }
  if (![caseNumber, court, category, nextDate, description].every((value) => typeof value === "string")) {
    return res.status(400).json({ error: "Case details must be text." });
  }
  const result = db.prepare(`
    INSERT INTO cases (user_id, title, client, case_number, court, category, next_date, description)
    VALUES (@userId, @title, @client, @caseNumber, @court, @category, @nextDate, @description)
  `).run({
    userId: req.user.id,
    title: title.trim(),
    client: client.trim(),
    caseNumber: caseNumber.trim(),
    court: court.trim(),
    category: category.trim() || "General",
    nextDate: nextDate.trim(),
    description: description.trim(),
  });
  res.status(201).json(db.prepare(`SELECT ${caseFields} FROM cases WHERE id = ? AND user_id = ?`).get(result.lastInsertRowid, req.user.id));
});

app.delete("/api/cases/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "Invalid case ID." });
  const result = db.prepare("DELETE FROM cases WHERE id = ? AND user_id = ?").run(id, req.user.id);
  if (!result.changes) return res.status(404).json({ error: "Case not found." });
  res.status(204).end();
});

app.patch("/api/cases/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "Invalid case ID." });
  if (!["Active", "Pending", "Closed"].includes(status)) {
    return res.status(400).json({ error: "Choose Active, Pending, or Closed." });
  }
  const result = db.prepare("UPDATE cases SET status = ? WHERE id = ? AND user_id = ?").run(status, id, req.user.id);
  if (!result.changes) return res.status(404).json({ error: "Case not found." });
  res.json(db.prepare(`SELECT ${caseFields} FROM cases WHERE id = ? AND user_id = ?`).get(id, req.user.id));
});

app.get("/api/tasks", (req, res) => {
  res.json(db.prepare(`
    SELECT ${taskFields} FROM tasks LEFT JOIN cases
      ON cases.id = tasks.case_id AND cases.user_id = tasks.user_id
    WHERE tasks.user_id = ? ORDER BY tasks.done, tasks.due_date
  `).all(req.user.id));
});

app.post("/api/tasks", (req, res) => {
  const { title, dueDate = "", caseId = null } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || title.length > 160) {
    return res.status(400).json({ error: "Enter a task (up to 160 characters)." });
  }
  if (typeof dueDate !== "string") return res.status(400).json({ error: "Due date must be text." });
  let linkedCaseId = null;
  if (caseId !== null && caseId !== "") {
    linkedCaseId = Number(caseId);
    if (!Number.isSafeInteger(linkedCaseId)
      || !db.prepare("SELECT id FROM cases WHERE id = ? AND user_id = ?").get(linkedCaseId, req.user.id)) {
      return res.status(400).json({ error: "Choose an existing case." });
    }
  }
  const result = db.prepare("INSERT INTO tasks (user_id, title, due_date, case_id) VALUES (?, ?, ?, ?)")
    .run(req.user.id, title.trim(), dueDate.trim(), linkedCaseId);
  res.status(201).json(db.prepare(`
    SELECT ${taskFields} FROM tasks LEFT JOIN cases
      ON cases.id = tasks.case_id AND cases.user_id = tasks.user_id
    WHERE tasks.id = ? AND tasks.user_id = ?
  `).get(result.lastInsertRowid, req.user.id));
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "Invalid task ID." });
  if (typeof req.body?.done !== "boolean") return res.status(400).json({ error: "Task status must be true or false." });
  const result = db.prepare("UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?")
    .run(req.body.done ? 1 : 0, id, req.user.id);
  if (!result.changes) return res.status(404).json({ error: "Task not found." });
  res.json(db.prepare(`
    SELECT ${taskFields} FROM tasks LEFT JOIN cases
      ON cases.id = tasks.case_id AND cases.user_id = tasks.user_id
    WHERE tasks.id = ? AND tasks.user_id = ?
  `).get(id, req.user.id));
});

app.get("/api/laws", (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 120) : "";
  if (!query) {
    return res.json(db.prepare(`
      SELECT id, law_name AS lawName, section, title_en AS titleEn, title_hi AS titleHi,
        summary_en AS summaryEn, summary_hi AS summaryHi, source_url AS sourceUrl
      FROM legal_sections ORDER BY law_name, CAST(section AS INTEGER)
    `).all());
  }
  const terms = query.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 1);
  const all = db.prepare("SELECT * FROM legal_sections").all();
  const matches = all.map((section) => {
    const searchable = [
      section.law_name, section.section, section.title_en, section.title_hi,
      section.summary_en, section.summary_hi, ...JSON.parse(section.keywords),
    ].join(" ").toLocaleLowerCase();
    const score = terms.reduce((total, term) => total + (searchable.includes(term) ? (section.section === term ? 4 : 1) : 0), 0);
    return { ...section, score };
  }).filter((section) => section.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  res.json(matches.map(({ id, law_name: lawName, section, title_en: titleEn, title_hi: titleHi,
    summary_en: summaryEn, summary_hi: summaryHi, source_url: sourceUrl }) =>
    ({ id, lawName, section, titleEn, titleHi, summaryEn, summaryHi, sourceUrl })));
});

app.post("/api/analyze", (req, res) => {
  const { description, language = "en" } = req.body ?? {};
  if (typeof description !== "string" || description.trim().length < 8) {
    return res.status(400).json({ error: "Describe the legal issue in at least 8 characters." });
  }
  if (description.length > 5000) return res.status(400).json({ error: "The description must be 5,000 characters or fewer." });
  const terms = description.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 1);
  const results = db.prepare("SELECT * FROM legal_sections").all().map((section) => {
    const keywords = JSON.parse(section.keywords).map((word) => word.toLocaleLowerCase());
    const hits = keywords.filter((keyword) => description.toLocaleLowerCase().includes(keyword));
    const score = hits.reduce((sum, hit) => sum + (terms.includes(hit) ? 2 : 1), 0);
    return { section, hits, score };
  }).filter((match) => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  res.json({
    method: "keyword-match",
    disclaimer: language === "hi"
      ? "यह प्रारंभिक, कीवर्ड-आधारित जानकारी है; कानूनी सलाह नहीं। यह सूची संपूर्ण नहीं है। वर्तमान कानून, तथ्य और आधिकारिक स्रोत की पुष्टि किसी योग्य भारतीय वकील से करें।"
      : "Preliminary keyword-based research only, not legal advice. This list is not exhaustive. Ask a qualified Indian lawyer to verify current law, facts, and official sources.",
    matches: results.map(({ section, hits }) => ({
      id: section.id,
      lawName: section.law_name,
      section: section.section,
      titleEn: section.title_en,
      titleHi: section.title_hi,
      summaryEn: section.summary_en,
      summaryHi: section.summary_hi,
      sourceUrl: section.source_url,
      matchedTerms: hits,
    })),
  });
});

app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not found." }));

const webDirectory = path.resolve(here, "..", "dist");
if (fs.existsSync(webDirectory)) {
  app.use(express.static(webDirectory));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(webDirectory, "index.html")));
}

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Nyaya API listening on http://localhost:${port}`);
});
