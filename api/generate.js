// api/generate.js
// Серверная функция Vercel Serverless для автономной генерации задач Добро.рф через GigaChat (Сбер) / Gemini API
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

// Вызов Chat Completions GigaChat
async function callGigaChatCompletions(accessToken, messages, model = 'GigaChat') {
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
          reject(new Error(`GigaChat completions вернул статус ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export default async function handler(req, res) {
  // CORS-заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const gigachatKey = process.env.GIGACHAT_AUTH_KEY || 'MDFhMjAyZWEtMjY3NC03MTUyLWI1ODMtMzljZWQwOTFhY2UzOmUzMzVlZTUxLTFmZWUtNGMzYi1iZGY4LTdhZGIyZGJiNWVhNA==';
  const gigachatScope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';

  try {
    const {
      orgName = 'Социальный партнер',
      contactFio = 'Представитель организации',
      promptText = '',
      sources = []
    } = req.body || {};

    // Собираем контекст из текста и материалов
    let materialsText = promptText.trim();
    if (sources.length > 0) {
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
Твоя задача: упаковать материалы социального партнера в ровно 3 разноплановых варианта студенческих проектов строго под анкету платформы Добро.рф:
1. Вариант 1 (Аналитика/исследование) — полевые/кабинетные исследования, аудит потребностей, аналитический отчет.
2. Вариант 2 (Прикладной цифровой продукт) — база данных, чат-бот, портал, регламент, интерактивная карта, цифровой сервис.
3. Вариант 3 (Медиа/просвещение/событие) — просветительская акция, организация мероприятия, медиасопровождение.

ПРАВИЛА ВЫБОРА НАПРАВЛЕНИЙ (ТЕГОВ) ДОБРО.РФ:
В поле 'directions' укажи от 1 до 3 тегов СТРОГО с символом # из официального списка с учетом специфики:
- #сохраняй_природу: защита природы, животные, зооволонтерство, сельское хозяйство, фермы, экология.
- #развивай_среду: благоустройство, городская и сельская среда, территориальное развитие.
- #создавай_возможности: образование, наука, цифровые сервисы, развитие талантов и компетенций.
- #будь_здоров: здравоохранение, донорство, ЗОЖ, помощь больным и паллиативная забота.
- #стирай_границы: инклюзия, поддержка людей с ОВЗ и инвалидностью.
- #защищай: правовая защита, безопасность, юриспруденция.
- #МЫВМЕСТЕ: помощь семьям в трудной ситуации, ветеранам, общественная поддержка.
- #объединяй: межкультурный диалог, объединение сообществ, межрегиональные связи.
- #делись_опытом: наставничество, передача практических навыков.
- #вклад_в_будущее: профориентация, молодежные инициативы, поддержка детей.
- #расскажи_о_главном: медиаволонтерство, инфографика, просветительские кампании в СМИ и соцсетях.
- #помни: патриотическое воспитание, историческая память, сохранение наследия.
- #открывай_страну: краеведение, внутренний туризм, экспедиции.

ОТВЕТ ДОЛЖЕН БЫТЬ СТРОГО В ФОРМАТЕ JSON — МАССИВ ИЗ 3 ОБЪЕКТОВ. Без markdown-тегов, без лишних слов.
Каждый объект массива обязан содержать ровно следующие ключи:
- "variantLabel": "Вариант 1" (или "Вариант 2", "Вариант 3")
- "task_title": краткое емкое название строго до 120 символов
- "directions": массив от 1 до 3 хэштегов из списка выше
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

    // 1. Получаем токен GigaChat
    const token = await getGigaChatToken(gigachatKey, gigachatScope);

    // 2. Делаем запрос к GigaChat
    const rawAiResponse = await callGigaChatCompletions(token, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // 3. Извлекаем JSON из ответа
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
      // Попытка найти JSON массив в тексте
      const start = jsonStr.indexOf('[');
      const end = jsonStr.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        parsedTasks = JSON.parse(jsonStr.substring(start, end + 1));
      } else {
        throw new Error('Модель вернула некорректный формат JSON');
      }
    }

    if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
      throw new Error('Пустой список задач от модели');
    }

    // Нормализация задач под стандарт
    const normalizedTasks = parsedTasks.map((t, idx) => {
      let dirs = Array.isArray(t.directions) ? t.directions : ['#МЫВМЕСТЕ'];
      dirs = dirs.map((d) => (d.startsWith('#') ? d : `#${d}`)).filter((d) => DOBRO_DIRECTIONS.includes(d));
      if (dirs.length === 0) dirs = ['#МЫВМЕСТЕ'];

      return {
        id: `gigachat-cloud-${Date.now()}-${idx}`,
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

    return res.status(200).json({
      status: 'success',
      provider: 'gigachat-cloud',
      tasks: normalizedTasks
    });
  } catch (error) {
    console.error('Ошибка генерации задач GigaChat Serverless:', error);
    return res.status(500).json({
      error: error.message || 'Ошибка генерации задач'
    });
  }
}
