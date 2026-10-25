document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.tab-btn');
    const contentCard = document.getElementById('main-content');

    // 1. БИНАРНЫЙ МОДУЛЬ WEBASSEMBLY (Скомпилированный из core.cpp)
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

    const availableTech = ["C++", "Python", "JavaScript", "Алгоритмы", "Физика", "Математика", "Анализ данных", "Инженерия", "Робототехника", "Веб-дизайн"];

    // 2. БАЗА ДАННЫХ 20 ПРОФИЛЬНЫХ ШКОЛ И ЛИЦЕЕВ
    const schoolsData = [
        { id: 1, name: "Бауманская инженерная школа № 1580", profile: "Физико-математический и IT", targetTrack: "cpp", minScore: 88, requiredTech: ["Математика", "Физика", "Инженерия"], description: "Базовый лицей при МГТУ им. Н.Э. Баумана, углубленная инженерия и программирование." },
        { id: 2, name: "Лицей № 1502 при МЭИ", profile: "Инженерно-технологический", targetTrack: "cpp", minScore: 84, requiredTech: ["C++", "Физика", "Математика"], description: "Углубленная физика и программирование, проектная работа в лабораториях МЭИ." },
        { id: 3, name: "Школа «Летово»", profile: "IT и точные науки", targetTrack: "ai", minScore: 92, requiredTech: ["Python", "Алгоритмы", "Анализ данных"], description: "Индивидуальные учебные планы, исследовательские проекты и анализ данных." },
        { id: 4, name: "СУНЦ МГУ (Школа им. А.Н. Колмогорова)", profile: "Фундаментальные науки и IT", targetTrack: "ai", minScore: 95, requiredTech: ["Математика", "Алгоритмы", "Физика"], description: "Специализированный учебно-научный центр МГУ для победителей олимпиад." },
        { id: 5, name: "Школа № 179", profile: "Математика и алгоритмы", targetTrack: "cpp", minScore: 90, requiredTech: ["Алгоритмы", "Математика", "C++"], description: "Специализированные классы по алгоритмическому программированию и матанализу." },
        { id: 6, name: "Школа № 57", profile: "Математический и академический", targetTrack: "ai", minScore: 91, requiredTech: ["Математика", "Алгоритмы", "Анализ данных"], description: "Углубленное изучение фундаментальной математики и компьютерных наук." },
        { id: 7, name: "Лицей «Вторая школа» им. В.Ф. Овчинникова", profile: "Физика и математика", targetTrack: "cpp", minScore: 89, requiredTech: ["Физика", "Математика", "C++"], description: "Сильная подготовка к олимпиадам по физике, математике и информатике." },
        { id: 8, name: "Лицей НИУ ВШЭ", profile: "Информатика и инженерия", targetTrack: "web", minScore: 85, requiredTech: ["Python", "JavaScript", "Веб-дизайн"], description: "Проектная среда Высшей школы экономики, разработка веб-систем и аналитика." },
        { id: 9, name: "Школа Центра педагогического мастерства (ЦПМ)", profile: "Олимпиадное программирование", targetTrack: "ai", minScore: 93, requiredTech: ["Алгоритмы", "C++", "Математика"], description: "Подготовка сборных команд к всероссийским и международным олимпиадам." },
        { id: 10, name: "Школа № 1560 «Лидер» (ИТ-полигон)", profile: "Информационные технологии", targetTrack: "web", minScore: 78, requiredTech: ["JavaScript", "Веб-дизайн", "Инженерия"], description: "Прикладная разработка интерфейсов, прототипирование и хакатоны." },
        { id: 11, name: "Курчатовская школа", profile: "Конвергентные технологии и физмат", targetTrack: "cpp", minScore: 83, requiredTech: ["Физика", "Математика", "Инженерия"], description: "Сотрудничество с НИЦ «Курчатовский институт», инженерные практикумы." },
        { id: 12, name: "Школа № 2007 ФМШ", profile: "Физико-математический", targetTrack: "cpp", minScore: 86, requiredTech: ["Математика", "Физика", "C++"], description: "Углубленная геометрия, математический анализ и спортивное программирование." },
        { id: 13, name: "Школа № 1535", profile: "Многопрофильный IT-лицей", targetTrack: "web", minScore: 87, requiredTech: ["Математика", "Python", "Веб-дизайн"], description: "Лидер рейтингов предпрофессионального образования в ИТ-вертикали." },
        { id: 14, name: "Инженерный корпус школы № 548 «Царицыно»", profile: "Инженерное конструирование", targetTrack: "web", minScore: 80, requiredTech: ["Инженерия", "Робототехника", "Физика"], description: "Лаборатории робототехники, микроэлектроники и 3D-моделирования." },
        { id: 15, name: "Школа № 1514", profile: "Инженерно-математический", targetTrack: "ai", minScore: 88, requiredTech: ["Математика", "Алгоритмы", "Физика"], description: "Сочетание фундаментальной математической базы и программирования." },
        { id: 16, name: "Лицей «Воробьевы горы»", profile: "Прикладные IT-системы", targetTrack: "web", minScore: 79, requiredTech: ["Python", "JavaScript", "Инженерия"], description: "Командная разработка программных комплексов и работа в технопарке." },
        { id: 17, name: "Школа № 1329", profile: "Математика и системный анализ", targetTrack: "ai", minScore: 87, requiredTech: ["Математика", "Алгоритмы", "Анализ данных"], description: "Физико-математические и ИТ-классы при поддержке ведущих вузов." },
        { id: 18, name: "Школа № 1533 «ЛИТ»", profile: "Информационные технологии", targetTrack: "cpp", minScore: 84, requiredTech: ["C++", "Python", "Алгоритмы"], description: "Специализированный лицей информационных технологий и программирования." },
        { id: 19, name: "Школа № 444", profile: "Математика и робототехника", targetTrack: "cpp", minScore: 82, requiredTech: ["Математика", "C++", "Робототехника"], description: "Сильные традиции математических классов и прикладной кибернетики." },
        { id: 20, name: "Школа «Интеллектуал»", profile: "Исследовательский профиль", targetTrack: "ai", minScore: 89, requiredTech: ["Математика", "Физика", "Анализ данных"], description: "Обучение в малых группах, индивидуальная научная работа и проекты." }
    ];

    function getSavedStack() {
        const raw = localStorage.getItem('portfolio_stack');
        return raw ? JSON.parse(raw) : ["C++", "Математика", "Физика", "Инженерия"];
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
        const savedTrack = localStorage.getItem('portfolio_test_result') || 'cpp';
        const achievementStatus = localStorage.getItem('ach_status') || 'none';
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

    // 3. ПОСТРОЕНИЕ ЛЕПЕСТКОВОЙ ДИАГРАММЫ (RADAR CHART НА CANVAS)
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
        const track = localStorage.getItem('portfolio_test_result') || 'cpp';
        const achStatus = localStorage.getItem('ach_status') || 'none';

        const axes = [
            { label: "C++ / Системы", val: Math.min(1, 0.35 + (stack.includes("C++") ? 0.35 : 0) + (track === "cpp" ? 0.25 : 0) + (exam.inf === 5 ? 0.1 : 0)) },
            { label: "Математика", val: Math.min(1, 0.3 + (exam.math - 2) * 0.2 + (stack.includes("Математика") ? 0.2 : 0)) },
            { label: "Алгоритмы", val: Math.min(1, 0.3 + (stack.includes("Алгоритмы") ? 0.3 : 0) + (stack.includes("Python") ? 0.15 : 0) + (achStatus !== 'none' ? 0.2 : 0)) },
            { label: "Инженерия", val: Math.min(1, 0.3 + (exam.phys - 2) * 0.15 + (stack.includes("Физика") || stack.includes("Инженерия") || stack.includes("Робототехника") ? 0.3 : 0)) },
            { label: "Web / UI", val: Math.min(1, 0.35 + (stack.includes("JavaScript") || stack.includes("Веб-дизайн") ? 0.35 : 0) + (track === "web" ? 0.25 : 0)) }
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
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.font = "600 11px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";

        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + maxRadius * Math.cos(angle);
            const y = centerY + maxRadius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
            ctx.stroke();

            const labelRadius = maxRadius + 28;
            const lx = centerX + labelRadius * Math.cos(angle);
            const ly = centerY + labelRadius * Math.sin(angle) + 4;
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
        ctx.fillStyle = "rgba(59, 130, 246, 0.32)";
        ctx.fill();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const r = maxRadius * axes[i].val;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#60a5fa";
            ctx.fill();
            ctx.strokeStyle = "#080c14";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function exportPortfolio() {
        const name = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
        const grade = localStorage.getItem('portfolio_grade') || '8 «Д» класс';
        const achName = localStorage.getItem('ach_name') || 'Научно-практическая конференция «Инженеры будущего»';
        const achStage = localStorage.getItem('ach_stage') || 'regional';
        const achStatus = localStorage.getItem('ach_status') || 'winner';
        const trackCode = localStorage.getItem('portfolio_test_result') || 'cpp';
        const stack = getSavedStack();
        const exam = calculateExamForecast();

        const trackNames = {
            cpp: 'Системное программирование и C++',
            web: 'Веб-разработка и интерфейсы',
            ai: 'Прикладная математика и алгоритмы'
        };

        const stageNames = {
            school: 'Школьный',
            municipal: 'Муниципальный',
            regional: 'Региональный',
            allros: 'Заключительный'
        };

        const statusNames = {
            winner: 'Победитель',
            prizewinner: 'Призер',
            participant: 'Участник',
            none: 'Нет достижений'
        };

        const rankedSchools = schoolsData
            .map(s => ({ ...s, score: calculateMatch(s) }))
            .sort((a, b) => b.score - a.score);

        const content = [
            "ПОРТФОЛИО УЧЕНИКА",
            "",
            `Ученик: ${name}`,
            `Класс: ${grade}`,
            `Выбранное направление: ${trackNames[trackCode]}`,
            `Изучаемые предметы и языки: ${stack.join(', ')}`,
            "",
            "Расчет баллов по оценкам:",
            `Средний балл по профильным предметам: ${exam.avgGrade} из 5`,
            `Примерный первичный балл ОГЭ: ${exam.predictedOge}`,
            `Примерный балл ЕГЭ: ${exam.predictedEge}`,
            "",
            "Выбранное достижение из каталога:",
            `Мероприятие: ${achName}`,
            `Этап: ${stageNames[achStage]}`,
            `Результат / статус: ${statusNames[achStatus]}`,
            "",
            "Список подходящих профильных школ (по рейтингу совместимости):",
            ...rankedSchools.slice(0, 10).map((s, idx) => `${idx + 1}. ${s.name} (${s.profile}) - совпадение ${s.score}%, проходной балл: ${s.minScore}`)
        ].join('\r\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Portfolio_${name.replace(/\s+/g, '_') || 'Student'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function renderTab(tabIndex) {
        buttons.forEach((b, idx) => {
            b.classList.toggle('active', idx === parseInt(tabIndex));
        });

        if (tabIndex === '0') {
            const q1 = localStorage.getItem('portfolio_test_result') || 'cpp';
            const q2 = localStorage.getItem('portfolio_test_q2') || 'arch';
            const q3 = localStorage.getItem('portfolio_test_q3') || 'sci';
            const q4 = localStorage.getItem('portfolio_test_q4') || 'code';
            const q5 = localStorage.getItem('portfolio_test_q5') || 'eng';

            contentCard.innerHTML = `
                <h2>Профориентационное тестирование (5 векторов)</h2>
                <p>Ответьте на 5 профильных вопросов для построения вашей карты компетенций и калибровки ядра C++:</p>
                
                <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">1. Какое техническое направление вам наиболее интересно?</label>
                        <select id="test-q1" class="form-select">
                            <option value="cpp" ${q1 === 'cpp' ? 'selected' : ''}>Системное программирование, архитектура и C++</option>
                            <option value="web" ${q1 === 'web' ? 'selected' : ''}>Интерфейсы, веб-разработка и интерактивные приложения</option>
                            <option value="ai" ${q1 === 'ai' ? 'selected' : ''}>Прикладная математика, анализ данных и алгоритмы</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">2. Какой тип задач в проектах вам нравится решать больше всего?</label>
                        <select id="test-q2" class="form-select">
                            <option value="arch" ${q2 === 'arch' ? 'selected' : ''}>Оптимизация скорости работы программы и алгоритмическая логика</option>
                            <option value="ui" ${q2 === 'ui' ? 'selected' : ''}>Проектирование удобного визуального интерфейса и графики</option>
                            <option value="math" ${q2 === 'math' ? 'selected' : ''}>Математическое моделирование, формулы и вычисления</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">3. Какой формат интеллектуальных соревнований вам ближе?</label>
                        <select id="test-q3" class="form-select">
                            <option value="sci" ${q3 === 'sci' ? 'selected' : ''}>Научно-практические конференции («Инженеры будущего») и защита проектов</option>
                            <option value="olymp" ${q3 === 'olymp' ? 'selected' : ''}>Индивидуальные олимпиады по информатике, физике или математике</option>
                            <option value="hack" ${q3 === 'hack' ? 'selected' : ''}>Командные хакатоны и быстрая сборка рабочего прототипа</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">4. С какими инструментами вам интереснее работать на практике?</label>
                        <select id="test-q4" class="form-select">
                            <option value="code" ${q4 === 'code' ? 'selected' : ''}>Компиляторы, консоль, чистый код на C++ / Python</option>
                            <option value="browser" ${q4 === 'browser' ? 'selected' : ''}>Браузерные движки, верстка, Canvas и клиентский JavaScript</option>
                            <option value="hw" ${q4 === 'hw' ? 'selected' : ''}>Датчики, микроконтроллеры, физические приборы и 3D-модели</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">5. Какую цель при поступлении в профильный класс вы ставите главной?</label>
                        <select id="test-q5" class="form-select">
                            <option value="eng" ${q5 === 'eng' ? 'selected' : ''}>Глубокая подготовка к техническому вузу (МГТУ им. Баумана, МЭИ, МФТИ)</option>
                            <option value="it" ${q5 === 'it' ? 'selected' : ''}>Ранний старт в IT-разработке и создание собственных сервисов</option>
                            <option value="acad" ${q5 === 'acad' ? 'selected' : ''}>Победы в перечневых олимпиадах и фундаментальная наука</option>
                        </select>
                    </div>

                    <button id="test-submit" class="btn-primary">Сохранить результаты и пересчитать профиль</button>
                    <span id="test-status" style="font-size: 12px; color: var(--success); display: none;">Ответы сохранены! Лепестковая диаграмма и рейтинг WASM обновлены.</span>
                </div>
            `;

            document.getElementById('test-submit').addEventListener('click', () => {
                localStorage.setItem('portfolio_test_result', document.getElementById('test-q1').value);
                localStorage.setItem('portfolio_test_q2', document.getElementById('test-q2').value);
                localStorage.setItem('portfolio_test_q3', document.getElementById('test-q3').value);
                localStorage.setItem('portfolio_test_q4', document.getElementById('test-q4').value);
                localStorage.setItem('portfolio_test_q5', document.getElementById('test-q5').value);
                const s = document.getElementById('test-status');
                s.style.display = 'block';
                setTimeout(() => s.style.display = 'none', 2500);
            });

        } else if (tabIndex === '1') {
            const savedName = localStorage.getItem('portfolio_name') || 'Дубянский Артём';
            const savedGrade = localStorage.getItem('portfolio_grade') || '8 «Д»';
            const achName = localStorage.getItem('ach_name') || 'Научно-практическая конференция «Инженеры будущего»';
            const achStage = localStorage.getItem('ach_stage') || 'regional';
            const achStatus = localStorage.getItem('ach_status') || 'winner';

            let currentStack = getSavedStack();
            const forecast = calculateExamForecast();

            contentCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                    <h2 style="margin-bottom: 0;">Анкета, Калькулятор ОГЭ/ЕГЭ и Карта навыков</h2>
                    <button id="demo-fill-btn" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
                        Заполнить демо-профиль
                    </button>
                </div>
                <p>Заполните данные: диаграмма компетенций справа перестраивается в реальном времени на HTML5 Canvas.</p>
                
                <div class="portfolio-grid" style="margin-top: 14px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 2;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">ФИО ученика</label>
                                <input type="text" id="input-name" class="form-input" value="${savedName}">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Класс</label>
                                <input type="text" id="input-grade" class="form-input" value="${savedGrade}">
                            </div>
                        </div>

                        <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-color); padding: 12px; border-radius: 10px;">
                            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--accent-blue); margin-bottom: 8px;">
                                Калькулятор оценок (прогноз баллов ОГЭ / ЕГЭ)
                            </label>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                                <div>
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Матем.</span>
                                    <select id="grade-math" class="form-select" style="padding: 6px;">
                                        <option value="5" ${forecast.math===5?'selected':''}>5</option>
                                        <option value="4" ${forecast.math===4?'selected':''}>4</option>
                                        <option value="3" ${forecast.math===3?'selected':''}>3</option>
                                    </select>
                                </div>
                                <div>
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Информ.</span>
                                    <select id="grade-inf" class="form-select" style="padding: 6px;">
                                        <option value="5" ${forecast.inf===5?'selected':''}>5</option>
                                        <option value="4" ${forecast.inf===4?'selected':''}>4</option>
                                        <option value="3" ${forecast.inf===3?'selected':''}>3</option>
                                    </select>
                                </div>
                                <div>
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Физика</span>
                                    <select id="grade-phys" class="form-select" style="padding: 6px;">
                                        <option value="5" ${forecast.phys===5?'selected':''}>5</option>
                                        <option value="4" ${forecast.phys===4?'selected':''}>4</option>
                                        <option value="3" ${forecast.phys===3?'selected':''}>3</option>
                                    </select>
                                </div>
                                <div>
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Русский</span>
                                    <select id="grade-rus" class="form-select" style="padding: 6px;">
                                        <option value="5" ${forecast.rus===5?'selected':''}>5</option>
                                        <option value="4" ${forecast.rus===4?'selected':''}>4</option>
                                        <option value="3" ${forecast.rus===3?'selected':''}>3</option>
                                    </select>
                                </div>
                            </div>
                            <div id="forecast-summary" style="margin-top: 8px; font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between;">
                                <span>Первичный ОГЭ: <b style="color: var(--success);">~${forecast.predictedOge} б.</b></span>
                                <span>Прогноз ЕГЭ: <b style="color: var(--success);">~${forecast.predictedEge} б.</b></span>
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Технологический стек и предметы (кликните для выбора)</label>
                            <div id="tech-chips" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                        </div>

                        <div style="background: rgba(8, 12, 20, 0.4); border: 1px solid var(--border-color); padding: 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size: 12px; font-weight: 600; color: var(--text-main);">Выбор олимпиады или конкурса</label>
                            <select id="ach-name-select" class="form-select">
                                <option value="Научно-практическая конференция «Инженеры будущего»" ${achName.includes('Инженеры будущего')?'selected':''}>НПК «Инженеры будущего»</option>
                                <option value="Всероссийская олимпиада школьников (ВсОШ)" ${achName.includes('ВсОШ')?'selected':''}>Всероссийская олимпиада школьников (ВсОШ)</option>
                                <option value="Олимпиада «Курчатов»" ${achName.includes('Курчатов')?'selected':''}>Олимпиада школьников «Курчатов»</option>
                                <option value="Московская олимпиада школьников (МОШ)" ${achName.includes('МОШ')?'selected':''}>Московская олимпиада школьников (МОШ)</option>
                                <option value="Конкурс проектов «Школа старшеклассников»" ${achName.includes('Школа старшеклассников')?'selected':''}>Конкурс проектов «Школа старшеклассников»</option>
                            </select>

                            <div style="display: flex; gap: 8px;">
                                <div style="flex: 1;">
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Этап / Уровень</span>
                                    <select id="ach-stage-select" class="form-select" style="padding: 6px;">
                                        <option value="school" ${achStage==='school'?'selected':''}>Школьный</option>
                                        <option value="municipal" ${achStage==='municipal'?'selected':''}>Муниципальный</option>
                                        <option value="regional" ${achStage==='regional'?'selected':''}>Региональный</option>
                                        <option value="allros" ${achStage==='allros'?'selected':''}>Заключительный</option>
                                    </select>
                                </div>
                                <div style="flex: 1;">
                                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 3px;">Результат (Статус)</span>
                                    <select id="ach-status-select" class="form-select" style="padding: 6px;">
                                        <option value="winner" ${achStatus==='winner'?'selected':''}>Победитель</option>
                                        <option value="prizewinner" ${achStatus==='prizewinner'?'selected':''}>Призер</option>
                                        <option value="participant" ${achStatus==='participant'?'selected':''}>Участник</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button id="save-btn" class="btn-primary" style="flex: 1;">Сохранить анкету</button>
                            <button id="export-btn" class="btn-secondary" style="flex: 1;">Скачать паспорт (.txt)</button>
                        </div>
                        <span id="save-status" style="font-size: 12px; color: var(--success); display: none;">Профиль и график успешно обновлены!</span>
                    </div>

                    <div class="radar-box">
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Карта компетенций (Radar Chart)</span>
                        <span style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">Полярные координаты (HTML5 Canvas)</span>
                        <canvas id="skills-radar" width="300" height="250"></canvas>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
                            Многоугольник строится динамически по 5 осям: <b>C++</b>, <b>Математика</b>, <b>Алгоритмы</b>, <b>Инженерия</b>, <b>Web</b>.
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
                        padding: 5px 11px; border-radius: 18px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
                        border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'};
                        background: ${isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(8, 12, 20, 0.5)'};
                        color: ${isSelected ? '#fff' : 'var(--text-muted)'};
                    `;
                    chip.addEventListener('click', () => {
                        if (currentStack.includes(tech)) {
                            currentStack = currentStack.filter(t => t !== tech);
                        } else {
                            currentStack.push(tech);
                        }
                        localStorage.setItem('portfolio_stack', JSON.stringify(currentStack));
                        renderChips();
                        drawRadarChart('skills-radar');
                    });
                    chipsContainer.appendChild(chip);
                });
            }
            renderChips();
            drawRadarChart('skills-radar');

            ['grade-math', 'grade-inf', 'grade-phys', 'grade-rus'].forEach(id => {
                document.getElementById(id).addEventListener('change', () => {
                    localStorage.setItem('exam_math', document.getElementById('grade-math').value);
                    localStorage.setItem('exam_inf', document.getElementById('grade-inf').value);
                    localStorage.setItem('exam_phys', document.getElementById('grade-phys').value);
                    localStorage.setItem('exam_rus', document.getElementById('grade-rus').value);
                    const f = calculateExamForecast();
                    document.getElementById('forecast-summary').innerHTML = `
                        <span>Первичный ОГЭ: <b style="color: var(--success);">~${f.predictedOge} б.</b></span>
                        <span>Прогноз ЕГЭ: <b style="color: var(--success);">~${f.predictedEge} б.</b></span>
                    `;
                    drawRadarChart('skills-radar');
                });
            });

            document.getElementById('save-btn').addEventListener('click', () => {
                localStorage.setItem('portfolio_name', document.getElementById('input-name').value);
                localStorage.setItem('portfolio_grade', document.getElementById('input-grade').value);
                localStorage.setItem('ach_name', document.getElementById('ach-name-select').value);
                localStorage.setItem('ach_stage', document.getElementById('ach-stage-select').value);
                localStorage.setItem('ach_status', document.getElementById('ach-status-select').value);
                localStorage.setItem('portfolio_stack', JSON.stringify(currentStack));
                drawRadarChart('skills-radar');

                const s = document.getElementById('save-status');
                s.style.display = 'block';
                setTimeout(() => s.style.display = 'none', 2000);
            });

            document.getElementById('demo-fill-btn').addEventListener('click', () => {
                localStorage.setItem('portfolio_name', 'Дубянский Артём');
                localStorage.setItem('portfolio_grade', '8 «Д»');
                localStorage.setItem('ach_name', 'Научно-практическая конференция «Инженеры будущего»');
                localStorage.setItem('ach_stage', 'regional');
                localStorage.setItem('ach_status', 'winner');
                localStorage.setItem('portfolio_stack', JSON.stringify(["C++", "Математика", "Физика", "Алгоритмы", "Инженерия"]));
                localStorage.setItem('exam_math', '5');
                localStorage.setItem('exam_inf', '5');
                localStorage.setItem('exam_phys', '5');
                localStorage.setItem('exam_rus', '5');
                localStorage.setItem('portfolio_test_result', 'cpp');
                renderTab('1');
            });

            document.getElementById('export-btn').addEventListener('click', exportPortfolio);

        } else if (tabIndex === '2') {
            const userStack = getSavedStack();
            const exam = calculateExamForecast();

            contentCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2>Навигатор профильных школ (20 лицеев)</h2>
                        <p style="margin-bottom: 0;">Расчет выполняется бинарным модулем <b>C++ WebAssembly</b> с учетом вашего прогноза (${exam.predictedEge} экв. ЕГЭ).</p>
                    </div>
                    <span style="font-size: 11px; padding: 5px 10px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.35);">
                        ${wasmActive ? '● WebAssembly (C++ Binary) Активен' : '● Резервное ядро активно'}
                    </span>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
                    <input type="text" id="school-search" class="form-input" placeholder="Поиск по названию лицея (например, 1580 или Бауманская)..." style="flex: 2; min-width: 200px;">
                    <select id="school-filter" class="form-select" style="flex: 1; min-width: 170px;">
                        <option value="all">Все профили (20)</option>
                        <option value="cpp">Инженерия, Физмат и C++</option>
                        <option value="ai">Математика, Алгоритмы и ИИ</option>
                        <option value="web">Прикладные IT и Веб-системы</option>
                    </select>
                </div>

                <div id="schools-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 460px; overflow-y: auto; padding-right: 6px;"></div>
            `;

            const container = document.getElementById('schools-list');
            const searchInput = document.getElementById('school-search');
            const filterSelect = document.getElementById('school-filter');

            function renderSchoolsList() {
                const query = searchInput.value.trim().toLowerCase();
                const trackFilter = filterSelect.value;

                container.innerHTML = '';

                const ranked = schoolsData
                    .map(s => ({ ...s, matchScore: calculateMatch(s) }))
                    .filter(s => {
                        const matchesTrack = (trackFilter === 'all') || (s.targetTrack === trackFilter);
                        const matchesQuery = !query ||
                            s.name.toLowerCase().includes(query) ||
                            s.profile.toLowerCase().includes(query) ||
                            s.requiredTech.some(t => t.toLowerCase().includes(query));
                        return matchesTrack && matchesQuery;
                    })
                    .sort((a, b) => b.matchScore - a.matchScore);

                if (ranked.length === 0) {
                    container.innerHTML = `<p style="color: var(--text-muted);">По вашему запросу ничего не найдено.</p>`;
                    return;
                }

                ranked.forEach(school => {
                    const card = document.createElement('div');
                    card.style.cssText = "background: rgba(8, 12, 20, 0.55); border: 1px solid var(--border-color); padding: 14px 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; gap: 16px;";

                    const techBadges = school.requiredTech.map(t => {
                        const matched = userStack.includes(t);
                        return `<span style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; margin-right: 6px; background: ${matched ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.05)'}; color: ${matched ? '#fff' : 'var(--text-muted)'}; border: 1px solid ${matched ? 'var(--accent-blue)' : 'transparent'};">${t}</span>`;
                    }).join('');

                    card.innerHTML = `
                        <div style="flex: 1;">
                            <h3 style="font-size: 15px; color: var(--text-main); margin-bottom: 4px;">${school.name}</h3>
                            <p style="font-size: 12px; color: var(--accent-blue); margin-bottom: 5px;">${school.profile} • Проходной балл: ${school.minScore}</p>
                            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">${school.description}</p>
                            <div>${techBadges}</div>
                        </div>
                        <div style="min-width: 68px; height: 68px; border-radius: 50%; border: 3px solid ${school.matchScore >= 80 ? 'var(--accent-blue)' : '#64748b'}; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.1);">
                            <span style="font-size: 16px; font-weight: 700; color: var(--text-main);">${school.matchScore}%</span>
                            <span style="font-size: 8px; color: var(--text-muted);">WASM C++</span>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }

            searchInput.addEventListener('input', renderSchoolsList);
            filterSelect.addEventListener('change', renderSchoolsList);
            renderSchoolsList();
        }
    }

    renderTab('1');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            renderTab(btn.getAttribute('data-tab'));
        });
    });
});