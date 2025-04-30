// auth-check.js (Express backend route for /api/auth/verify)
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function isValidTelegramInitData(initData) {
  const parsed = new URLSearchParams(initData);
  const hash = parsed.get('hash');
  parsed.delete('hash');

  const dataCheckString = Array.from(parsed.entries())
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join('\n');

  const secret = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  return hmac === hash;
}

router.post('/verify', (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, message: 'Missing initData' });
  }

  const valid = isValidTelegramInitData(initData);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid Telegram initData' });
  }

  // User verified successfully
  res.json({ success: true });
});

module.exports = router;
