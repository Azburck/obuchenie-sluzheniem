// api/generate.js
// Серверная функция Vercel Serverless для генерации задач Добро.рф через Gemini API

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

// Извлечение чистого текстового контента со страницы сайта партнера
async function fetchWebsiteText(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; RanepaServiceLearningBot/1.0)'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return `Не удалось загрузить сайт (код ${res.status}). Учитывайте название организации.`;
    }
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12000);
  } catch (e) {
    return `Не удалось автоматически загрузить содержимое страницы ${url}. Опирайтесь на название и описание от партнера.`;
  }
}

// Отправка данных заявки в Google Таблицу («Копилка партнеров»)
async function sendToGoogleSheets(webhookUrl, payload) {
  if (!webhookUrl) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error('Ошибка записи в Google Таблицу:', err.message);
  }
}

export default async function handler(req, res) {
  // CORS-заголовки для поддержки запросов с локального сервера и внешних доменов
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Не настроен GEMINI_API_KEY в переменных окружения сервера (Vercel).'
    });
  }

  try {
    const {
      orgName = '',
      contactFio = '',
      contactPhone = '',
      contactEmail = '',
      sources = []
    } = req.body || {};

    const parts = [];
    let textContext = `Организация социального партнера: ${orgName || 'Не указана'}\n` +
      `Контактное лицо: ${contactFio || 'Не указано'}\n` +
      `Телефон: ${contactPhone || 'Не указан'}\n` +
      `Email: ${contactEmail || 'Не указан'}\n\n` +
      `Материалы и источники партнера:\n`;

    for (let i = 0; i < sources.length; i++) {
      const src = sources[i];
      if (src.type === 'url' && src.title) {
        const siteText = await fetchWebsiteText(src.title);
        textContext += `\n--- Сайт ${src.title} ---\n${src.content || ''}\nТекст со страницы:\n${siteText}\n`;
      } else if (src.type === 'file' && src.base64Data && src.mimeType === 'application/pdf') {
        // Передаем PDF напрямую в Gemini мультимодально
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: src.base64Data
          }
        });
        textContext += `\n--- Прикрепленный PDF-документ: ${src.title} (содержимое передано в запрос) ---\n`;
      } else {
        textContext += `\n--- Источник (${src.title || 'Материал'}) ---\n${src.content || ''}\n`;
      }
    }

    textContext += `\n\nЗАДАЧА:\nНа основе представленных документов, описания и сайта сформулируй ровно 3 разноплановых варианта учебно-социальных проектных задач для студентов Президентской академии:
1. Вариант 1 — Аналитическое исследование / аудит целевой аудитории и потребностей.
2. Вариант 2 — Прикладной или цифровой продукт (методическое пособие, прототип сервиса, регламент, база данных).
3. Вариант 3 — Коммуникации, медиа, просветительская кампания или организация социально значимого события.

Все поля должны быть полностью заполнены под стандарты верификации федеральной платформы Добро.рф.`;

    parts.unshift({ text: textContext });

    const systemPrompt = `Ты — ведущий методолог федеральной программы «Обучение служением» в Президентской академии (РАНХиГС).
Твоя миссия — анализировать материалы социальных партнеров (НКО, государственных учреждений, благотворительных фондов, социальных предпринимателей) и упаковывать их в четкие, академически выверенные и практически реализуемые студенческие проекты для верификации на платформе Добро.рф.

КРИТЕРИИ ЗАПОЛНЕНИЯ:
- Стиль: строгий деловой и академический язык, без разговорных клише и без эмодзи.
- task_title: емкое название задачи строго до 120 символов.
- directions: массив от 1 до 3 хештегов СТРОГО из списка: ${DOBRO_DIRECTIONS.join(', ')}.
- task_description: подробное описание социальной проблемы, контекста и задач для студентов (до 3000 символов, используй маркированные списки).
- target_audience: четкое описание благополучателей (до 3000 символов).
- expected_product: конкретный измеримый результат/артефакт работы студентов (до 3000 символов).
- region: субъект РФ (по умолчанию город расположения партнера или "Москва").
- participation_format: строго одно из значений: "Очный", "Заочный / Онлайн", "Гибридный".
- edu_institution_type: "Высшее учебное заведение".
- ready_for_on_site: boolean (true/false).
- additional_info: требования к компетенциям студентов, наставничество партнера и необходимые ресурсы (до 3000 символов).`;

    const responseSchema = {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          variantLabel: { type: 'STRING' },
          task_title: { type: 'STRING' },
          directions: { type: 'ARRAY', items: { type: 'STRING' } },
          task_description: { type: 'STRING' },
          target_audience: { type: 'STRING' },
          expected_product: { type: 'STRING' },
          region: { type: 'STRING' },
          participation_format: { type: 'STRING' },
          edu_institution_type: { type: 'STRING' },
          ready_for_on_site: { type: 'BOOLEAN' },
          additional_info: { type: 'STRING' }
        },
        required: [
          'variantLabel',
          'task_title',
          'directions',
          'task_description',
          'target_audience',
          'expected_product',
          'region',
          'participation_format',
          'edu_institution_type',
          'ready_for_on_site',
          'additional_info'
        ]
      }
    };

    const modelsToTry = [
      process.env.GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ].filter(Boolean);

    let geminiData = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema
            }
          })
        });

        if (response.ok) {
          geminiData = await response.json();
          break;
        } else {
          const errBody = await response.text();
          lastError = `Модель ${modelName} вернула статус ${response.status}: ${errBody}`;
        }
      } catch (err) {
        lastError = `Ошибка при обращении к ${modelName}: ${err.message}`;
      }
    }

    if (!geminiData) {
      return res.status(502).json({
        error: 'Не удалось получить ответ от Gemini API',
        details: lastError
      });
    }

    const rawJson = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    const tasks = JSON.parse(rawJson || '[]');

    // Шаг 4: Асинхронное сохранение заявки в Google Таблицу («Копилка партнеров»)
    const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBAPP_URL || process.env.LEADS_WEBHOOK_URL;
    if (sheetsWebhook) {
      sendToGoogleSheets(sheetsWebhook, {
        timestamp: new Date().toISOString(),
        orgName,
        contactFio,
        contactPhone,
        contactEmail,
        sourcesCount: sources.length,
        sourcesSummary: sources.map((s) => s.title || s.type).join('; '),
        tasksCount: tasks.length,
        firstTaskTitle: tasks[0]?.task_title || '',
        tasksJson: JSON.stringify(tasks)
      });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Внутренняя ошибка генератора:', error);
    return res.status(500).json({
      error: error.message || 'Внутренняя ошибка сервера при генерации'
    });
  }
}
