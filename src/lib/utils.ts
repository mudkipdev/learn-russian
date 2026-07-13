export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalize(text: string): string {
    return text.trim().toLowerCase().replaceAll("ё", "е");
}

const TRANSLITERATION_SINGLES: Record<string, string> = {
    a: "а",
    b: "б",
    c: "ц",
    d: "д",
    e: "е",
    f: "ф",
    g: "г",
    h: "х",
    i: "и",
    j: "й",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    q: "к",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    v: "в",
    w: "в",
    x: "х",
    y: "ы",
    z: "з",
    "'": "ь",
    '"': "ъ",
};

const TRANSLITERATION_COMBOS: Record<string, string> = {
    зh: "ж",
    сh: "ш",
    цh: "ч",
    кh: "х",
    шc: "щ",
    щh: "щ",
    йa: "я",
    ыa: "я",
    йu: "ю",
    ыu: "ю",
    йo: "ё",
    ыo: "ё",
    йe: "е",
    "е'": "э",
    "ь'": "ъ",
};

export function transliterate(text: string): string {
    let result = "";
    for (const char of text) {
        const lower = char.toLowerCase();
        const previous = result.at(-1) ?? "";
        const combo = TRANSLITERATION_COMBOS[previous.toLowerCase() + lower];
        if (combo) {
            const uppercase = previous !== previous.toLowerCase() || char !== lower;
            result = result.slice(0, -1) + (uppercase ? combo.toUpperCase() : combo);
        } else {
            const single = TRANSLITERATION_SINGLES[lower];
            result += single ? (char === lower ? single : single.toUpperCase()) : char;
        }
    }
    return result;
}
