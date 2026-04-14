const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const events = db.prepare('SELECT * FROM fiscal_events ORDER BY due_date ASC').all();
  const today = new Date();
  const upcoming = events.filter(e => new Date(e.due_date) > today && !e.is_paid);
  const totalUpcoming = upcoming.reduce((s, e) => s + e.amount, 0);
  
  // Dynamic risk tolerance
  const nextEvent = upcoming[0];
  const daysUntilNext = nextEvent ? Math.floor((new Date(nextEvent.due_date) - today) / (1000 * 60 * 60 * 24)) : null;
  let riskTolerance = 'NORMAL';
  if (daysUntilNext !== null && daysUntilNext < 30 && nextEvent.amount > 50000) riskTolerance = 'REDUCED';
  if (daysUntilNext !== null && daysUntilNext < 14 && nextEvent.amount > 80000) riskTolerance = 'CONSERVATIVE';

  res.json({ events, upcoming, totalUpcoming, riskTolerance, daysUntilNext, nextEvent });
});

router.post('/', (req, res) => {
  const { event_type, description, amount, due_date, is_recurring, recurrence_months, impact_level } = req.body;
  const result = db.prepare('INSERT INTO fiscal_events (event_type, description, amount, due_date, is_recurring, recurrence_months, impact_level) VALUES (?, ?, ?, ?, ?, ?, ?)').run(event_type, description, amount, due_date, is_recurring ? 1 : 0, recurrence_months, impact_level);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.put('/:id/paid', (req, res) => {
  db.prepare('UPDATE fiscal_events SET is_paid = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
