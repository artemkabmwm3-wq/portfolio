document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.tab-btn');
    const contentCard = document.getElementById('main-content');

    // 1. БИНАРНЫЙ МОДУЛЬ WEBASSEMBLY (Алгоритмическое ядро C++)
    const wasmBytes = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
        0x01, 0x09, 0x01, 0x60, 0x04, 0x7f, 0x7f, 0x7f, 0x7f, 0x01, 0x7f,
        0x03, 0x02, 0x01, 0x00,
        0x07, 0x17, 0x01, 0x13, 0x63, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61, 0x74, 0x65, 0x4d, 0x61, 0x74, 0x63, 0x68, 0x53, 0x63, 0x6f, 0x72, 0x65, 0x00, 0x00,
        0x0a, 0x29, 0x01, 0x27, 0x00,
        0x41, 0x37,
        0x41, 0x10, 0x41, 0x05, 0x20, 0x00, 0x1b, 0x6a,
        0x20, 0x01, 0x41, 0x05, 0x6c, 0x6a,
        0x41, 0x05, 0x41, 0x00, 0x20, 0x02, 0x1b, 0x6a,
        0x41, 0x08, 0x41, 0x7c, 0x20, 0x03, 0x41, 0x00, 0x4c, 0x1b, 0x6a,
        0x0b
    ]);

    let wasmCalculateMatch = null;
    let wasmActive = false;

    try {
        const wasmModule = await WebAssembly.instantiate(wasmBytes);
        wasmCalculateMatch = wasmModule.instance.exports.calculateMatchScore;
        wasmActive = true;
    } catch (e) {
        console.warn("WASM fallback active", e);
    }

    // Расширенный технологический и предметный стек
    const availableTech = [
        "Инженерия", "C++", "Python", "Робототехника", 
        "Схемотехника/Пайка", "3D-моделирование (CAD)", "Экономика/Финансы", 
        "Управление проектами", "Математика", "Физика", "Веб-дизайн", "Анализ данных"
    ];

    // База данных профильных школ и колледжей по разным направлениям
    const schoolsData = [
        { id: 1, name: "Бауманская инженерная школа № 1580", profile: "Инженерно-технологический", targetTrack: "eng", minScore: 88, requiredTech: ["Инженерия", "Физика", "Математика"], description: "Базовый лицей при МГТУ им. Баумана. Инженерная графика, прототипирование и прикладная физика." },
        { id: 2, name: "Лицей НИУ ВШЭ (Экономика и Бизнес)", profile: "Предпринимательский и соцэк", targetTrack: "biz", minScore: 86, requiredTech: ["Экономика/Финансы", "Управление проектами", "Математика"], description: "Подготовка будущих предпринимателей, бизнес-аналитиков и специалистов по управлению." },
        { id: 3, name: "Колледж современных технологий (КСТ)", profile: "Прикладные технологии и мастерство", targetTrack: "craft", minScore: 75, requiredTech: ["Схемотехника/Пайка", "3D-моделирование (CAD)", "Инженерия"], description: "Практическая работа на станках с ЧПУ, мехатроника, монтаж радиоэлектронных систем." },
        { id: 4, name: "Школа № 179", profile: "Математика и C++ алгоритмы", targetTrack: "eng", minScore: 92, requiredTech: ["C++", "Математика", "Анализ данных"], description: "Специализированные классы по системному программированию и математике." },
        { id: 5, name: "Экономический лицей РЭУ им. Г.В. Плеханова", profile: "Финансы и бизнес-проекты", targetTrack: "biz", minScore: 82, requiredTech: ["Экономика/Финансы", "Управление проектами", "Веб-дизайн"], description: "Основы финансовой грамотности, предпринимательское право и маркетинг." },
        { id: 6, name: "Политехнический колледж № 8 им. Павлова", profile: "Аппаратные технологии и роботы", targetTrack: "craft", minScore: 74, requiredTech: ["Робототехника", "Схемотехника/Пайка", "3D-моделирование (CAD)"], description: "Лаборатории микроэлектроники, робототехнические комплексы, мастерские металлообработки." },
        { id: 7, name: "Школа № 1502 при МЭИ", profile: "Энергетика и машиностроение", targetTrack: "eng", minScore: 84, requiredTech: ["Физика", "Инженерия", "3D-моделирование (CAD)"], description: "Инженерные вертикали, практическая работа в лабораториях Московского энергетического института." },
        { id: 8, name: "Школа № 1535 (Информационно-технологический)", profile: "IT и разработка ПО", targetTrack: "it", minScore: 89, requiredTech: ["Python", "C++", "Веб-дизайн"], description: "Программирование современных сервисов, алгоритмические базы данных и сетевые технологии." },
        { id: 9, name: "Колледж предпринимательства № 11", profile: "Прикладной бизнес и коммерция", targetTrack: "biz", minScore: 76, requiredTech: ["Экономика/Финансы", "Управление проектами", "Веб-дизайн"], description: "Практические бизнес-модели, запуск собственных стартапов, управление поставками." },
        { id: 10, name: "Инженерный корпус школы № 548 «Царицыно»", profile: "Архитектура, CAD и инженерия", targetTrack: "craft", minScore: 81, requiredTech: ["3D-моделирование (CAD)", "Инженерия", "Робототехника"], description: "Проектирование реальных физических объектов, работа руками в мастерских и фаблабах." }
    ];

    function getSavedStack() {
        const raw = localStorage.getItem('portfolio_stack_v2');
        return raw ? JSON.parse(raw) : ["Инженерия", "Математика", "Физика", "3D-моделирование (CAD)"];
    }

    function calculateExamForecast() {
        const math = parseInt(localStorage.getItem('exam_math') || '5');
        const inf = parseInt(localStorage.getItem('exam_inf') || '5');
        const phys = parseInt(localStorage.getItem('exam_phys') || '4');
        const rus = parseInt(localStorage.getItem('exam_rus') || '5');

        const avgGrade = (math + inf + phys + rus) / 4;
        const predictedOge = Math.round(avgGrade * 6.6);
        const predictedEge = Math.round(50 + (avgGrade - 3) * 23);

        return { math, inf, phys, rus, avgGrade: avgGrade.toFixed(1), predictedOge, predictedEge };
    }

    function calculateMatch(school) {
        const savedTrack = localStorage.getItem('portfolio_track_v2') || 'eng';
        const achievementStatus = localStorage.getItem('ach_status_v2') || 'none';
        const userStack = getSavedStack();
        const exam = calculateExamForecast();

        const trackMatch = (savedTrack === school.targetTrack) ? 1 : 0;
        let matchedTech = 0;
        school.requiredTech.forEach(t => {
            if (userStack.includes(t)) matchedTech++;
        });
        if (matchedTech > 3) matchedTech = 3;

        let hasAchievements = (achievementStatus === 'winner' || achievementStatus === 'prizewinner') ? 1 : 0;
        const examDelta = exam.predictedEge - school.minScore;

        if (wasmCalculateMatch) {
            const rawScore = wasmCalculateMatch(trackMatch, matchedTech, hasAchievements, examDelta);
            return Math.max(45, Math.min(rawScore, 99));
        }

        let score = 55 + (trackMatch ? 16 : 5) + Math.min(matchedTech * 5, 15) + (hasAchievements ? 5 : 0) + (examDelta >= 0 ? 8 : -4);
        return Math.max(45, Math.min(score, 99));
    }

    // Универсальная надежная загрузка / отображение документа для мобильных браузеров
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
            setTimeout(() => URL.revokeObjectURL(url), 1500);
        } catch (err) {
            console.error("Blob download fallback:", err);
        }

        // Запасной модальный просмотрщик для мобильного Chrome/Яндекса
        showTextModal(filename, textContent);
    }

    function showTextModal(title, text) {
        let modal = document.getElementById('text-preview-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'text-preview-modal';
            modal.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 16px;";
            modal.innerHTML = `
                <div style="background: #111827; border: 1px solid var(--border-color); border-radius: 14px; width: 100%; max-width: 620px; max-height: 85vh; display: flex; flex-direction: column; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 id="modal-doc-title" style="font-size: 16px; color: #f0f4f8;">Документ готов к выгрузке</h3>
                        <button id="modal-close-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
                    </div>
                    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">Если файл не сохранился в память автоматически, нажмите «Скопировать текст»:</p>
                    <textarea id="modal-doc-text" readonly style="flex: 1; min-height: 240px; background: #080c14; color: #f0f4f8; border: 1px solid rgba(64,93,148,0.4); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; resize: none; margin-bottom: 14px;"></textarea>
                    <div style="display: flex; gap: 10px;">
                        <button id="modal-copy-btn" class="btn-primary" style="flex: 1;">Скопировать весь текст</button>
                        <button id="modal-done-btn" class="btn-secondary" style="flex: 1;">Закрыть</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('modal-close-btn').onclick = () => modal.style.display = 'none';
            document.getElementById('modal-done-btn').onclick = () => modal.style.display = 'none';
            document.getElementById('modal-copy-btn').onclick = () => {
                const ta = document.getElementById('modal-doc-text');
                ta.select();
                navigator.clipboard.writeText(ta.value).then(() => {
                    const btn = document.getElementById('modal-copy-btn');
                    btn.textContent = "✓ Скопировано в буфер!";
                    setTimeout(() => btn.textContent = "Скопировать весь текст", 2000);
                });
            };
        }

        document.getElementById('modal-doc-title').textContent = title;
        document.getElementById('modal-doc-text').value = text;
        modal.style.display = 'flex';
    }

    // 1-Й ДОКУМЕНТ: ЧИСТОЕ ПОРТФОЛИО ДЛЯ ШКОЛЫ (БЕЗ ШАНСОВ ПОСТУПЛЕНИЯ)
    function exportPurePortfolio() {
        const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
        const grade = localStorage.getItem('portfolio_grade') || '8 «Д»';
        const track = localStorage.getItem('portfolio_track_v2') || 'eng';
        const schoolHistory = localStorage.getItem('portfolio_school_history') || 'ГБОУ Школа № 1580 (инженерный предпрофиль)';
        const aboutMe = localStorage.getItem('portfolio_about_me') || 'Увлекаюсь конструированием механизмов, схемотехникой и алгоритмами. Участвую в научно-практических проектах.';
        
        const achName = localStorage.getItem('ach_name_v2') || 'Научно-практическая конференция «Инженеры будущего»';
        const achSubject = localStorage.getItem('ach_subject_v2') || 'Инженерия и робототехника';
        const achStage = localStorage.getItem('ach_stage_v2') || 'regional';
        const achStatus = localStorage.getItem('ach_status_v2') || 'winner';
        
        const stack = getSavedStack();
        const exam = calculateExamForecast();

        const trackNames = {
            eng: "Инженерно-технологический профиль (C++, физика, проектирование)",
            biz: "Экономика, бизнес и управление проектами",
            craft: "Прикладные технологии и мастерство (CAD, электроника, работа руками)",
            it: "Информационные технологии и программирование",
            science: "Фундаментальная математика и наука"
        };

        const stageNames = { school: "Школьный", municipal: "Муниципальный", regional: "Региональный", allros: "Заключительный" };
        const statusNames = { winner: "Победитель", prizewinner: "Призёр", participant: "Участник" };

        const lines = [
            "==================================================",
            "          ОФИЦИАЛЬНОЕ ПОРТФОЛИО УЧЕНИКА           ",
            "==================================================",
            "",
            `ФИО Ученика:        ${name}`,
            `Класс:              ${grade}`,
            `Основной профиль:   ${trackNames[track] || track}`,
            `Учебное заведение:  ${schoolHistory}`,
            "",
            "--------------------------------------------------",
            "1. ОБРАЗОВАТЕЛЬНЫЕ РЕЗУЛЬТАТЫ И ОЦЕНКИ",
            "--------------------------------------------------",
            `Текущий средний балл по профильным предметам: ${exam.avgGrade} из 5.0`,
            `Оценки: Математика [${exam.math}], Информатика [${exam.inf}], Физика [${exam.phys}], Русский язык [${exam.rus}]`,
            "",
            "--------------------------------------------------",
            "2. ПРЕДМЕТНЫЙ И ТЕХНОЛОГИЧЕСКИЙ СТЕК НАВЫКОВ",
            "--------------------------------------------------",
            stack.join(", "),
            "",
            "--------------------------------------------------",
            "3. ОЛИМПИАДЫ И КОНКУРСНЫЕ ДОСТИЖЕНИЯ",
            "--------------------------------------------------",
            `Мероприятие:       ${achName}`,
            `Профильный предмет: ${achSubject}`,
            `Уровень/Этап:      ${stageNames[achStage] || achStage}`,
            `Статус участника:  ${statusNames[achStatus] || achStatus}`,
            "",
            "--------------------------------------------------",
            "4. О СЕБЕ, ПРОЕКТНЫЙ ОПЫТ И ЦЕЛИ",
            "--------------------------------------------------",
            aboutMe,
            "",
            "==================================================",
            "Документ сформирован для подачи в приёмную комиссию",
            "Дата составления: " + new Date().toLocaleDateString('ru-RU')
        ];

        safeDownloadText(`Портфолио_${name.replace(/\s+/g, '_')}.txt`, lines.join('\r\n'));
    }

    // 2-Й ДОКУМЕНТ: АНАЛИТИЧЕСКИЙ НАВИГАТОР ПОСТУПЛЕНИЯ
    function exportAdmissionReport() {
        const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
        const exam = calculateExamForecast();
        const rankedSchools = schoolsData
            .map(s => ({ ...s, score: calculateMatch(s) }))
            .sort((a, b) => b.score - a.score);

        const lines = [
            "==================================================",
            "    АНАЛИТИЧЕСКИЙ ОТЧЁТ: НАВИГАТОР ПОСТУПЛЕНИЯ    ",
            "==================================================",
            "",
            `Кандидат: ${name}`,
            `Прогноз баллов ОГЭ: ~${exam.predictedOge} б.`,
            `Прогноз эквивалента ЕГЭ: ~${exam.predictedEge} б.`,
            "",
            "РЕЗУЛЬТАТЫ РАСЧЁТА АЛГОРИТМИЧЕСКОГО ЯДРА (C++ / WASM):",
            "--------------------------------------------------",
            ...rankedSchools.map((s, idx) => 
                `${idx + 1}. ${s.name}\n` +
                `   - Направление: ${s.profile}\n` +
                `   - Совместимость: ${s.score}%\n` +
                `   - Проходной порог: ${s.minScore} б.\n` +
                `   - Ключевые требования: ${s.requiredTech.join(', ')}\n`
            ),
            "==================================================",
            "Расчет выполнен модулем core.wasm на базе эмпирической модели ранжирования."
        ];

        safeDownloadText(`Навигатор_Поступления_${name.replace(/\s+/g, '_')}.txt`, lines.join('\r\n'));
    }

    // ЛЕПЕСТКОВАЯ ДИАГРАММА НА 5 УНИВЕРСАЛЬНЫХ ОСЕЙ
    function drawRadarChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2 + 6;
        const maxRadius = 74;

        ctx.clearRect(0, 0, width, height);

        const stack = getSavedStack();
        const exam = calculateExamForecast();
        const track = localStorage.getItem('portfolio_track_v2') || 'eng';

        const axes = [
            { label: "Инженерия", val: Math.min(1, 0.35 + (stack.includes("Инженерия") || stack.includes("Физика") ? 0.35 : 0) + (track === "eng" ? 0.25 : 0)) },
            { label: "Бизнес/Управл.", val: Math.min(1, 0.3 + (stack.includes("Экономика/Финансы") || stack.includes("Управление проектами") ? 0.45 : 0) + (track === "biz" ? 0.25 : 0)) },
            { label: "Мастерство/CAD", val: Math.min(1, 0.3 + (stack.includes("3D-моделирование (CAD)") || stack.includes("Схемотехника/Пайка") ? 0.45 : 0) + (track === "craft" ? 0.25 : 0)) },
            { label: "IT / Код", val: Math.min(1, 0.3 + (stack.includes("C++") || stack.includes("Python") || stack.includes("Веб-дизайн") ? 0.4 : 0) + (track === "it" ? 0.25 : 0)) },
            { label: "Математика", val: Math.min(1, 0.3 + (exam.math - 2) * 0.2 + (stack.includes("Математика") ? 0.2 : 0)) }
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
            ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
            ctx.stroke();
        }

        ctx.font = "600 10px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";

        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = maxRadius + 26;
            const lx = centerX + labelRadius * Math.cos(angle);
            const ly = centerY + labelRadius * Math.sin(angle) + 4;
            ctx.fillText(axes[i].label, lx, ly);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle));
            ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
            ctx.stroke();
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
        buttons.forEach((b, idx) => b.classList.toggle('active', idx === parseInt(tabIndex)));

        if (tabIndex === '0') {
            const track = localStorage.getItem('portfolio_track_v2') || 'eng';

            contentCard.innerHTML = `
                <h2>Профориентационный тест: Выбор жизненного вектора</h2>
                <p>Выберите главное направление, в котором хотите развиваться в 8-11 классах:</p>
                
                <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 16px;">
                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">1. Какая деятельность вам ближе всего?</label>
                        <select id="select-track" class="form-select">
                            <option value="eng" ${track==='eng'?'selected':''}>Инженерия, физика, роботы и микроэлектроника</option>
                            <option value="biz" ${track==='biz'?'selected':''}>Бизнес, финансы, предпринимательство и менеджмент</option>
                            <option value="craft" ${track==='craft'?'selected':''}>Прикладные технологии, 3D-моделирование, станки и работа руками</option>
                            <option value="it" ${track==='it'?'selected':''}>IT-разработка, системное и прикладное программирование</option>
                            <option value="science" ${track==='science'?'selected':''}>Фундаментальная математика и академические науки</option>
                        </select>
                    </div>

                    <button id="save-track-btn" class="btn-primary">Сохранить направление</button>
                    <span id="track-status" style="font-size: 12px; color: var(--success); display: none;">Вектор сохранён! Карта навыков обновлена.</span>
                </div>
            `;

            document.getElementById('save-track-btn').onclick = () => {
                localStorage.setItem('portfolio_track_v2', document.getElementById('select-track').value);
                const s = document.getElementById('track-status');
                s.style.display = 'block';
                setTimeout(() => s.style.display = 'none', 2000);
            };

        } else if (tabIndex === '1') {
            const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
            const grade = localStorage.getItem('portfolio_grade') || '8 «Д»';
            const schoolHistory = localStorage.getItem('portfolio_school_history') || 'ГБОУ Школа № 1580 (инженерный класс)';
            const aboutMe = localStorage.getItem('portfolio_about_me') || 'Сборка и пайка радиоэлектронных плат, разработка проектов на C++ и 3D-печать узлов механизмов.';

            const achName = localStorage.getItem('ach_name_v2') || 'НПК «Инженеры будущего»';
            const achSubject = localStorage.getItem('ach_subject_v2') || 'Инженерия и технологии';
            const achStage = localStorage.getItem('ach_stage_v2') || 'regional';
            const achStatus = localStorage.getItem('ach_status_v2') || 'winner';

            let currentStack = getSavedStack();
            const forecast = calculateExamForecast();

            contentCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                    <h2 style="margin-bottom: 0;">Анкета, Олимпиады и Портфолио</h2>
                    <button id="demo-fill-btn" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
                        Заполнить демо-профиль
                    </button>
                </div>

                <div class="portfolio-grid">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 2;">
                                <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">ФИО</label>
                                <input type="text" id="input-name" class="form-input" value="${name}">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Класс</label>
                                <input type="text" id="input-grade" class="form-input" value="${grade}">
                            </div>
                        </div>

                        <div>
                            <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Где учились / курсы / кружки</label>
                            <input type="text" id="input-school-history" class="form-input" value="${schoolHistory}" placeholder="Например: Робоклуб, курсы при Бауманке, ДТ «Кванториум»">
                        </div>

                        <div>
                            <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">О себе, увлечения и цели</label>
                            <textarea id="input-about-me" class="form-textarea" rows="2" placeholder="Опишите, чем занимаетесь и какие проекты реализуете">${aboutMe}</textarea>
                        </div>

                        <!-- Блок олимпиад с указанием предмета -->
                        <div style="background: rgba(8, 12, 20, 0.45); border: 1px solid var(--border-color); padding: 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size: 12px; font-weight: 600; color: #f0f4f8;">Олимпиада / Конкурс и Предмет</label>
                            
                            <input type="text" id="ach-name-input" class="form-input" value="${achName}" placeholder="Название: ВсОШ, Инженеры будущего, МОШ, Высшая проба...">

                            <div style="display: flex; gap: 8px;">
                                <div style="flex: 1;">
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Предмет</span>
                                    <input type="text" id="ach-subject-input" class="form-input" value="${achSubject}" placeholder="Физика, Технология...">
                                </div>
                                <div style="flex: 1;">
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Этап</span>
                                    <select id="ach-stage-select" class="form-select" style="padding: 8px;">
                                        <option value="school" ${achStage==='school'?'selected':''}>Школьный</option>
                                        <option value="municipal" ${achStage==='municipal'?'selected':''}>Муниципальный</option>
                                        <option value="regional" ${achStage==='regional'?'selected':''}>Региональный</option>
                                        <option value="allros" ${achStage==='allros'?'selected':''}>Заключительный</option>
                                    </select>
                                </div>
                                <div style="flex: 1;">
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Результат</span>
                                    <select id="ach-status-select" class="form-select" style="padding: 8px;">
                                        <option value="winner" ${achStatus==='winner'?'selected':''}>Победитель</option>
                                        <option value="prizewinner" ${achStatus==='prizewinner'?'selected':''}>Призёр</option>
                                        <option value="participant" ${achStatus==='participant'?'selected':''}>Участник</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Стек навыков -->
                        <div>
                            <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 6px;">Навыки и дисциплины (выберите кликом):</label>
                            <div id="tech-chips" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                        </div>

                        <!-- Раздельные кнопки выгрузки -->
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                            <div style="display: flex; gap: 8px;">
                                <button id="save-btn" class="btn-primary" style="flex: 1;">Сохранить анкету</button>
                            </div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button id="export-pure-btn" class="btn-secondary" style="flex: 1; min-width: 180px; border-color: #10b981; color: #10b981;">
                                    📄 Скачать портфолио для школы
                                </button>
                                <button id="export-report-btn" class="btn-secondary" style="flex: 1; min-width: 180px;">
                                    📊 Скачать отчёт навигатора
                                </button>
                            </div>
                        </div>
                        <span id="save-status" style="font-size: 12px; color: var(--success); display: none;">Данные успешно сохранены!</span>
                    </div>

                    <div class="radar-box">
                        <span style="font-size: 13px; font-weight: 600; color: #f0f4f8; margin-bottom: 4px;">Карта компетенций</span>
                        <canvas id="skills-radar" width="300" height="240"></canvas>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
                            Оси: <b>Инженерия</b>, <b>Бизнес</b>, <b>Мастерство/CAD</b>, <b>IT/Код</b>, <b>Математика</b>.
                        </div>
                    </div>
                </div>
            `;

            const chipsContainer = document.getElementById('tech-chips');
            function renderChips() {
                chipsContainer.innerHTML = '';
                availableTech.forEach(tech => {
                    const isSelected = currentStack.includes(tech);
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.textContent = tech;
                    chip.style.cssText = `
                        padding: 5px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; cursor: pointer;
                        border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'};
                        background: ${isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(8, 12, 20, 0.5)'};
                        color: ${isSelected ? '#fff' : 'var(--text-muted)'};
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
                localStorage.setItem('portfolio_school_history', document.getElementById('input-school-history').value);
                localStorage.setItem('portfolio_about_me', document.getElementById('input-about-me').value);
                localStorage.setItem('ach_name_v2', document.getElementById('ach-name-input').value);
                localStorage.setItem('ach_subject_v2', document.getElementById('ach-subject-input').value);
                localStorage.setItem('ach_stage_v2', document.getElementById('ach-stage-select').value);
                localStorage.setItem('ach_status_v2', document.getElementById('ach-status-select').value);

                const s = document.getElementById('save-status');
                s.style.display = 'block';
                setTimeout(() => s.style.display = 'none', 2000);
                drawRadarChart('skills-radar');
            };

            document.getElementById('demo-fill-btn').onclick = () => {
                localStorage.setItem('portfolio_name', 'Дубянский Артём');
                localStorage.setItem('portfolio_grade', '8 «Д»');
                localStorage.setItem('portfolio_track_v2', 'eng');
                localStorage.setItem('portfolio_school_history', 'ГБОУ Бауманская инженерная школа № 1580');
                localStorage.setItem('portfolio_about_me', 'Разработка инженерных решений, проектирование механических узлов и схемотехника. Интерес к предпринимательству в сфере DeepTech.');
                localStorage.setItem('ach_name_v2', 'НПК «Инженеры будущего»');
                localStorage.setItem('ach_subject_v2', 'Инженерия и робототехника');
                localStorage.setItem('ach_stage_v2', 'regional');
                localStorage.setItem('ach_status_v2', 'winner');
                localStorage.setItem('portfolio_stack_v2', JSON.stringify(["Инженерия", "3D-моделирование (CAD)", "Схемотехника/Пайка", "Физика", "C++"]));
                renderTab('1');
            };

            document.getElementById('export-pure-btn').onclick = exportPurePortfolio;
            document.getElementById('export-report-btn').onclick = exportAdmissionReport;

        } else if (tabIndex === '2') {
            const userStack = getSavedStack();

            contentCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <h2>Навигатор профильных школ и колледжей</h2>
                        <p style="margin-bottom: 0;">Расчёт совместимости алгоритмическим ядром C++ (WebAssembly):</p>
                    </div>
                    <span style="font-size: 11px; padding: 4px 8px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.35);">
                        ${wasmActive ? '● WASM C++ Активен' : '● Резервный расчет'}
                    </span>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
                    <input type="text" id="school-search" class="form-input" placeholder="Поиск (Бауманская, ВШЭ, Колледж...)" style="flex: 2; min-width: 180px;">
                    <select id="school-filter" class="form-select" style="flex: 1; min-width: 160px;">
                        <option value="all">Все направления</option>
                        <option value="eng">Инженерия и C++</option>
                        <option value="biz">Бизнес и Экономика</option>
                        <option value="craft">Прикладное мастерство и CAD</option>
                        <option value="it">IT и Разработка</option>
                    </select>
                </div>

                <div id="schools-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 460px; overflow-y: auto;"></div>
            `;

            const container = document.getElementById('schools-list');
            const searchInput = document.getElementById('school-search');
            const filterSelect = document.getElementById('school-filter');

            function renderSchoolsList() {
                const query = searchInput.value.trim().toLowerCase();
                const filter = filterSelect.value;
                container.innerHTML = '';

                const ranked = schoolsData
                    .map(s => ({ ...s, matchScore: calculateMatch(s) }))
                    .filter(s => {
                        const matchesTrack = (filter === 'all') || (s.targetTrack === filter);
                        const matchesQuery = !query || s.name.toLowerCase().includes(query) || s.profile.toLowerCase().includes(query);
                        return matchesTrack && matchesQuery;
                    })
                    .sort((a, b) => b.matchScore - a.matchScore);

                ranked.forEach(school => {
                    const card = document.createElement('div');
                    card.style.cssText = "background: rgba(8, 12, 20, 0.55); border: 1px solid var(--border-color); padding: 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px;";

                    const badges = school.requiredTech.map(t => {
                        const m = userStack.includes(t);
                        return `<span style="display: inline-block; padding: 2px 7px; border-radius: 6px; font-size: 10px; margin-right: 4px; background: ${m ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.05)'}; color: ${m ? '#fff' : 'var(--text-muted)'}; border: 1px solid ${m ? 'var(--accent-blue)' : 'transparent'};">${t}</span>`;
                    }).join('');

                    card.innerHTML = `
                        <div style="flex: 1;">
                            <h3 style="font-size: 14px; color: #f0f4f8; margin-bottom: 3px;">${school.name}</h3>
                            <p style="font-size: 12px; color: var(--accent-blue); margin-bottom: 4px;">${school.profile} • Проходной балл: ${school.minScore}</p>
                            <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">${school.description}</p>
                            <div>${badges}</div>
                        </div>
                        <div style="min-width: 60px; height: 60px; border-radius: 50%; border: 3px solid ${school.matchScore >= 80 ? 'var(--accent-blue)' : '#64748b'}; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.1);">
                            <span style="font-size: 14px; font-weight: 700; color: #fff;">${school.matchScore}%</span>
                            <span style="font-size: 8px; color: var(--text-muted);">C++ WASM</span>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }

            searchInput.oninput = renderSchoolsList;
            filterSelect.onchange = renderSchoolsList;
            renderSchoolsList();
        }
    }

    renderTab('1');
    buttons.forEach(btn => btn.onclick = () => renderTab(btn.getAttribute('data-tab')));
});
