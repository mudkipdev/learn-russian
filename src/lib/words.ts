import words from "./words.json";

export interface Word {
    russian: string;
    answers: string[];
}

export const ALL_WORDS: Word[] = words;

export function syllables(word: string): number {
    return Math.max(1, (word.match(/[аеёиоуыэюя]/g) || []).length);
}
