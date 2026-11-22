// api/balance.js
// Эндпоинт получения остатка токенов аккаунта GigaChat (Сбер)
import https from 'https';
import crypto from 'crypto';

const sberAgent = new https.Agent({
  rejectUnauthorized: false
});

async function getGigaChatToken(authKey, scope = 'GIGACHAT_API_PERS') {
  return new Promise((resolve, reject) => {
    const rqUid = crypto.randomUUID();
    const postData = `scope=${encodeURIComponent(scope)}`;

    const options = {
      hostname: 'ngw.devices.sberbank.ru',
      port: 9443,
      path: '/api/v2/oauth',
      method: 'POST',
      agent: sberAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': rqUid,
        'Authorization': `Basic ${authKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.access_token);
          } catch (e) {
            reject(new Error(`Ошибка парсинга токена GigaChat: ${e.message}`));
          }
        } else {
          reject(new Error(`GigaChat OAuth вернул статус ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getGigaChatBalance(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gigachat.devices.sberbank.ru',
      port: 443,
      path: '/api/v1/balance',
      method: 'GET',
      agent: sberAgent,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.balance || []);
          } catch (e) {
            reject(new Error(`Ошибка парсинга баланса GigaChat: ${e.message}`));
          }
        } else {
          reject(new Error(`GigaChat balance вернул статус ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const gigachatKey = process.env.GIGACHAT_AUTH_KEY || 'MDFhMjAyZWEtMjY3NC03MTUyLWI1ODMtMzljZWQwOTFhY2UzOmUzMzVlZTUxLTFmZWUtNGMzYi1iZGY4LTdhZGIyZGJiNWVhNA==';
  const gigachatScope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';

  try {
    const token = await getGigaChatToken(gigachatKey, gigachatScope);
    const balance = await getGigaChatBalance(token);
    return res.status(200).json({
      status: 'success',
      balance
    });
  } catch (error) {
    console.error('Ошибка получения баланса GigaChat:', error);
    return res.status(500).json({
      error: error.message || 'Ошибка получения баланса'
    });
  }
}
