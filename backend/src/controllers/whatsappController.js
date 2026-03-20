const wa = require('../services/whatsappService');

// GET /api/whatsapp/status
const getStatus = (req, res) => {
    res.json(wa.getStatus());
};

// POST /api/whatsapp/connect  — start client and begin QR generation
const connect = async (req, res) => {
    try {
        wa.initClient(); // fire-and-forget; QR appears via polling
        res.json({ message: 'WhatsApp client initializing' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/whatsapp/qr  — returns base64 PNG data URL
const getQR = (req, res) => {
    const qr = wa.getQR();
    if (!qr) return res.status(404).json({ error: 'QR not available' });
    res.json({ qr });
};

// POST /api/whatsapp/send  — { phone, message }
const sendMessage = async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) return res.status(400).json({ error: 'phone and message required' });
    try {
        await wa.sendMessage(phone, message);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/whatsapp/logout
const logout = async (req, res) => {
    try {
        await wa.logout();
        res.json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/whatsapp/send-bulk  — [{ phone, message, partyName }]
const sendBulk = async (req, res) => {
    const { recipients } = req.body; // [{ phone, message, partyName }]
    if (!Array.isArray(recipients) || recipients.length === 0)
        return res.status(400).json({ error: 'recipients array required' });

    const results = [];
    for (const r of recipients) {
        try {
            await wa.sendMessage(r.phone, r.message);
            results.push({ phone: r.phone, partyName: r.partyName, success: true });
        } catch (err) {
            results.push({ phone: r.phone, partyName: r.partyName, success: false, error: err.message });
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    res.json({ results });
};

module.exports = { getStatus, connect, getQR, sendMessage, sendBulk, logout };
