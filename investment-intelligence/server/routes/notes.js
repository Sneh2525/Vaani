const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const notes = db.prepare('SELECT * FROM decision_notes ORDER BY created_at DESC').all();
  const withReviews = notes.map(note => ({
    ...note,
    review: db.prepare('SELECT * FROM reviews WHERE note_id = ? LIMIT 1').get(note.id)
  }));
  res.json(withReviews);
});

router.get('/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM decision_notes WHERE id = ?').get(req.params.id);
  if (!note) return res.status(404).json({ error: 'Not found' });
  const review = db.prepare('SELECT * FROM reviews WHERE note_id = ?').get(note.id);
  const scenarios = db.prepare('SELECT * FROM outcome_scenarios WHERE note_id = ?').get(note.id);
  res.json({ ...note, review, scenarios });
});

router.post('/', (req, res) => {
  const { date, ticker, action, business_score, valuation_score, market_score, sentiment_score, composite_score,
    entry_thesis, risk_1, risk_2, risk_3, time_horizon, expected_scenario, what_proves_wrong,
    stop_loss, position_size_pct, position_size_reason, entry_price } = req.body;

  const result = db.prepare(`INSERT INTO decision_notes 
    (date, ticker, action, business_score, valuation_score, market_score, sentiment_score, composite_score,
    entry_thesis, risk_1, risk_2, risk_3, time_horizon, expected_scenario, what_proves_wrong,
    stop_loss, position_size_pct, position_size_reason, entry_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    date, ticker, action, business_score, valuation_score, market_score, sentiment_score, composite_score,
    entry_thesis, risk_1, risk_2, risk_3, time_horizon, expected_scenario, what_proves_wrong,
    stop_loss, position_size_pct, position_size_reason, entry_price
  );
  res.json({ success: true, id: result.lastInsertRowid });
});

router.post('/:id/review', (req, res) => {
  const { review_date, outcome, bias_identified, what_right, what_wrong, framework_update, carry_forward_rule, exit_price, actual_return } = req.body;
  db.prepare(`INSERT INTO reviews (note_id, review_date, outcome, bias_identified, what_right, what_wrong, framework_update, carry_forward_rule, exit_price, actual_return)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(req.params.id, review_date, outcome, bias_identified, what_right, what_wrong, framework_update, carry_forward_rule, exit_price, actual_return);
  db.prepare("UPDATE decision_notes SET status = 'REVIEWED' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.put('/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE decision_notes SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM decision_notes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
