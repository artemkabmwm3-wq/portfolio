document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('.tab-btn');
  const contentCard = document.getElementById('main-content');

  // 1. БИНАРНЫЙ МОДУЛЬ WEBASSEMBLY (Алгоритмическое ядро C++)
  const wasmBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x09, 0x01, 0x60, 0x04, 0x7f, 0x7f, 0x7f,
    0x03, 0x02, 0x01, 0x00,
    0x07, 0x17, 0x01, 0x13, 0x63, 0x61, 0x6c, 0x63,
    0x0a, 0x29, 0x01, 0x27, 0x00,
    0x41, 0x37,
    0x41, 0x10, 0x41, 0x05, 0x20, 0x00, 0x1b, 0x6a,
    0x20, 0x01, 0x41, 0x05, 0x6c, 0x6a,
    0x41, 0x05, 0x41, 0x0c, 0x20, 0x02, 0x1b, 0x6a,
    0x41, 0x08, 0x41, 0x7c, 0x20, 0x03, 0x41, 0x02,
    0x0b
  ]);

  let wasmCalculateMatch = null;
  let wasmActive = false;

  try {
    const wasmModule = await WebAssembly.instantiate(wasmBytes);
    wasmCalculateMatch = wasmModule.instance.exports.calcMatch || null;
    wasmActive = true;
  } catch (e) {
    console.warn("WASM fallback active:", e);
  }

  // Расширенный список навыков и профессий
  const availableTech = [
    "Инженерия", "C++", "Python", "Робототехника",
    "Схемотехника/Пайка", "3D-моделирование (CAD)",
    "Управление проектами", "Математика", "Физика",
    "Веб-дизайн", "Анализ данных", "Кибербезопасность",
    "ИИ/Машинное обучение", "UI/UX дизайн", "Маркетинг",
    "Аэрокосмическая инженерия", "Биоинженерия", "Разработка игр (Gamedev)"
  ];

  // Выпадающий список олимпиад
  const olympiadList = [
    "Всероссийская олимпиада школьников (ВсОШ)",
    "НПК «Инженеры будущего»",
    "Московская олимпиада школьников (МОШ)",
    "Олимпиада НТИ / Национальная технологическая олимпиада",
    "Олимпиада школьников «Шаг в будущее» (МГТУ Баумана)",
    "Олимпиада «Высшая проба» (НИУ ВШЭ)",
    "Курчатовская олимпиада",
    "Предпрофессиональная олимпиада",
    "Олимпиада «Росатом»",
    "Хакатон «Цифровой прорыв»",
    "Олимпиада «Ломоносов» (МГУ)"
  ];

  // Выпадающий список предметов и профилей
  const subjectList = [
    "Инженерия и технологии",
    "Информатика / Программирование",
    "Математика",
    "Физика",
    "Робототехника",
    "Химия / Материаловедение",
    "Экономика и предпринимательство",
    "Аэрокосмические системы",
    "Искусственный интеллект и Data Science",
    "Промышленный дизайн и 3D-моделирование"
  ];

  // Расширенная база учебных заведений
  const schoolsData = [
    { id: 1, name: "Бауманская инженерная школа № 1580", requiredTech: ["Инженерия", "Физика", "3D-моделирование (CAD)", "Схемотехника/Пайка"], minScore: 88, profile: "Инженерно-технологический" },
    { id: 2, name: "Лицей НИУ ВШЭ", requiredTech: ["Математика", "Управление проектами", "Экономика/Финансы"], minScore: 86, profile: "Экономика и бизнес" },
    { id: 3, name: "Колледж современных технологий (КСТ)", requiredTech: ["Схемотехника/Пайка", "3D-моделирование (CAD)", "Инженерия"], minScore: 75, profile: "Прикладные технологии" },
    { id: 4, name: "Школа № 179", requiredTech: ["C++", "Python", "Математика"], minScore: 92, profile: "Математика и алгоритмы" },
    { id: 5, name: "Экономический лицей РЭУ им. Плеханова", requiredTech: ["Управление проектами", "Веб-дизайн"], minScore: 82, profile: "Финансы и бизнес-проекты" },
    { id: 6, name: "Политехнический колледж № 8 им. Павлова", requiredTech: ["Инженерия", "Робототехника"], minScore: 74, profile: "Автоматизация и робототехника" },
    { id: 7, name: "Школа № 1535", requiredTech: ["Python", "C++", "Веб-дизайн"], minScore: 89, profile: "IT и разработка" },
    { id: 8, name: "Аэрокосмический лицей им. Королева", requiredTech: ["Инженерия", "Физика", "Аэрокосмическая инженерия"], minScore: 85, profile: "Аэрокосмический" },
    { id: 9, name: "IT-полигон / Колледж связи № 54", requiredTech: ["Кибербезопасность", "Python", "Схемотехника/Пайка"], minScore: 78, profile: "Сетевые технологии и безопасность" }
  ];

  function getSavedStack() {
    const raw = localStorage.getItem('portfolio_stack_v2');
    return raw ? JSON.parse(raw) : ["Инженерия", "C++", "Python", "3D-моделирование (CAD)"];
  }

  function getSavedOlympiads() {
    const raw = localStorage.getItem('portfolio_olympiads_v2');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [
      {
        name: "НПК «Инженеры будущего»",
        subject: "Инженерия и технологии",
        stage: "regional",
        status: "winner"
      }
    ];
  }

  function calculateExamForecast() {
    const math = parseInt(localStorage.getItem('exam_math') || '5', 10);
    const inf = parseInt(localStorage.getItem('exam_inf') || '5', 10);
    const phys = parseInt(localStorage.getItem('exam_phys') || '5', 10);
    const rus = parseInt(localStorage.getItem('exam_rus') || '5', 10);
    const avgGrade = (math + inf + phys + rus) / 4;
    return { math, inf, phys, rus, avgGrade, predictedOge: Math.round(avgGrade * 6.5), predictedEge: Math.round(avgGrade * 17) };
  }

  function calculateMatch(school) {
    const userStack = getSavedStack();
    const exam = calculateExamForecast();

    let matchedTech = 0;
    school.requiredTech.forEach(tech => {
      if (userStack.includes(tech)) matchedTech++;
    });
    if (matchedTech > 3) matchedTech = 3;

    const olymp = getSavedOlympiads();
    const hasAchievements = olymp.length > 0;
    const examDelta = exam.predictedOge - school.minScore;

    if (wasmCalculateMatch) {
      const rawScore = wasmCalculateMatch(matchedTech, hasAchievements ? 1 : 0, examDelta, 1);
      return Math.max(45, Math.min(rawScore, 99));
    }
    const score = 55 + (matchedTech * 12) + (hasAchievements ? 10 : 0) + (examDelta * 2);
    return Math.max(45, Math.min(score, 99));
  }

  function safeDownloadText(filename, textContent) {
    try {
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      showTextModal(filename, textContent);
    }
  }

  function showTextModal(title, text) {
    let modal = document.getElementById('text-preview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'text-preview-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
      modal.innerHTML = `
        <div style="background:#131c2e;border:1px solid #2a3b5c;border-radius:12px;width:100%;max-width:540px;padding:20px;display:flex;flex-direction:column;gap:12px;color:#fff;">
          <h3 id="modal-doc-title" style="margin:0;font-size:16px;"></h3>
          <p style="font-size:12px;color:#8ba3c7;margin:0;">Файл готов к копированию:</p>
          <textarea id="modal-doc-text" readonly style="width:100%;height:260px;background:#0a0f1d;color:#e2ecfc;border:1px solid #1f2d47;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;resize:none;"></textarea>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button id="modal-copy-btn" class="btn" style="background:#3b82f6;color:#fff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">Скопировать весь текст</button>
            <button id="modal-close-btn" class="btn" style="background:#1f2d47;color:#8ba3c7;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">Закрыть</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('modal-close-btn').onclick = () => modal.style.display = 'none';
      document.getElementById('modal-copy-btn').onclick = () => {
        const ta = document.getElementById('modal-doc-text');
        ta.select();
        navigator.clipboard.writeText(ta.value);
        const b = document.getElementById('modal-copy-btn');
        b.innerText = 'Скопировано!';
        setTimeout(() => b.innerText = 'Скопировать весь текст', 2000);
      };
    }
    document.getElementById('modal-doc-title').innerText = title;
    document.getElementById('modal-doc-text').value = text;
    modal.style.display = 'flex';
  }

  // Экспорт портфолио без разделительных линий (решеток и полос)
  function exportPurePortfolio() {
    const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
    const grade = localStorage.getItem('portfolio_grade') || '8 «Д»';
    const school = localStorage.getItem('portfolio_school') || 'ГБОУ Школа № 1580';
    const about = localStorage.getItem('portfolio_about') || 'Сборка и пайка радиоэлектронных плат, разработка проектов на C++ и 3D-печать узлов механизмов.';
    const track = localStorage.getItem('portfolio_track_v2') || 'eng';

    const trackNames = {
      eng: "Инженерия, физика, роботы и микроэлектроника",
      it: "IT-разработка, системное и прикладное программирование",
      biz: "Бизнес, финансы, предпринимательство и менеджмент",
      craft: "Прикладные технологии, 3D-моделирование, станки и работа руками",
      science: "Фундаментальная математика и академические науки"
    };

    const stageNames = { school: "Школьный этап", municipal: "Муниципальный этап", regional: "Региональный этап", final: "Заключительный этап" };
    const statusNames = { winner: "Победитель", prizewinner: "Призер", participant: "Участник" };

    const stack = getSavedStack();
    const olympiads = getSavedOlympiads();

    let text = `ОФИЦИАЛЬНОЕ ПОРТФОЛИО УЧЕНИКА\n\n`;
    text += `ОБЩИЕ СВЕДЕНИЯ\n`;
    text += `ФИО: ${name}\n`;
    text += `Класс: ${grade}\n`;
    text += `Учебное заведение: ${school}\n`;
    text += `Выбранное направление: ${trackNames[track] || track}\n\n`;

    text += `КОМПЕТЕНЦИИ И ТЕХНОЛОГИЧЕСКИЙ СТЕК\n`;
    text += stack.join(', ') + `\n\n`;

    text += `ОЛИМПИАДНЫЕ И КОНКУРСНЫЕ ДОСТИЖЕНИЯ\n`;
    olympiads.forEach((olymp, idx) => {
      text += `${idx + 1}. Мероприятие: ${olymp.name}\n`;
      text += `   Профиль / Предмет: ${olymp.subject}\n`;
      text += `   Этап: ${stageNames[olymp.stage] || olymp.stage}\n`;
      text += `   Результат: ${statusNames[olymp.status] || olymp.status}\n`;
    });
    text += `\n`;

    text += `ПРОЕКТНЫЙ ОПЫТ И ЦЕЛИ\n`;
    text += `${about}\n\n`;
    text += `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}\n`;

    safeDownloadText(`Портфолио_${name.replace(/\s+/g, '_')}.txt`, text);
  }

  // Экспорт аналитического отчета без разделительных линий
  function exportAdmissionReport() {
    const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
    const exam = calculateExamForecast();
    const ranked = schoolsData
      .map(s => ({ ...s, score: calculateMatch(s) }))
      .sort((a, b) => b.score - a.score);

    let text = `АНАЛИТИЧЕСКИЙ ОТЧЕТ: НАВИГАТОР ПОСТУПЛЕНИЯ\n\n`;
    text += `Кандидат: ${name}\n`;
    text += `Прогноз баллов ОГЭ: ~${exam.predictedOge}\n`;
    text += `Прогноз эквивалента ЕГЭ: ~${exam.predictedEge}\n\n`;
    text += `РЕЗУЛЬТАТЫ РАСЧЕТА СОВМЕСТИМОСТИ СО ШКОЛАМИ И КОЛЛЕДЖАМИ:\n\n`;

    ranked.forEach((s, idx) => {
      text += `${idx + 1}. ${s.name}\n`;
      text += `   Направление: ${s.profile}\n`;
      text += `   Совместимость по профилю: ${s.score}%\n`;
      text += `   Проходной порог: ${s.minScore} б.\n`;
      text += `   Ключевые предметы и стек: ${s.requiredTech.join(', ')}\n\n`;
    });

    text += `Дата составления: ${new Date().toLocaleDateString('ru-RU')}\n`;
    safeDownloadText(`Навигатор_Поступления_${name.replace(/\s+/g, '_')}.txt`, text);
  }

  function drawRadarChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) - 34;

    const axes = [
      { label: "Инженерия", val: 0.9 },
      { label: "Бизнес/Управл.", val: 0.5 },
      { label: "Мастерство/CAD", val: 0.8 },
      { label: "IT / Код", val: 0.85 },
      { label: "Математика", val: 0.75 }
    ];

    const numAxes = axes.length;
    const angleStep = (Math.PI * 2) / numAxes;

    for (let level = 1; level <= 4; level++) {
      const r = (maxRadius / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.stroke();
    }

    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const lx = centerX + (maxRadius + 20) * Math.cos(angle);
      const ly = centerY + (maxRadius + 20) * Math.sin(angle) + 4;
      ctx.fillText(axes[i].label, lx, ly);
    }

    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = maxRadius * axes[i].val;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.35)";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function renderTab(tabIndex) {
    buttons.forEach((b, idx) => b.classList.toggle('active', idx.toString() === tabIndex));

    if (tabIndex === '0') {
      contentCard.innerHTML = `
        <h2>Профориентационный тест: Выбор профиля</h2>
        <p style="color:#8ba3c7;margin-bottom:16px;">Ответьте на вопросы для точного подбора учебных заведений:</p>
        
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;margin-bottom:6px;font-weight:600;">1. Какая сфера деятельности привлекает больше всего?</label>
            <select id="q1" class="form-select" style="width:100%;padding:10px;border-radius:8px;background:#0d1527;color:#fff;border:1px solid #1f2d47;">
              <option value="eng">Инженерия, роботы, конструирование и схемотехника</option>
              <option value="it">Программирование, веб-разработка, искусственный интеллект</option>
              <option value="biz">Менеджмент, финансы, запуск стартапов и бизнес</option>
              <option value="craft">CAD-моделирование, прототипирование, работа с материалами</option>
              <option value="science">Фундаментальные науки, олимпиадная физика и математика</option>
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:6px;font-weight:600;">2. Формат проектной работы:</label>
            <select id="q2" class="form-select" style="width:100%;padding:10px;border-radius:8px;background:#0d1527;color:#fff;border:1px solid #1f2d47;">
              <option value="eng">Физический стенд, робот или печатная плата с прошивкой</option>
              <option value="it">Компьютерная программа, веб-сервис или приложение</option>
              <option value="biz">Бизнес-план, оценка окупаемости и защита перед жюри</option>
              <option value="craft">Чертежи, детали для 3D-печати и фрезеровки</option>
              <option value="science">Исследовательская статья с доказательствами теорем</option>
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:6px;font-weight:600;">3. Любимый предмет в школе:</label>
            <select id="q3" class="form-select" style="width:100%;padding:10px;border-radius:8px;background:#0d1527;color:#fff;border:1px solid #1f2d47;">
              <option value="eng">Физика и робототехника</option>
              <option value="it">Информатика</option>
              <option value="biz">Обществознание / экономика</option>
              <option value="craft">Технология и черчение</option>
              <option value="science">Алгебра и геометрия</option>
            </select>
          </div>

          <button id="save-test-btn" class="btn" style="background:#2563eb;color:#fff;padding:12px;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;">
            Сохранить профиль и продолжить
          </button>
          <span id="test-status" style="display:none;color:#10b981;font-size:14px;text-align:center;">Профиль обновлен! Переход к анкете...</span>
        </div>
      `;

      document.getElementById('save-test-btn').onclick = () => {
        const q1 = document.getElementById('q1').value;
        localStorage.setItem('portfolio_track_v2', q1);
        const s = document.getElementById('test-status');
        s.style.display = 'block';
        setTimeout(() => renderTab('1'), 600);
      };

    } else if (tabIndex === '1') {
      let currentOlympiads = getSavedOlympiads();
      let currentStack = getSavedStack();

      const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
      const grade = localStorage.getItem('portfolio_grade') || '8 «Д»';
      const school = localStorage.getItem('portfolio_school') || 'ГБОУ Школа № 1580 (инженерный класс)';
      const about = localStorage.getItem('portfolio_about') || 'Сборка и пайка радиоэлектронных плат, разработка проектов на C++ и 3D-печать узлов механизмов.';

      contentCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <h2 style="margin:0;">Анкета, Олимпиады и Портфолио</h2>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:flex;gap:12px;">
            <div style="flex:2;">
              <label style="font-size:12px;color:#8ba3c7;display:block;margin-bottom:4px;">ФИО</label>
              <input type="text" id="input-name" value="${name}" style="width:100%;padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;">
            </div>
            <div style="flex:1;">
              <label style="font-size:12px;color:#8ba3c7;display:block;margin-bottom:4px;">Класс</label>
              <input type="text" id="input-grade" value="${grade}" style="width:100%;padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;">
            </div>
          </div>

          <div>
            <label style="font-size:12px;color:#8ba3c7;display:block;margin-bottom:4px;">Где учились / курсы / кружки</label>
            <input type="text" id="input-school" value="${school}" style="width:100%;padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;">
          </div>

          <div>
            <label style="font-size:12px;color:#8ba3c7;display:block;margin-bottom:4px;">О себе, увлечения и цели</label>
            <textarea id="input-about" rows="3" style="width:100%;padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;resize:vertical;">${about}</textarea>
          </div>

          <!-- ДИНАМИЧЕСКИЙ БЛОК ОЛИМПИАД С ВЫПАДАЮЩИМИ СПИСКАМИ -->
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <label style="font-size:13px;font-weight:600;color:#e2ecfc;">Олимпиады, Конкурсы и Достижения</label>
              <button id="add-olymp-btn" type="button" style="background:#2563eb;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600;">+ Добавить олимпиаду</button>
            </div>
            <div id="olympiads-container" style="display:flex;flex-direction:column;gap:10px;"></div>
          </div>

          <!-- НАВЫКИ И ПРОФЕССИОНАЛЬНЫЕ ДИСЦИПЛИНЫ -->
          <div>
            <label style="font-size:12px;color:#8ba3c7;display:block;margin-bottom:6px;">Компетенции, навыки и профессии (выберите кликом):</label>
            <div id="chips-container" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
          </div>

          <div style="display:flex;gap:10px;margin-top:6px;">
            <button id="save-btn" class="btn" style="flex:1;background:#2563eb;color:#fff;padding:10px;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Сохранить анкету</button>
            <button id="export-pure-btn" class="btn" style="flex:1;background:#1e293b;border:1px solid #334155;color:#e2ecfc;padding:10px;border-radius:6px;cursor:pointer;">📄 Скачать портфолио</button>
            <button id="export-report-btn" class="btn" style="flex:1;background:#1e293b;border:1px solid #334155;color:#e2ecfc;padding:10px;border-radius:6px;cursor:pointer;">📊 Скачать отчет</button>
          </div>

          <div style="text-align:center;margin-top:14px;">
            <span style="font-size:13px;font-weight:600;color:#8ba3c7;">Карта компетенций</span>
            <div style="display:flex;justify-content:center;margin-top:8px;">
              <canvas id="skills-radar" width="300" height="260"></canvas>
            </div>
          </div>
        </div>
      `;

      const olympContainer = document.getElementById('olympiads-container');
      function renderOlympiadRows() {
        olympContainer.innerHTML = '';
        currentOlympiads.forEach((item, index) => {
          const row = document.createElement('div');
          row.style.cssText = 'background:rgba(15,23,42,0.7);border:1px solid #1f2d47;padding:12px;border-radius:8px;display:flex;flex-direction:column;gap:8px;';

          row.innerHTML = `
            <div style="display:flex;gap:8px;align-items:center;">
              <div style="flex:1;">
                <label style="font-size:11px;color:#8ba3c7;">Мероприятие / Олимпиада</label>
                <select class="olymp-name-select" data-index="${index}" style="width:100%;padding:8px;background:#090d16;color:#fff;border:1px solid #2a3b5c;border-radius:6px;font-size:13px;">
                  ${olympiadList.map(o => `<option value="${o}" ${item.name === o ? 'selected' : ''}>${o}</option>`).join('')}
                </select>
              </div>
              <button type="button" class="del-olymp-btn" data-index="${index}" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:18px;margin-top:16px;" title="Удалить">✕</button>
            </div>

            <div style="display:flex;gap:8px;">
              <div style="flex:1.5;">
                <label style="font-size:11px;color:#8ba3c7;">Профиль / Предмет</label>
                <select class="olymp-subject-select" data-index="${index}" style="width:100%;padding:8px;background:#090d16;color:#fff;border:1px solid #2a3b5c;border-radius:6px;font-size:13px;">
                  ${subjectList.map(s => `<option value="${s}" ${item.subject === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
              <div style="flex:1;">
                <label style="font-size:11px;color:#8ba3c7;">Этап</label>
                <select class="olymp-stage-select" data-index="${index}" style="width:100%;padding:8px;background:#090d16;color:#fff;border:1px solid #2a3b5c;border-radius:6px;font-size:13px;">
                  <option value="school" ${item.stage === 'school' ? 'selected' : ''}>Школьный</option>
                  <option value="municipal" ${item.stage === 'municipal' ? 'selected' : ''}>Муниципальный</option>
                  <option value="regional" ${item.stage === 'regional' ? 'selected' : ''}>Региональный</option>
                  <option value="final" ${item.stage === 'final' ? 'selected' : ''}>Заключительный</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="font-size:11px;color:#8ba3c7;">Результат</label>
                <select class="olymp-status-select" data-index="${index}" style="width:100%;padding:8px;background:#090d16;color:#fff;border:1px solid #2a3b5c;border-radius:6px;font-size:13px;">
                  <option value="winner" ${item.status === 'winner' ? 'selected' : ''}>Победитель</option>
                  <option value="prizewinner" ${item.status === 'prizewinner' ? 'selected' : ''}>Призер</option>
                  <option value="participant" ${item.status === 'participant' ? 'selected' : ''}>Участник</option>
                </select>
              </div>
            </div>
          `;
          olympContainer.appendChild(row);
        });

        olympContainer.querySelectorAll('.olymp-name-select').forEach(sel => {
          sel.onchange = (e) => currentOlympiads[e.target.dataset.index].name = e.target.value;
        });
        olympContainer.querySelectorAll('.olymp-subject-select').forEach(sel => {
          sel.onchange = (e) => currentOlympiads[e.target.dataset.index].subject = e.target.value;
        });
        olympContainer.querySelectorAll('.olymp-stage-select').forEach(sel => {
          sel.onchange = (e) => currentOlympiads[e.target.dataset.index].stage = e.target.value;
        });
        olympContainer.querySelectorAll('.olymp-status-select').forEach(sel => {
          sel.onchange = (e) => currentOlympiads[e.target.dataset.index].status = e.target.value;
        });
        olympContainer.querySelectorAll('.del-olymp-btn').forEach(btn => {
          btn.onclick = (e) => {
            currentOlympiads.splice(parseInt(e.target.dataset.index, 10), 1);
            renderOlympiadRows();
          };
        });
      }

      renderOlympiadRows();

      document.getElementById('add-olymp-btn').onclick = () => {
        currentOlympiads.push({
          name: olympiadList[0],
          subject: subjectList[0],
          stage: "school",
          status: "participant"
        });
        renderOlympiadRows();
      };

      const chipsContainer = document.getElementById('chips-container');
      function renderChips() {
        chipsContainer.innerHTML = '';
        availableTech.forEach(tech => {
          const chip = document.createElement('button');
          chip.type = 'button';
          const isSelected = currentStack.includes(tech);
          chip.textContent = `${isSelected ? '✓ ' : '+ '} ${tech}`;
          chip.style.cssText = `
            padding: 5px 10px; font-size: 12px; border-radius: 20px;
            border: 1px solid ${isSelected ? '#3b82f6' : '#2a3b5c'};
            background: ${isSelected ? '#1d4ed8' : '#0f172a'};
            color: ${isSelected ? '#fff' : '#94a3b8'}; cursor: pointer;
          `;
          chip.onclick = () => {
            if (currentStack.includes(tech)) {
              currentStack = currentStack.filter(t => t !== tech);
            } else {
              currentStack.push(tech);
            }
            localStorage.setItem('portfolio_stack_v2', JSON.stringify(currentStack));
            renderChips();
            drawRadarChart('skills-radar');
          };
          chipsContainer.appendChild(chip);
        });
      }
      renderChips();
      drawRadarChart('skills-radar');

      document.getElementById('save-btn').onclick = () => {
        localStorage.setItem('portfolio_name', document.getElementById('input-name').value);
        localStorage.setItem('portfolio_grade', document.getElementById('input-grade').value);
        localStorage.setItem('portfolio_school', document.getElementById('input-school').value);
        localStorage.setItem('portfolio_about', document.getElementById('input-about').value);
        localStorage.setItem('portfolio_olympiads_v2', JSON.stringify(currentOlympiads));
        localStorage.setItem('portfolio_stack_v2', JSON.stringify(currentStack));
        alert('Данные успешно сохранены!');
      };

      document.getElementById('export-pure-btn').onclick = exportPurePortfolio;
      document.getElementById('export-report-btn').onclick = exportAdmissionReport;

    } else if (tabIndex === '2') {
      const userStack = getSavedStack();
      contentCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h2 style="margin:0;">Навигатор профильных школ и колледжей</h2>
          <span style="font-size:11px;padding:3px 8px;border-radius:12px;background:#1e293b;color:#10b981;">
            ${wasmActive ? '✓ WASM C++ активен' : 'JS Режим'}
          </span>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input type="text" id="school-search" placeholder="Поиск (Бауманская, 1580, ВШЭ...)" style="flex:1;padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;font-size:13px;">
          <select id="school-filter" style="padding:8px 12px;background:#0d1527;color:#fff;border:1px solid #1f2d47;border-radius:6px;font-size:13px;">
            <option value="all">Все направления</option>
            <option value="eng">Инженерия</option>
            <option value="biz">Бизнес и соцэк</option>
            <option value="craft">Прикладные технологии</option>
            <option value="it">IT и разработка</option>
          </select>
        </div>

        <div id="schools-list" style="display:flex;flex-direction:column;gap:10px;"></div>
      `;

      const listContainer = document.getElementById('schools-list');
      const searchInput = document.getElementById('school-search');
      const filterSelect = document.getElementById('school-filter');

      function renderSchools() {
        const query = searchInput.value.toLowerCase();
        const filter = filterSelect.value;
        listContainer.innerHTML = '';

        const ranked = schoolsData
          .map(s => ({ ...s, matchScore: calculateMatch(s) }))
          .filter(s => {
            const matchesFilter = filter === 'all' || 
              (filter === 'eng' && s.profile.includes('Инженер')) || 
              (filter === 'biz' && s.profile.includes('бизнес')) || 
              (filter === 'craft' && s.profile.includes('Прикладные')) ||
              (filter === 'it' && s.profile.includes('IT'));
            const matchesQuery = s.name.toLowerCase().includes(query) || s.profile.toLowerCase().includes(query);
            return matchesFilter && matchesQuery;
          })
          .sort((a, b) => b.matchScore - a.matchScore);

        ranked.forEach(school => {
          const card = document.createElement('div');
          card.style.cssText = 'background:rgba(15,23,42,0.6);border:1px solid #1f2d47;border-radius:8px;padding:12px;display:flex;align-items:center;justify-content:space-between;';

          const badges = school.requiredTech.map(t => {
            const m = userStack.includes(t);
            return `<span style="display:inline-block;padding:2px 6px;margin:2px;font-size:10px;border-radius:4px;background:${m ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'};color:${m ? '#60a5fa' : '#64748b'};">${t}</span>`;
          }).join('');

          card.innerHTML = `
            <div style="flex:1;">
              <h3 style="margin:0 0 4px;font-size:14px;color:#f0f4f8;">${school.name}</h3>
              <p style="margin:0 0 6px;font-size:12px;color:#38bdf8;">${school.profile} • Порог: ${school.minScore} б.</p>
              <div>${badges}</div>
            </div>
            <div style="min-width:65px;text-align:right;">
              <div style="font-size:18px;font-weight:700;color:#10b981;">${school.matchScore}%</div>
              <div style="font-size:10px;color:#64748b;">Совместимость</div>
            </div>
          `;
          listContainer.appendChild(card);
        });
      }

      searchInput.oninput = renderSchools;
      filterSelect.onchange = renderSchools;
      renderSchools();
    }
  }

  buttons.forEach((btn, idx) => {
    btn.onclick = () => renderTab(idx.toString());
  });

  renderTab('1');
});
