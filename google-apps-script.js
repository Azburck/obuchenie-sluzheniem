/**
 * Google Apps Script для автоматического сбора заявок партнеров («Копилка партнеров»)
 * 
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 1. Откройте нужную Google Таблицу (или создайте новую).
 * 2. В первой строке (Шапка) назовите колонки:
 *    A: Дата и время
 *    B: Организация
 *    C: ФИО контакта
 *    D: Телефон
 *    E: Email
 *    F: Кол-во источников
 *    G: Источники
 *    H: Кол-во задач
 *    I: Название первой задачи
 *    J: Полный JSON задач
 * 3. В меню выберите: Расширения -> Apps Script.
 * 4. Вставьте этот код в редактор.
 * 5. Нажмите: Развернуть -> Новое развертывание.
 * 6. Выберите тип: Веб-приложение (Web app).
 * 7. В поле «Кто имеет доступ» выберите: Все (Anyone) — это важно для приема данных от Vercel.
 * 8. Нажмите «Развернуть» и скопируйте полученный URL (заканчивается на /exec).
 * 9. Вставьте этот URL в Vercel в переменную GOOGLE_SHEETS_WEBAPP_URL.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Формируем строку для вставки в таблицу
    const row = [
      new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      data.orgName || 'Не указана',
      data.contactFio || 'Не указано',
      data.contactPhone || 'Не указан',
      data.contactEmail || 'Не указан',
      data.sourcesCount || 0,
      data.sourcesSummary || '',
      data.tasksCount || 0,
      data.firstTaskTitle || '',
      data.tasksJson || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Заявка успешно сохранена в Копилку' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Webhook "Копилка партнеров" активен и готов к приему данных.');
}
