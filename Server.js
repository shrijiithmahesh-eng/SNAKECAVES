// Snake Caves Backend - Amazon-style Login
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "snake-secret-key"; // use process.env.SECRET in production

// --- Database setup ---
const db = new sqlite3.Database('./snakecaves.db');

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  score INTEGER DEFAULT 0
)`);

// --- Register route ---
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashed], function(err) {
    if (err) return res.status(400).json({ error: "User already exists" });
    res.json({ message: "User registered successfully!" });
  });
});

// --- Login route ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if (!row) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

// --- Protected profile route ---
app.get('/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    db.get(`SELECT username, score FROM users WHERE username = ?`, [decoded.username], (err, row) => {
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json({ profile: row });
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- Update score route ---
app.post('/score', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    const { score } = req.body;
    db.run(`UPDATE users SET score = ? WHERE username = ?`, [score, decoded.username], function(err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Score updated!" });
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- Start server ---
app.listen(3000, () => console.log("Snake Caves server running on http://localhost:3000"));
