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
  ArrowRight
} from 'lucide-react';

export const DEFAULT_SYSTEM_PROMPT = `Ты — ведущий эксперт Проектного офиса программы «Обучение служением» РАНХиГС (Президентская академия) и федеральный методолог платформы Добро.рф.
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
  onRestoreFromHistory
}) {
  const [activeTab, setActiveTab] = useState('tokens'); // 'tokens' | 'prompt' | 'history'
  const [promptDraft, setPromptDraft] = useState(systemPrompt || DEFAULT_SYSTEM_PROMPT);
  const [copiedKey, setCopiedKey] = useState('');
  const [expandedReqId, setExpandedReqId] = useState(null);
  const [showRawJsonId, setShowRawJsonId] = useState(null);

  useEffect(() => {
    if (systemPrompt) {
      setPromptDraft(systemPrompt);
    }
  }, [systemPrompt]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col text-slate-100 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Хедер консоли */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9E1B32] to-rose-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Консоль разработчика
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  GigaChat API 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Мониторинг баланса токенов, управление системным промптом и история запросов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {primaryTokens !== null && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-emerald-400">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Остаток: {(primaryTokens / 1000000).toFixed(2)}M токенов</span>
              </div>
            )}
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
            <span>Остаток токенов и метрики</span>
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
          {/* ВКЛАДКА 1: ТОКЕНЫ И БАЛАНС                                   */}
          {/* ============================================================== */}
          {activeTab === 'tokens' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Верхняя плашка с кнопкой обновления */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Баланс токенов нейросети GigaChat (Сбер)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Живой остаток токенов аккаунта, возвращаемый эндпоинтом /api/v1/balance
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
                  Доступные квоты по моделям Сбера
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {balanceList.length > 0 ? (
                    balanceList.map((item, idx) => {
                      const isMain = item.usage === 'GigaChat';
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
                              Текущая модель
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-400 block mb-1">
                            {item.usage}
                          </span>
                          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block">
                            {formatNumber(item.value)}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
                            ≈ {(Number(item.value) / 1000000).toFixed(2)} млн токенов
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center bg-slate-800/30 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                      {isLoadingBalance
                        ? 'Загрузка остатка токенов...'
                        : 'Данные о балансе временно недоступны. Нажмите «Обновить баланс».'}
                    </div>
                  )}
                </div>
              </div>

              {/* Метрики текущей сессии */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Статистика использования в текущей сессии
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
                    <span className="text-[10px] text-slate-400 block mt-0.5">
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
                    Изменения вступают в силу немедленно и передаются во все последующие вызовы GigaChat API.
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
