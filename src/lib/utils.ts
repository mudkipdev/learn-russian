export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalize(text: string): string {
    return text.trim().toLowerCase().replaceAll("ё", "е");
}
