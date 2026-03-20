const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client = null;
let currentQR = null;       // base64 PNG of the QR
let status = 'DISCONNECTED'; // DISCONNECTED | INITIALIZING | QR_PENDING | CONNECTED | ERROR
let statusMessage = '';
let initPromise = null;

function getStatus() {
    return { status, hasQR: !!currentQR, message: statusMessage };
}

function getQR() {
    return currentQR;
}

function initClient() {
    if (initPromise) return initPromise;

    status = 'INITIALIZING';
    statusMessage = 'Starting browser...';

    initPromise = new Promise((resolve) => {
        client = new Client({
            authStrategy: new LocalAuth({ dataPath: './whatsapp_session' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
            },
        });

        client.on('qr', async (qr) => {
            status = 'QR_PENDING';
            statusMessage = 'Scan QR to connect';
            console.log('[WhatsApp] QR received');
            currentQR = await qrcode.toDataURL(qr);
        });

        client.on('loading_screen', (percent) => {
            statusMessage = `Loading WhatsApp... ${percent}%`;
            console.log(`[WhatsApp] Loading ${percent}%`);
        });

        client.on('ready', () => {
            status = 'CONNECTED';
            statusMessage = 'Connected';
            currentQR = null;
            console.log('[WhatsApp] Client is ready');
            resolve();
        });

        client.on('authenticated', () => {
            status = 'CONNECTED';
            statusMessage = 'Authenticated';
            currentQR = null;
        });

        client.on('auth_failure', (msg) => {
            status = 'ERROR';
            statusMessage = 'Authentication failed: ' + msg;
            currentQR = null;
            initPromise = null;
            console.log('[WhatsApp] Auth failed:', msg);
        });

        client.on('disconnected', (reason) => {
            status = 'DISCONNECTED';
            statusMessage = '';
            currentQR = null;
            initPromise = null;
            client = null;
            console.log('[WhatsApp] Disconnected:', reason);
        });

        client.initialize().catch((err) => {
            console.error('[WhatsApp] Init error:', err.message);
            status = 'ERROR';
            statusMessage = 'Failed to start: ' + err.message;
            initPromise = null;
            client = null;
        });
    });

    return initPromise;
}

async function sendMessage(phone, message) {
    if (!client || status !== 'CONNECTED') {
        throw new Error('WhatsApp is not connected');
    }
    // Clean phone to digits only, ensure country code
    const cleaned = phone.replace(/\D/g, '');
    const intlPhone = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    const chatId = `${intlPhone}@c.us`;
    await client.sendMessage(chatId, message);
}

async function logout() {
    if (client) {
        await client.logout().catch(() => {});
        await client.destroy().catch(() => {});
        client = null;
    }
    status = 'DISCONNECTED';
    currentQR = null;
    initPromise = null;
}

module.exports = { getStatus, getQR, initClient, sendMessage, logout };
