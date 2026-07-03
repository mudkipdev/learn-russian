<script lang="ts">
    import { tick } from "svelte";
    import { base } from "$app/paths";
    import { Icon, ArrowLeft, Check, XMark } from "svelte-hero-icons";
    import { ALL_WORDS, syllables, type Word } from "$lib/words";
    import { normalize, sleep } from "$lib/utils";

    const START_SYLLABLE_MS = 700; // starting ms per syllable
    const MIN_SYLLABLE_MS = 45; // fastest possible
    const MAX_SYLLABLE_MS = 900; // slowest possible
    const CORRECT_STEP = 25; // ms/syllable removed per correct answer
    const INCORRECT_STEP = 50; // ms/syllable added per wrong answer
    const RECENT_LIMIT = 15;

    type Display =
        | { kind: "start" }
        | { kind: "empty" }
        | { kind: "fixation" }
        | { kind: "word"; text: string }
        | { kind: "feedback"; good: boolean; text: string };

    let display = $state<Display>({ kind: "start" });
    let syllableMs = $state(START_SYLLABLE_MS);
    let best = $state(START_SYLLABLE_MS);
    let streak = $state(0);
    let started = $state(false);
    let awaiting = $state(false);
    let answer = $state("");
    let shake = $state(false);
    let history = $state<{ russian: string; answer: string; good: boolean }[]>([]);
    // Rows shown in the history panel; the list is clipped, not scrolled.
    const HISTORY_LIMIT = 10;
    let input = $state<HTMLInputElement>();

    const speedText = $derived(started ? `${syllableMs} ms` : "-");
    const bestText = $derived(started ? `${best} ms` : "-");

    let currentWord: Word | null = null;
    let recentWords: string[] = [];
    // Missed words, requeued to reappear a few rounds later.
    let retryQueue: { word: Word; due: number }[] = [];

    function pickWord(): Word {
        // A missed word that has waited long enough comes back for another read.
        for (const item of retryQueue) item.due--;
        const readyIndex = retryQueue.findIndex((item) => item.due <= 0);
        if (readyIndex !== -1) return retryQueue.splice(readyIndex, 1)[0].word;

        let word;
        do {
            word = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
        } while (recentWords.includes(word.russian) && ALL_WORDS.length > recentWords.length);
        recentWords.push(word.russian);
        if (recentWords.length > RECENT_LIMIT) recentWords.shift();
        return word;
    }

    async function nextRound(delay: number) {
        awaiting = false;
        await sleep(delay);
        display = { kind: "fixation" };
        await sleep(500);
        currentWord = pickWord();
        display = { kind: "word", text: currentWord.russian };
        await sleep(syllableMs * syllables(currentWord.russian));
        display = { kind: "empty" };
        awaiting = true;
        shake = false;
        answer = "";
        await tick();
        input?.focus();
    }

    function check() {
        if (!awaiting || !currentWord) return;
        const word = currentWord;
        const typed = answer.trim();
        const correct = word.answers.includes(normalize(typed));
        if (correct) {
            streak++;
            syllableMs = Math.max(MIN_SYLLABLE_MS, syllableMs - CORRECT_STEP);
            best = Math.min(best, syllableMs);
            display = { kind: "feedback", good: true, text: "Correct" };
        } else {
            streak = 0;
            syllableMs = Math.min(MAX_SYLLABLE_MS, syllableMs + INCORRECT_STEP);
            display = { kind: "feedback", good: false, text: word.russian };
            shake = true;
            // Bring the missed word back a few rounds later for another read.
            if (!retryQueue.some((item) => item.word.russian === word.russian)) {
                retryQueue.push({ word, due: 3 });
            }
        }
        history = [{ russian: word.russian, answer: word.answers[0], good: correct }, ...history].slice(
            0,
            HISTORY_LIMIT,
        );
        nextRound(correct ? 700 : 1600);
    }

    function start() {
        started = true;
        nextRound(0);
    }
</script>

{#snippet stat(label: string, value: string | number)}
    <div class="flex items-center justify-between text-[0.9rem]">
        <span class="text-muted">{label}</span>
        <b class="font-semibold text-fg tabular-nums">{value}</b>
    </div>
{/snippet}

<svelte:head>
    <title>Speed Reading</title>
</svelte:head>

<svelte:window
    onkeydown={() => {
        if (awaiting && document.activeElement !== input) input?.focus();
    }}
/>

<main class="w-[min(96vw,1900px)]">
    <a href="{base}/" class="mb-3 inline-flex items-center gap-1.5 text-[0.9rem] text-muted hover:text-fg">
        <Icon src={ArrowLeft} size="16" mini />
        Back
    </a>
    <div class="grid items-start gap-4 lg:grid-cols-[340px_1fr] xl:grid-cols-[1fr_560px_1fr]">
        <div class="space-y-4">
            <aside class="rounded-lg border border-line bg-surface p-6">
                <h2 class="mb-4 text-[0.95rem] font-semibold">Stats</h2>
                <div class="space-y-2">
                    {@render stat("Streak", streak)}
                    {@render stat("Speed", speedText)}
                    {@render stat("Best", bestText)}
                </div>
            </aside>
            <aside class="rounded-lg border border-line bg-surface p-6">
                <h2 class="mb-4 text-[0.95rem] font-semibold">History</h2>
                <div class="h-72 overflow-hidden">
                    {#if history.length === 0}
                        <p class="text-[0.85rem] text-muted">Your answers will appear here.</p>
                    {:else}
                        <ul class="space-y-2 text-[0.9rem]">
                            {#each history as entry}
                                <li class="flex items-center gap-2">
                                    <Icon
                                        src={entry.good ? Check : XMark}
                                        size="16"
                                        mini
                                        class={entry.good ? "shrink-0 text-good" : "shrink-0 text-bad"}
                                    />
                                    <span class="font-medium">{entry.russian}</span>
                                    <span class="ml-auto text-muted">{entry.answer}</span>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </aside>
        </div>
        <div class="relative rounded-lg border border-line bg-surface p-12 text-center">
            {#if !started}
                <div class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-surface">
                    <button
                        class="cursor-pointer rounded-md bg-accent px-[2.2rem] py-[0.7rem] text-base font-normal text-accent-fg transition-all duration-100 hover:brightness-110 active:scale-95"
                        onclick={start}
                    >
                        Start
                    </button>
                </div>
            {/if}
            <div
                class="mb-8 flex h-32 items-center justify-center text-[3rem] font-semibold tracking-[0.02em] select-none"
            >
                {#if display.kind === "fixation"}
                    <span class="font-normal text-muted">+</span>
                {:else if display.kind === "word"}
                    {display.text}
                {:else if display.kind === "feedback"}
                    <span class="text-[1.5rem] font-medium {display.good ? 'text-good' : 'text-bad'}"
                        >{display.text}</span
                    >
                {/if}
            </div>
            <div class="flex flex-col items-center gap-4">
                <input
                    bind:this={input}
                    bind:value={answer}
                    onkeydown={(event) => event.key === "Enter" && check()}
                    onanimationend={() => (shake = false)}
                    type="text"
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="false"
                    placeholder="Type the English word"
                    disabled={!awaiting}
                    class:invisible={!started}
                    class:shake
                    class="w-full rounded-md border border-line bg-bg px-4 py-[0.8rem] text-center text-[1.25rem] text-fg transition-colors outline-none focus:border-accent disabled:opacity-40"
                />
                <button
                    class:invisible={!started}
                    disabled={!awaiting}
                    onclick={check}
                    class="cursor-pointer rounded-md bg-accent px-6 py-2 text-[0.95rem] font-medium text-accent-fg transition-all duration-100 hover:brightness-110 active:scale-95 disabled:opacity-40"
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
</main>
