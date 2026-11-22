// server.js
// Универсальный Node.js сервер для Amvera Cloud / Docker / локального запуска
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import generateHandler from './api/generate.js';
import balanceHandler from './api/balance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API маршруты
app.all('/api/generate', (req, res) => generateHandler(req, res));
app.all('/api/balance', (req, res) => balanceHandler(req, res));

// Раздача статических файлов собранного фронтенда
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: все остальные GET-запросы отдают index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Обязательно слушаем 0.0.0.0 для Amvera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер «Обучение служением» РАНХиГС успешно запущен на порту ${PORT}`);
});
