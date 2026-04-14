const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Calculate EV
function calcEV(bull_prob, bull_return, base_prob, base_return, bear_prob, bear_return) {
  return (bull_prob * bull_return) + (base_prob * base_return) + (bear_prob * bear_return);
}

router.get('/', (req, res) => {
  const scenarios = db.prepare('SELECT os.*, dn.ticker, dn.entry_thesis, s.name FROM outcome_scenarios os LEFT JOIN decision_notes dn ON os.note_id = dn.id LEFT JOIN stocks s ON os.ticker = s.ticker ORDER BY os.date DESC').all();
  res.json(scenarios);
});

router.get('/:ticker', (req, res) => {
  const data = db.prepare('SELECT * FROM outcome_scenarios WHERE ticker = ? ORDER BY date DESC LIMIT 5').all(req.params.ticker);
  res.json(data);
});

router.post('/', (req, res) => {
  const { note_id, ticker, date, bull_prob, bull_target, bull_return, base_prob, base_target, base_return, bear_prob, bear_target, bear_return, timeframe_months } = req.body;
  const ev = calcEV(bull_prob, bull_return, base_prob, base_return, bear_prob, bear_return);
  const result = db.prepare(`INSERT INTO outcome_scenarios 
    (note_id, ticker, date, bull_prob, bull_target, bull_return, base_prob, base_target, base_return, bear_prob, bear_target, bear_return, expected_value, timeframe_months)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    note_id, ticker, date || new Date().toISOString().slice(0, 10),
    bull_prob, bull_target, bull_return, base_prob, base_target, base_return,
    bear_prob, bear_target, bear_return, ev, timeframe_months
  );
  res.json({ success: true, id: result.lastInsertRowid, expectedValue: Math.round(ev * 10) / 10 });
});

router.put('/:id/actual', (req, res) => {
  const { actual_return } = req.body;
  const scenario = db.prepare('SELECT * FROM outcome_scenarios WHERE id = ?').get(req.params.id);
  // Calibration: how close was base_return to actual?
  const calibrationScore = scenario ? Math.max(0, 10 - Math.abs(actual_return - scenario.base_return) / 5) : 5;
  db.prepare('UPDATE outcome_scenarios SET actual_return = ?, calibration_score = ? WHERE id = ?').run(actual_return, calibrationScore, req.params.id);
  res.json({ success: true, calibrationScore });
});

// Get calibration stats across all scenarios
router.get('/stats/calibration', (req, res) => {
  const all = db.prepare('SELECT * FROM outcome_scenarios WHERE actual_return IS NOT NULL').all();
  if (all.length === 0) return res.json({ count: 0, avgCalibration: null, message: 'No outcomes recorded yet' });
  const avgCalib = all.reduce((s, r) => s + (r.calibration_score || 5), 0) / all.length;
  const avgEV = all.reduce((s, r) => s + (r.expected_value || 0), 0) / all.length;
  res.json({ count: all.length, avgCalibration: Math.round(avgCalib * 10) / 10, avgEV: Math.round(avgEV * 10) / 10 });
});

module.exports = router;
