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
  const { actual_return, materialized_outcome } = req.body; // materialized_outcome: 'bull', 'base', or 'bear'
  const scenario = db.prepare('SELECT * FROM outcome_scenarios WHERE id = ?').get(req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  const outcome = materialized_outcome || (
    // Guess based on which target actual_return is closest to
    Math.abs(actual_return - scenario.bull_return) < Math.abs(actual_return - scenario.base_return) ? 'bull' :
    Math.abs(actual_return - scenario.bear_return) < Math.abs(actual_return - scenario.base_return) ? 'bear' : 'base'
  );

  // Multi-outcome probabilistic Brier score: Sum((f_i - o_i)^2)
  // f_i is predicted probability (scaled 0 to 1), o_i is 1 if it occurred else 0.
  const bull_f = (scenario.bull_prob || 0) / 100;
  const base_f = (scenario.base_prob || 0) / 100;
  const bear_f = (scenario.bear_prob || 0) / 100;

  const bull_o = outcome === 'bull' ? 1 : 0;
  const base_o = outcome === 'base' ? 1 : 0;
  const bear_o = outcome === 'bear' ? 1 : 0;

  const brierScore = Math.pow(bull_f - bull_o, 2) + Math.pow(base_f - base_o, 2) + Math.pow(bear_f - bear_o, 2);

  // Map Brier Score (0 is perfect prediction, 2 is worst possible error) to a 0-10 user calibration score:
  // Calibration = 10 * (1 - BrierScore/2)
  const calibrationScore = Math.round(10 * (1 - (brierScore / 2)) * 10) / 10;

  db.prepare('UPDATE outcome_scenarios SET actual_return = ?, calibration_score = ?, notes = ? WHERE id = ?')
    .run(actual_return, calibrationScore, `Brier Score: ${brierScore.toFixed(3)}. Materialized: ${outcome.toUpperCase()}`, req.params.id);

  res.json({ success: true, calibrationScore, brierScore, outcome });
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
