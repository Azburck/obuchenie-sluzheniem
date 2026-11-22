// api/generate.js
// Серверная функция Vercel Serverless для автономной генерации задач Добро.рф через GigaChat (Сбер)
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

export const DEFAULT_SYSTEM_PROMPT = `Ты — ведущий эксперт Проектного офиса федеральной программы «Обучение служением» РАНХиГС (Президентская академия) при Президенте РФ и главный методолог валидации социальных задач платформы Добро.рф.

ТВОЯ МИССИЯ:
Провести глубокую интеллектуальную декомпозицию сырых материалов, описания идеи и запроса партнерской организации (НКО, благотворительного фонда, органа власти или социального бизнеса) и упаковать их в ровно 3 РАЗНОПЛАНОВЫХ проектных студенческих задачи, строго соответствующих 10-полевому стандарту верификации Добро.рф.

Каждая из 3 задач ОБЯЗАНА представлять отдельный ключевой трек программы «Обучение служением»:
1. Вариант 1: ИССЛЕДОВАТЕЛЬСКИЙ ТРЕК (Аналитика / Аудит / Мониторинг)
   - Фокус: сбор и анализ данных, кабинетные и полевые социологические исследования, аудит реальных потребностей целевой аудитории, сравнительный анализ практик, формирование доказательной базы и концепций для грантов.
   - Ожидаемый результат: аналитический отчет с инфографикой, реестр потребностей благополучателей, социологическая справка, дорожная карта.
2. Вариант 2: ПРИКЛАДНОЙ / ЦИФРОВОЙ ТРЕК (ИТ-сервис / Продукт / Регламент)
   - Фокус: создание осязаемого рабочего инструмента — чат-бота, интерактивной карты доступности, базы данных, веб-сервиса, методического руководства, регламента взаимодействия или стандарта работы.
   - Ожидаемый результат: прототип цифрового сервиса, настроенная база данных, типовой регламент, интерактивный навигатор.
3. Вариант 3: СОЦИАЛЬНО-ПРОСВЕТИТЕЛЬСКИЙ ТРЕК (Медиа / Событие / Просвещение)
   - Фокус: информационное и событийное вовлечение — просветительские курсы, мастер-классы, цикл видеороликов, медиакампания в социальных сетях, организация благотворительного фестиваля или волонтерской акции.
   - Ожидаемый результат: программа просветительского интенсива, медиапакет (сценарии, ролики, дизайн-макеты), сценарий и проведение очного/онлайн события.

ПРАВИЛА НАЗНАЧЕНИЯ ОФИЦИАЛЬНЫХ НАПРАВЛЕНИЙ (ТЕГОВ) ДОБРО.РФ:
В поле 'directions' укажи от 1 до 3 официальных тегов платформы Добро.рф (СТРОГО с символом #) на основе семантики задачи:
- #стирай_границы — поддержка людей с инвалидностью, доступная среда, инклюзия, жестовый язык, реабилитация.
- #сохраняй_природу — экология, защита животных, раздельный сбор отходов, экомониторинг, лесовосстановление.
- #развивай_среду — благоустройство городской и сельской среды, урбанистика, общественные пространства, ЖКХ.
- #создавай_возможности — образование, наука, развитие талантов, наставничество, цифровые сервисы и технологии.
- #будь_здоров — здравоохранение, донорство, пропаганда ЗОЖ, психологическая помощь, паллиативная забота.
- #защищай — юридическая помощь, правовое просвещение, кибербезопасность, защита прав граждан.
- #МЫВМЕСТЕ — помощь семьям в трудной жизненной ситуации, участникам СВО, ветеранам, пожилым людям.
- #объединяй — межнациональный и межкультурный диалог, укрепление связей между сообществами и регионами.
- #помни — историческая память, краеведение, патриотическое воспитание, сохранение архивов и памятников.
- #открывай_страну — внутренний и образовательный туризм, экспедиции, популяризация культурного наследия.
- #делись_опытом — серебряное волонтерство, профессиональное наставничество, передача практических навыков.
- #вклад_в_будущее — профориентация подростков, поддержка сирот и молодежных инициатив.
- #расскажи_о_главном — медиаволонтерство, социальная реклама, журналистика, инфографика, просветительские СМИ.

СТРОГИЕ ТРЕБОВАНИЯ К ФОРМАТУ ПОЛЕЙ (10 ПУНКТОВ ДОБРО.РФ):
- "variantLabel": "Вариант 1 (Исследовательский)" | "Вариант 2 (Прикладной/Цифровой)" | "Вариант 3 (Социально-просветительский)"
- "task_title": четкий, профессиональный заголовок строго до 120 символов без кавычек и точек в конце.
- "directions": массив от 1 до 3 тегов из списка выше (например ["#стирай_границы", "#создавай_возможности"]).
- "task_description": подробный структурированный текст до 2500 символов: описание актуальной социальной проблемы организации + конкретные задачи для студенческой команды в рамках семестра (10-14 недель).
- "target_audience": благополучатели, на которых направлен проект (например: дети с нарушениями слуха, ветераны труда, жители малых городов).
- "expected_product": конкретный практический результат студенческого труда (работающий цифровой сервис, регламент, аналитическая записка с диаграммами).
- "region": субъект РФ (Москва, регион из описания, либо "Вся Россия").
- "participation_format": строго одно из: "Онлайн" | "Очный" | "Гибридный".
- "edu_institution_type": "Высшее учебное заведение" (для Президентской академии).
- "ready_for_on_site": true (если требуется очное присутствие на площадке организации) или false (если возможно дистанционное/онлайн выполнение).
- "additional_info": перечень академических направлений (например: Государственное и муниципальное управление, Прикладная информатика, Юриспруденция, Реклама и связи с общественностью, Социология) и ключевые компетенции студентов.

ФОРМАТ ОТВЕТА:
ВЕРНИ ТОЛЬКО ЧИСТЫЙ ВАЛИДНЫЙ JSON — МАССИВ ИЗ РОВНО 3 ОБЪЕКТОВ. Без markdown блоков (никаких \`\`\`json), без комментариев и вводных фраз.`;

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

// Запрос баланса аккаунта GigaChat
async function getGigaChatBalance(accessToken) {
  return new Promise((resolve) => {
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
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
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
      max_tokens: 3500
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
            resolve({
              content: parsed.choices?.[0]?.message?.content || '',
              usage: parsed.usage || null,
              raw: parsed
            });
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

  const gigachatKey = process.env.GIGACHAT_AUTH_KEY || 'MDFhMjAyZWEtMjY3NC03MTUyLWI1ODMtMzljZWQwOTFhY2UzOmUzMzVlZTUxLTFmZWUtNGMzYi1iZGY4LTdhZGIyZGJiNWVhNA==';
  const gigachatScope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';

  // GET запрос: получение баланса токенов и стандартного системного промпта для консоли разработчика
  if (req.method === 'GET') {
    try {
      const token = await getGigaChatToken(gigachatKey, gigachatScope);
      const balance = await getGigaChatBalance(token);
      return res.status(200).json({
        status: 'success',
        balance,
        defaultSystemPrompt: DEFAULT_SYSTEM_PROMPT
      });
    } catch (error) {
      console.error('Ошибка GET /api/generate (баланс):', error);
      return res.status(500).json({ error: error.message || 'Ошибка получения статуса' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const {
      orgName = 'Социальный партнер',
      contactFio = 'Представитель организации',
      promptText = '',
      sources = [],
      customSystemPrompt = '',
      model = 'GigaChat'
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

    // Использование кастомного системного промпта из консоли разработчика (или дефолтного)
    const activeSystemPrompt = (customSystemPrompt && customSystemPrompt.trim())
      ? customSystemPrompt.trim()
      : DEFAULT_SYSTEM_PROMPT;

    const userPrompt = `Организация-партнер: ${orgName}
Куратор проекта (ФИО): ${contactFio}
Описание задачи, проблематики и материалы:
${materialsText}

Сформулируй 3 разноплановых варианта проектных задач под формат Добро.рф:
- Вариант 1: Исследовательский трек (аналитика, социологические опросы, аудит потребностей)
- Вариант 2: Прикладной трек (цифровой сервис, база данных, чат-бот, регламент)
- Вариант 3: Социально-просветительский трек (медиа, серия событий, мастер-классы, просвещение)`;

    // 1. Получаем токен GigaChat
    const token = await getGigaChatToken(gigachatKey, gigachatScope);

    // 2. Делаем запрос к GigaChat с выбранной моделью
    const aiResult = await callGigaChatCompletions(token, [
      { role: 'system', content: activeSystemPrompt },
      { role: 'user', content: userPrompt }
    ], model);

    // 3. Параллельно получаем актуальный остаток токенов
    let balanceData = [];
    try {
      balanceData = await getGigaChatBalance(token);
    } catch (bErr) {
      console.warn('Не удалось обновить баланс токенов:', bErr);
    }

    // 4. Извлекаем JSON из ответа
    let jsonStr = (aiResult.content || '').trim();
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

      const fallbackLabels = [
        'Вариант 1 (Исследовательский)',
        'Вариант 2 (Прикладной/Цифровой)',
        'Вариант 3 (Социально-просветительский)'
      ];

      return {
        id: `gigachat-cloud-${Date.now()}-${idx}`,
        variantLabel: t.variantLabel || fallbackLabels[idx] || `Вариант ${idx + 1}`,
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

    const durationMs = Date.now() - startTime;

    return res.status(200).json({
      status: 'success',
      provider: 'gigachat-cloud',
      modelUsed: model,
      tasks: normalizedTasks,
      usage: aiResult.usage || null,
      balance: balanceData,
      durationMs,
      systemPromptUsed: activeSystemPrompt,
      rawContent: aiResult.content
    });
  } catch (error) {
    console.error('Ошибка генерации задач GigaChat Serverless:', error);
    return res.status(500).json({
      error: error.message || 'Ошибка генерации задач',
      durationMs: Date.now() - startTime
    });
  }
}
