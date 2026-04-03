const express = require('express');
const router = express.Router();

// In-memory scan sessions: sessionId -> { items: [], createdAt }
const sessions = new Map();

// Purge sessions older than 2 hours every 30 minutes
setInterval(() => {
    const cutoff = Date.now() - 2 * 60 * 60 * 1000;
    for (const [id, s] of sessions) {
        if (s.createdAt < cutoff) sessions.delete(id);
    }
}, 30 * 60 * 1000);

function makeId() {
    return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// POST /api/scan/session — create new session
router.post('/session', (req, res) => {
    const sessionId = makeId();
    sessions.set(sessionId, { items: [], createdAt: Date.now() });
    res.json({ sessionId });
});

// GET /api/scan/session/:id — poll for scanned items
router.get('/session/:id', (req, res) => {
    const s = sessions.get(req.params.id);
    if (!s) return res.status(404).json({ msg: 'Session not found or expired' });
    res.json({ items: s.items });
});

// POST /api/scan/session/:id/add — mobile adds a scanned barcode
router.post('/session/:id/add', (req, res) => {
    const s = sessions.get(req.params.id);
    if (!s) return res.status(404).json({ msg: 'Session not found or expired' });
    const { barcode } = req.body;
    if (!barcode || typeof barcode !== 'string') return res.status(400).json({ msg: 'barcode required' });
    const trimmed = barcode.trim();
    if (!trimmed) return res.status(400).json({ msg: 'barcode required' });
    // Deduplicate within session
    if (!s.items.find(i => i.barcode === trimmed)) {
        s.items.push({ barcode: trimmed, scannedAt: Date.now() });
    }
    res.json({ ok: true, total: s.items.length });
});

// DELETE /api/scan/session/:id — desktop closes session
router.delete('/session/:id', (req, res) => {
    sessions.delete(req.params.id);
    res.json({ ok: true });
});

module.exports = router;
