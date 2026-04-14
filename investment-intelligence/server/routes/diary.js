const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const { tag, limit = 50 } = req.query;
  let query = 'SELECT * FROM diary_entries ORDER BY date DESC LIMIT ?';
  let params = [parseInt(limit)];
  if (tag) {
    query = 'SELECT * FROM diary_entries WHERE tags LIKE ? ORDER BY date DESC LIMIT ?';
    params = [`%${tag}%`, parseInt(limit)];
  }
  res.json(db.prepare(query).all(...params));
});

router.post('/', (req, res) => {
  const { date, macro_obs, sector_thesis, signal_flag, new_rule_idea, lesson, mood, key_insight, tags } = req.body;
  const result = db.prepare(`INSERT INTO diary_entries (date, macro_obs, sector_thesis, signal_flag, new_rule_idea, lesson, mood, key_insight, tags) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(date, macro_obs, sector_thesis, signal_flag, new_rule_idea, lesson, mood, key_insight, tags);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM diary_entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// AI analysis prompt
router.get('/ai-prompt', (req, res) => {
  const entries = db.prepare('SELECT * FROM diary_entries ORDER BY date DESC LIMIT 30').all();
  const formatted = entries.map(e => 
    `Date: ${e.date}\n[MACRO] ${e.macro_obs}\n[SECTOR] ${e.sector_thesis}\n[SIGNAL] ${e.signal_flag}\n[MISTAKE] ${e.lesson}\n[MOOD] ${e.mood}\n[INSIGHT] ${e.key_insight}`
  ).join('\n\n---\n\n');
  
  const prompt = `Read these strategy diary entries. Answer:\n1. What are my 5 most recurring biases?\n2. What patterns do I keep noticing that haven't become formal rules yet?\n3. What mistakes do I repeat most often?\n4. What single rule update would improve my returns most?\n\nDiary entries:\n\n${formatted}`;
  res.json({ prompt, entryCount: entries.length });
});

module.exports = router;
