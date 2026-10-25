// core.cpp — Вычислительное ядро ранжирования профильных школ (WebAssembly)

extern "C" {

    // trackMatch: 1 (совпадение вектора) или 0
    // matchedTech: количество совпавших технологий из стека (0..3)
    // hasAchievements: 1 (есть олимпиады/проекты) или 0
    // examDelta: разница между прогнозом ученика и проходным баллом школы
    int calculateMatchScore(int trackMatch, int matchedTech, int hasAchievements, int examDelta) {
        int score = 55;

        // 1. Вес профильного направления
        if (trackMatch == 1) {
            score += 16;
        } else {
            score += 5;
        }

        // 2. Вес совпадения технологического стека
        int techBonus = matchedTech * 5;
        if (techBonus > 15) techBonus = 15;
        score += techBonus;

        // 3. Вес олимпиадных достижений
        if (hasAchievements == 1) {
            score += 5;
        }

        // 4. Учет балла ОГЭ/ЕГЭ относительно порога школы
        if (examDelta >= 0) {
            score += 8;
        } else {
            score -= 4;
        }

        if (score > 99) score = 99;
        if (score < 45) score = 45;

        return score;
    }

}