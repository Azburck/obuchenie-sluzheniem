import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Coins,
  Sliders,
  History,
  X,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Trash2,
  ExternalLink,
  Code2,
  ArrowRight,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const MASTER_CONSOLE_PASSWORD = 'Ranepa_Project-Office2026!';

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

export default function DevConsoleModal({
  isOpen,
  onClose,
  systemPrompt,
  onSaveSystemPrompt,
  onResetSystemPrompt,
  balanceList = [],
  isLoadingBalance = false,
  onRefreshBalance,
  requestHistory = [],
  onClearHistory,
  onRestoreFromHistory,
  selectedModel = 'GigaChat',
  onSelectModel
}) {
  const [activeTab, setActiveTab] = useState('tokens'); // 'tokens' | 'prompt' | 'history'
  const [promptDraft, setPromptDraft] = useState(systemPrompt || DEFAULT_SYSTEM_PROMPT);
  const [copiedKey, setCopiedKey] = useState('');
  const [expandedReqId, setExpandedReqId] = useState(null);
  const [showRawJsonId, setShowRawJsonId] = useState(null);

  // Парольная защита консоли разработчика
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('dev_console_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (systemPrompt) {
      setPromptDraft(systemPrompt);
    }
  }, [systemPrompt]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    if (passwordInput === MASTER_CONSOLE_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
      try {
        sessionStorage.setItem('dev_console_authenticated', 'true');
      } catch (err) {}
    } else {
      setPasswordError('Неверный пароль администратора. Доступ заблокирован.');
    }
  };

  const handleLockConsole = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
    try {
      sessionStorage.removeItem('dev_console_authenticated');
    } catch (err) {}
  };

  const isCustomPromptActive =
    promptDraft.trim() !== DEFAULT_SYSTEM_PROMPT.trim();

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '—';
    return Number(num).toLocaleString('ru-RU');
  };

  const getPrimaryTokens = () => {
    const gigachatItem = balanceList.find((b) => b.usage === 'GigaChat');
    return gigachatItem ? gigachatItem.value : null;
  };

  const primaryTokens = getPrimaryTokens();

  // Подсчет статистики сессии
  const totalRequests = requestHistory.length;
  const totalTokensUsed = requestHistory.reduce(
    (acc, curr) => acc + (curr.usage?.total_tokens || 0),
    0
  );
  const totalPromptTokens = requestHistory.reduce(
    (acc, curr) => acc + (curr.usage?.prompt_tokens || 0),
    0
  );
  const totalCompletionTokens = requestHistory.reduce(
    (acc, curr) => acc + (curr.usage?.completion_tokens || 0),
    0
  );
  const avgDuration =
    totalRequests > 0
      ? Math.round(
          requestHistory.reduce((acc, curr) => acc + (curr.durationMs || 0), 0) /
            totalRequests
        )
      : 0;

  // =========================================================================
  // ЭКРАН 1: ПАРОЛЬНАЯ ЗАЩИТА (ЕСЛИ НЕ АВТОРИЗОВАН)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div
          className="bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-slate-100 font-sans relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Декоративное свечение */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9E1B32] to-rose-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30">
                Президентская академия (РАНХиГС)
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-2">
                Консоль разработчика
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Панель управления системным промптом, остатком токенов и архитектурой ИИ. Введите пароль администратора.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Пароль администратора
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  autoFocus
                  placeholder="Введите пароль..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-rose-600 hover:from-rose-700 hover:to-rose-600 text-xs font-bold text-white shadow-md shadow-rose-950/40 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Войти</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ЭКРАН 2: АВТОРИЗОВАННАЯ КОНСОЛЬ РАЗРАБОТЧИКА
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div
        className="bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col text-slate-100 overflow-hidden backdrop-blur-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Хедер консоли */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9E1B32] to-rose-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Консоль разработчика РАНХиГС
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Добро.рф Validated
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 font-mono">
                  {selectedModel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Управление остатком токенов, выбор модели, системный промпт и логирование
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {primaryTokens !== null && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-emerald-400 font-mono">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Остаток: {(primaryTokens / 1000000).toFixed(2)}M</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLockConsole}
              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer text-xs font-semibold flex items-center gap-1 border border-slate-700/60"
              title="Заблокировать консоль и выйти"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Закрыть консоль (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Навигационные табы консоли */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 sm:px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'tokens'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Токены и Модель ИИ</span>
            {primaryTokens !== null && (
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 font-mono">
                {(primaryTokens / 1000000).toFixed(1)}M
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Системный промпт</span>
            {isCustomPromptActive && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Модифицирован
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>История запросов</span>
            {totalRequests > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold">
                {totalRequests}
              </span>
            )}
          </button>
        </div>

        {/* Контент активного таба */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60 custom-scrollbar">
          {/* ============================================================== */}
          {/* ВКЛАДКА 1: ТОКЕНЫ И ВЫБОР МОДЕЛИ ИИ                          */}
          {/* ============================================================== */}
          {activeTab === 'tokens' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Блок выбора модели нейросети (доступен только через консоль) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/90 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Активная модель нейросети (GigaChat API)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Выбор модели скрыт от обычных пользователей и управляется только администратором через эту консоль
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    {
                      id: 'GigaChat',
                      title: 'GigaChat (Базовая)',
                      desc: 'Быстрая, стабильная генерация. Квота 250 млн токенов.',
                      tag: 'Рекомендуется'
                    },
                    {
                      id: 'GigaChat-Pro',
                      title: 'GigaChat-Pro',
                      desc: 'Продвинутая модель для сложных социальных задач. Квота 40 млн токенов.',
                      tag: 'Pro'
                    },
                    {
                      id: 'GigaChat-Max',
                      title: 'GigaChat-Max',
                      desc: 'Флагманская модель Сбера для глубокой аналитики. Квота 25 млн токенов.',
                      tag: 'Max'
                    }
                  ].map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => onSelectModel && onSelectModel(m.id)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-950/30 border-rose-500/80 ring-1 ring-rose-500/50 shadow-md shadow-rose-950/30'
                            : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-white">{m.title}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                isSelected
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {m.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                          {isSelected ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Активна для всех запросов
                            </span>
                          ) : (
                            <span className="text-slate-500 hover:text-slate-300">
                              Нажмите, чтобы включить
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Верхняя плашка с кнопкой обновления */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Остаток токенов нейросети GigaChat (Сбер)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Реальные данные из официального эндпоинта /api/v1/balance
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRefreshBalance}
                  disabled={isLoadingBalance}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingBalance ? 'animate-spin' : ''}`}
                  />
                  <span>{isLoadingBalance ? 'Обновление...' : 'Обновить баланс'}</span>
                </button>
              </div>

              {/* Сетка балансов по моделям */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Остаток квот по моделям Сбера
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {balanceList.length > 0 ? (
                    balanceList.map((item, idx) => {
                      const isMain = item.usage === selectedModel;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition relative overflow-hidden ${
                            isMain
                              ? 'bg-gradient-to-br from-slate-800 to-slate-800/90 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/20'
                              : 'bg-slate-800/40 border-slate-700/80'
                          }`}
                        >
                          {isMain && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Выбрана
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-400 block mb-1">
                            {item.usage}
                          </span>
                          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block">
                            {formatNumber(item.value)}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium mt-1 block font-mono">
                            ≈ {(Number(item.value) / 1000000).toFixed(2)} млн токенов
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center bg-slate-800/30 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                      {isLoadingBalance
                        ? 'Загрузка остатка токенов...'
                        : 'Данные о балансе загружаются. Нажмите «Обновить баланс».'}
                    </div>
                  )}
                </div>
              </div>

              {/* Метрики текущей сессии */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Метрики текущей сессии
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Всего запросов</span>
                    <span className="text-xl font-bold text-white font-mono">{totalRequests}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Потрачено токенов</span>
                    <span className="text-xl font-bold text-rose-400 font-mono">
                      {formatNumber(totalTokensUsed)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      P: {formatNumber(totalPromptTokens)} / C: {formatNumber(totalCompletionTokens)}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Среднее время ответа</span>
                    <span className="text-xl font-bold text-white font-mono">
                      {avgDuration ? `${(avgDuration / 1000).toFixed(2)} c` : '—'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Статус облака</span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      100% Онлайн (Vercel)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ВКЛАДКА 2: СИСТЕМНЫЙ ПРОМПТ                                   */}
          {/* ============================================================== */}
          {activeTab === 'prompt' && (
            <div className="space-y-4 max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Управление системным промптом (System Prompt)
                    </h4>
                    {isCustomPromptActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Кастомный промпт активен
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Стандарт РАНХиГС
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Изменения вступают в силу немедленно и применяются ко всем пользователям сайта.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleCopy(promptDraft, 'prompt')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedKey === 'prompt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPromptDraft(DEFAULT_SYSTEM_PROMPT);
                      onResetSystemPrompt();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition cursor-pointer"
                    title="Сбросить к исходному стандарту РАНХиГС"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить к стандарту</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSaveSystemPrompt(promptDraft)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-rose-950/40"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Применить для всей системы</span>
                  </button>
                </div>
              </div>

              {/* Поле редактирования промпта */}
              <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl border border-slate-700/80 overflow-hidden min-h-[380px]">
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-rose-400" />
                    <span className="font-mono">system_prompt.txt</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span>Символов: {promptDraft.length}</span>
                    <span>Строк: {promptDraft.split('\n').length}</span>
                  </div>
                </div>

                <textarea
                  value={promptDraft}
                  onChange={(e) => setPromptDraft(e.target.value)}
                  className="flex-1 w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-slate-200 resize-none focus:outline-none focus:ring-0 leading-relaxed custom-scrollbar selection:bg-rose-900/60"
                  placeholder="Введите системный промпт для GigaChat..."
                  rows={16}
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ВКЛАДКА 3: ИСТОРИЯ ЗАПРОСОВ И ОТВЕТОВ                         */}
          {/* ============================================================== */}
          {activeTab === 'history' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Журнал запросов и ответов</h4>
                    <p className="text-xs text-slate-400">
                      Логирование всех обращений к GigaChat, затраченных токенов и сгенерированных задач
                    </p>
                  </div>
                </div>

                {requestHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-semibold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Очистить журнал</span>
                  </button>
                )}
              </div>

              {requestHistory.length === 0 ? (
                <div className="py-16 text-center bg-slate-800/30 rounded-2xl border border-slate-800 text-slate-400">
                  <History className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-300">Журнал запросов пуст</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Отправьте задачу на генерацию на главной странице, и её параметры, токены и ответ модели автоматически появятся здесь.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requestHistory.map((item, idx) => {
                    const isExpanded = expandedReqId === item.id;
                    const isRawOpen = showRawJsonId === item.id;

                    return (
                      <div
                        key={item.id || idx}
                        className="rounded-2xl bg-slate-800/50 border border-slate-700/80 overflow-hidden transition"
                      >
                        {/* Заголовок записи журнала */}
                        <div
                          onClick={() => setExpandedReqId(isExpanded ? null : item.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/80 transition"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                                item.status === 'success' || item.status === 200
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {item.status === 'success' || item.status === 200 ? '200 OK' : 'Ошибка'}
                            </span>
                            <div>
                              <span className="text-xs text-slate-400 font-mono">
                                {item.timestamp}
                              </span>
                              <h5 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                                {item.promptText || 'Запрос на декомпозицию задачи'}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                            {item.durationMs && (
                              <span className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {(item.durationMs / 1000).toFixed(2)}с
                              </span>
                            )}
                            {item.usage && (
                              <span className="px-2 py-1 rounded-md bg-slate-900 text-rose-300 font-semibold border border-slate-700/60">
                                🪙 {item.usage.total_tokens || 0} токенов
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Развернутое содержимое */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-700/80 bg-slate-950/60 space-y-4 text-xs">
                            {/* Блок метаданных */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-slate-500 block">Организация:</span>
                                <span className="font-semibold text-slate-200">
                                  {item.orgName || 'Социальный партнер'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Куратор:</span>
                                <span className="font-semibold text-slate-200">
                                  {item.contactFio || 'Представитель'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Prompt / Completion:</span>
                                <span className="font-mono text-slate-200">
                                  {item.usage?.prompt_tokens || 0} /{' '}
                                  {item.usage?.completion_tokens || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Источники:</span>
                                <span className="text-slate-200">
                                  {item.sources?.length || 0} прикреплено
                                </span>
                              </div>
                            </div>

                            {/* Сгенерированные задачи */}
                            {item.tasks && item.tasks.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                                    Сгенерированные варианты ({item.tasks.length})
                                  </span>
                                  {onRestoreFromHistory && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onRestoreFromHistory(item.tasks);
                                        onClose();
                                      }}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                                    >
                                      <span>Восстановить в форму на сайте</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  {item.tasks.map((t, tIdx) => (
                                    <div
                                      key={tIdx}
                                      className="p-3 rounded-xl bg-slate-900 border border-slate-800"
                                    >
                                      <span className="text-[10px] font-bold text-rose-400 block mb-1">
                                        {t.variantLabel || `Вариант ${tIdx + 1}`}
                                      </span>
                                      <h6 className="font-bold text-white text-xs mb-1 line-clamp-2">
                                        {t.task_title}
                                      </h6>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {(t.directions || []).map((dir, dIdx) => (
                                          <span
                                            key={dIdx}
                                            className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400"
                                          >
                                            {dir}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Кнопка показа сырого JSON */}
                            <div className="pt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowRawJsonId(isRawOpen ? null : item.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
                              >
                                <Code2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>{isRawOpen ? 'Скрыть сырой JSON' : 'Показать сырой JSON ответа'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(JSON.stringify(item, null, 2), `raw-${item.id}`)
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                              >
                                {copiedKey === `raw-${item.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Скопировано</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Копировать всё</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Раскрытый сырой JSON */}
                            {isRawOpen && (
                              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto max-h-64 font-mono text-[11px] text-slate-300 custom-scrollbar">
                                <pre>{JSON.stringify(item, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
