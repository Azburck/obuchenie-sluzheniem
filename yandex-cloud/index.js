// yandex-cloud/index.js
// Функция для Яндекс Облака (Yandex Cloud Functions, Node.js 18 / 20 / 22)
// Автономная генерация проектных задач Добро.рф через GigaChat (Сбер) без внешних зависимостей

import https from 'https';
import crypto from 'crypto';

// Агент HTTPS с отключенной проверкой SSL для серверов Минцифры/Сбера
const sberAgent = new https.Agent({
  rejectUnauthorized: false
});

const DOBRO_DIRECTIONS = [
  '#МЫВМЕСТЕ',
  '#создавай_возможности',
  '#развивай_среду',
  '#будь_здоров',
  '#сохраняй_природу',
  '#стирай_границы',
  '#защищай',
  '#объединяй',
  '#помни',
  '#открывай_страну',
  '#делись_опытом',
  '#вклад_в_будущее',
  '#расскажи_о_главном'
];

// Получение OAuth-токена GigaChat
function getGigaChatToken(authKey, scope = 'GIGACHAT_API_PERS') {
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
          reject(new Error(`GigaChat OAuth статус ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Вызов Chat Completions GigaChat
function callGigaChatCompletions(accessToken, messages, model = 'GigaChat') {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.4,
      max_tokens: 3000
    });

    const options = {
      hostname: 'gigachat.devices.sberbank.ru',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      agent: sberAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.choices?.[0]?.message?.content || '');
          } catch (e) {
            reject(new Error(`Ошибка парсинга ответа GigaChat: ${e.message}`));
          }
        } else {
          reject(new Error(`GigaChat completions статус ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Главная точка входа для Yandex Cloud Functions
export async function handler(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };

  const method = event.httpMethod || event.method || 'POST';

  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Ключ авторизации GigaChat (из переменных окружения функции или по умолчанию)
  const gigachatKey = process.env.GIGACHAT_AUTH_KEY || 'MDFhMjAyZWEtMjY3NC03MTUyLWI1ODMtMzljZWQwOTFhY2UzOmUzMzVlZTUxLTFmZWUtNGMzYi1iZGY4LTdhZGIyZGJiNWVhNA==';
  const gigachatScope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';

  try {
    let body = {};
    if (event.body) {
      const rawText = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf-8')
        : event.body;
      body = typeof rawText === 'string' ? JSON.parse(rawText) : (rawText || {});
    }

    const {
      orgName = 'Социальный партнер',
      contactFio = 'Представитель организации',
      promptText = '',
      sources = []
    } = body;

    let materialsText = promptText.trim();
    if (sources && sources.length > 0) {
      const srcDetails = sources
        .map((s) => `[${s.type.toUpperCase()}: ${s.title}]\n${s.content || ''}`)
        .join('\n\n');
      materialsText = materialsText
        ? `${materialsText}\n\n=== МАТЕРИАЛЫ ПАРТНЕРА ===\n${srcDetails}`
        : srcDetails;
    }
    if (!materialsText) {
      materialsText = 'Разработка социально-ориентированного проекта в рамках программы «Обучение служением» Президентской академии.';
    }

    const systemPrompt = `Ты — ведущий эксперт Проектного офиса программы «Обучение служением» РАНХиГС (Президентская академия) и федеральный методолог платформы Добро.рф.
Твоя задача: на основе описания организации-партнера и материалов сформулировать ровно 3 РАЗНОПЛАНОВЫХ варианта проектных задач для студентов под строгий стандарт Добро.рф.

Официальные 13 направлений Добро.рф (выбирай от 1 до 3 подходящих для каждого варианта, обязательно с префиксом #):
#МЫВМЕСТЕ, #создавай_возможности, #развивай_среду, #будь_здоров, #сохраняй_природу, #стирай_границы, #защищай, #объединяй, #помни, #открывай_страну, #делись_опытом, #вклад_в_будущее, #расскажи_о_главном.

ОТВЕТ ДОЛЖЕН БЫТЬ СТРОГО В ФОРМАТЕ JSON — МАССИВ ИЗ 3 ОБЪЕКТОВ. Без markdown-тегов, без лишних слов.
Каждый объект массива обязан содержать ровно следующие ключи:
- "variantLabel": "Вариант 1" (или "Вариант 2", "Вариант 3")
- "task_title": краткое емкое название до 120 символов
- "directions": массив от 1 до 3 хэштегов из списка выше (например ["#развивай_среду", "#создавай_возможности"])
- "task_description": подробное описание социальной проблемы и задачи студентов (до 2000 символов)
- "target_audience": благополучатели (например: дети с ОВЗ, ветераны, пожилые граждане)
- "expected_product": конкретный прикладной результат (цифровой сервис, аналитический отчет, программа)
- "region": "Москва" (или указанный регион)
- "participation_format": "Онлайн" | "Очный" | "Гибридный"
- "edu_institution_type": "Высшее учебное заведение"
- "ready_for_on_site": false (или true)
- "additional_info": требования к студентам и компетенциям`;

    const userPrompt = `Организация: ${orgName}
Куратор/ФИО: ${contactFio}
Описание задачи и материалы:
${materialsText}`;

    // 1. Получаем OAuth-токен GigaChat
    const token = await getGigaChatToken(gigachatKey, gigachatScope);

    // 2. Запрос к модели GigaChat
    const rawAiResponse = await callGigaChatCompletions(token, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // 3. Парсинг ответа
    let jsonStr = rawAiResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedTasks = [];
    try {
      parsedTasks = JSON.parse(jsonStr);
    } catch (e) {
      const start = jsonStr.indexOf('[');
      const end = jsonStr.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        parsedTasks = JSON.parse(jsonStr.substring(start, end + 1));
      } else {
        throw new Error('Модель вернула некорректный JSON');
      }
    }

    if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
      throw new Error('Пустой список задач от модели');
    }

    const normalizedTasks = parsedTasks.map((t, idx) => {
      let dirs = Array.isArray(t.directions) ? t.directions : ['#МЫВМЕСТЕ'];
      dirs = dirs.map((d) => (d.startsWith('#') ? d : `#${d}`)).filter((d) => DOBRO_DIRECTIONS.includes(d));
      if (dirs.length === 0) dirs = ['#МЫВМЕСТЕ'];

      return {
        id: `gigachat-yandex-${Date.now()}-${idx}`,
        variantLabel: t.variantLabel || `Вариант ${idx + 1}`,
        task_title: (t.task_title || 'Социальная задача').slice(0, 120),
        directions: dirs.slice(0, 3),
        task_description: (t.task_description || '').slice(0, 3000),
        target_audience: (t.target_audience || '').slice(0, 3000),
        expected_product: (t.expected_product || '').slice(0, 3000),
        region: t.region || 'Москва',
        participation_format: t.participation_format || 'Онлайн',
        edu_institution_type: 'Высшее учебное заведение',
        ready_for_on_site: Boolean(t.ready_for_on_site),
        additional_info: (t.additional_info || '').slice(0, 3000)
      };
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        provider: 'gigachat-yandex-cloud',
        tasks: normalizedTasks
      })
    };
  } catch (error) {
    console.error('Ошибка генерации задач в Yandex Cloud Functions:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Ошибка генерации задач'
      })
    };
  }
}
