<script module lang="ts">
    export interface ClozeItem {
        text: string;
        base: string;
        answers: string[];
        hint: string;
        translation: string;
        topic: string;
        // Optional explicit chips; when absent they are derived from the topic taxonomy.
        badges?: string[];
    }
</script>

<script lang="ts">
    import { tick, type Snippet } from "svelte";
    import { resolve } from "$app/paths";
    import { browser } from "$app/environment";
    import { Icon, ArrowLeft, Check, XMark } from "svelte-hero-icons";
    import { normalize, sleep, transliterate } from "$lib/utils";
    import type { TopicGroup } from "$lib/topics";
    import StressText from "$lib/StressText.svelte";
    import Keyboard from "$lib/Keyboard.svelte";

    let {
        items,
        topicGroups,
        defaultTopics,
        storagePrefix,
        title,
        placeholder,
        groupNoun,
        reference,
        filterGroups,
        defaultFilters,
    }: {
        items: ClozeItem[];
        topicGroups: TopicGroup[];
        defaultTopics: string[];
        storagePrefix: string;
        title: string;
        placeholder: string;
        groupNoun: string;
        reference: Snippet;
        // Optional second selection axis matched against each item's badges (e.g. case).
        filterGroups?: TopicGroup[];
        defaultFilters?: string[];
    } = $props();

    const topics = $derived(topicGroups.flatMap((group) => group.topics));

    const RECENT_LIMIT = 10;
    // Rows shown in the history panel; the list is clipped, not scrolled.
    const HISTORY_LIMIT = 10;
    const TOPICS_STORAGE_KEY = $derived(`${storagePrefix}-topics`);
    const STRESS_STORAGE_KEY = $derived(`${storagePrefix}-stress`);
    const PHONETIC_STORAGE_KEY = $derived(`${storagePrefix}-phonetic`);
    const HISTORY_STORAGE_KEY = $derived(`${storagePrefix}-history`);
    const FILTERS_STORAGE_KEY = $derived(`${storagePrefix}-filters`);

    function loadEnabledTopics(): string[] {
        if (!browser) return defaultTopics;
        try {
            const saved: string[] = JSON.parse(localStorage.getItem(TOPICS_STORAGE_KEY) ?? "[]");
            const valid = saved.filter((key) => topics.some((topic) => topic.key === key));
            return valid.length ? valid : defaultTopics;
        } catch {
            return defaultTopics;
        }
    }

    function loadEnabledFilters(): string[] {
        if (!filterGroups) return [];
        const all = filterGroups.flatMap((group) => group.topics).map((topic) => topic.key);
        const fallback = defaultFilters ?? all;
        if (!browser) return fallback;
        try {
            const saved: string[] = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? "[]");
            const valid = saved.filter((key) => all.includes(key));
            return valid.length ? valid : fallback;
        } catch {
            return fallback;
        }
    }

    interface HistoryEntry {
        typed: string;
        answer: string;
        base: string;
        good: boolean;
    }

    function loadHistory(): HistoryEntry[] {
        if (!browser) return [];
        try {
            const saved: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) ?? "[]");
            return saved.slice(0, HISTORY_LIMIT);
        } catch {
            return [];
        }
    }

    function loadStress(): boolean {
        return browser ? localStorage.getItem(STRESS_STORAGE_KEY) !== "false" : true;
    }

    function loadPhoneticTyping(): boolean {
        return browser ? localStorage.getItem(PHONETIC_STORAGE_KEY) === "true" : false;
    }

    let item = $state<ClozeItem | null>(null);
    let feedback = $state<{ good: boolean } | null>(null);
    let streak = $state(0);
    let correctCount = $state(0);
    let totalCount = $state(0);
    let awaiting = $state(false);
    let answer = $state("");
    let hint = $state("");
    let shake = $state(false);
    let history = $state(loadHistory());
    let enabledTopics = $state(loadEnabledTopics());
    let enabledFilters = $state(loadEnabledFilters());
    let showStress = $state(loadStress());
    let phoneticTyping = $state(loadPhoneticTyping());
    let input = $state<HTMLInputElement>();

    $effect(() => {
        localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(enabledTopics));
    });

    $effect(() => {
        if (filterGroups) localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(enabledFilters));
    });

    $effect(() => {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    });

    $effect(() => {
        localStorage.setItem(STRESS_STORAGE_KEY, String(showStress));
    });

    $effect(() => {
        localStorage.setItem(PHONETIC_STORAGE_KEY, String(phoneticTyping));
    });

    const accuracy = $derived(totalCount ? Math.round((correctCount / totalCount) * 100) + "%" : "-");
    const displayText = $derived.by(() => {
        if (!item) return "";
        return showStress ? item.text : item.text.replaceAll("́", "");
    });
    const displayBase = $derived(item ? (showStress ? item.base : item.base.replaceAll("́", "")) : "");
    const parts = $derived(displayText ? displayText.split("___") : ["", ""]);
    const maskedHint = $derived.by(() => {
        if (!item) return "";
        let text = item.hint;
        for (const known of item.answers) {
            text = text.replace(new RegExp(`(?<![а-яё])${known}(?![а-яё])`, "gi"), "…");
        }
        return text;
    });
    const taskBadges = $derived.by(() => {
        if (!item) return [];
        const current = item;
        if (current.badges) return current.badges;
        const topicLabel = topics.find((topic) => topic.key === current.topic)?.label ?? "";
        const groupLabel =
            topicGroups.find((group) => group.topics.some((topic) => topic.key === current.topic))?.label ?? "";
        const groupBadge = groupNoun ? `${groupLabel} ${groupNoun}` : groupLabel;
        return topicLabel.toLowerCase().includes(groupLabel.toLowerCase()) ? [topicLabel] : [topicLabel, groupBadge];
    });
    const activeItems = $derived(
        items.filter(
            (entry) =>
                enabledTopics.includes(entry.topic) &&
                (!filterGroups || (entry.badges != null && entry.badges.some((badge) => enabledFilters.includes(badge)))),
        ),
    );
    const noItems = $derived(activeItems.length === 0);

    let recentTexts: string[] = [];
    // Missed items, requeued to reappear a few rounds later.
    let retryQueue: { item: ClozeItem; due: number }[] = [];

    function toggleTopic(key: string) {
        if (enabledTopics.includes(key)) {
            if (enabledTopics.length > 1) enabledTopics = enabledTopics.filter((topic) => topic !== key);
        } else {
            enabledTopics = [...enabledTopics, key];
        }
    }

    function toggleFilter(key: string) {
        if (enabledFilters.includes(key)) {
            if (enabledFilters.length > 1) enabledFilters = enabledFilters.filter((filter) => filter !== key);
        } else {
            enabledFilters = [...enabledFilters, key];
        }
    }

    function pickItem(): ClozeItem {
        // A missed item that has waited long enough comes back for another try.
        for (const entry of retryQueue) entry.due--;
        const readyIndex = retryQueue.findIndex((entry) => entry.due <= 0 && activeItems.includes(entry.item));
        if (readyIndex !== -1) return retryQueue.splice(readyIndex, 1)[0].item;

        let next;
        do {
            next = activeItems[Math.floor(Math.random() * activeItems.length)];
        } while (recentTexts.includes(next.text) && activeItems.length > recentTexts.length);
        recentTexts.push(next.text);
        if (recentTexts.length > RECENT_LIMIT) recentTexts.shift();
        return next;
    }

    async function nextRound(delay: number) {
        awaiting = false;
        await sleep(delay);
        if (activeItems.length === 0) {
            item = null;
            feedback = null;
            hint = "";
            return;
        }
        item = pickItem();
        feedback = null;
        hint = "";
        awaiting = true;
        shake = false;
        answer = "";
        await tick();
        input?.focus();
    }

    function check() {
        if (!awaiting || !item) return;
        const typed = answer.trim();
        const correct = item.answers.map(normalize).includes(normalize(typed));
        awaiting = false;
        totalCount++;
        feedback = { good: correct };
        if (correct) {
            streak++;
            correctCount++;
            hint = item.translation;
        } else {
            streak = 0;
            hint = `Answer: ${item.answers[0]}` + (typed ? ` (you typed: ${typed})` : "") + `. ${item.translation}`;
            shake = true;
            const missed = item;
            if (!retryQueue.some((entry) => entry.item.text === missed.text)) {
                retryQueue.push({ item: missed, due: 3 });
            }
        }
        history = [{ typed, answer: item.answers[0], base: item.base, good: correct }, ...history].slice(
            0,
            HISTORY_LIMIT,
        );
    }

    function next() {
        if (feedback) nextRound(0);
    }

    async function handleInput() {
        if (!input) return;
        if (!phoneticTyping) {
            answer = input.value;
            return;
        }
        const caret = input.selectionStart ?? input.value.length;
        const converted = transliterate(input.value.slice(0, caret));
        answer = converted + input.value.slice(caret);
        await tick();
        input.setSelectionRange(converted.length, converted.length);
    }

    // Start the first round on load, and resume whenever an empty selection becomes non-empty again.
    $effect(() => {
        if (activeItems.length > 0 && !item && !awaiting && !feedback) nextRound(0);
    });
</script>

{#snippet stat(label: string, value: string | number)}
    <div class="flex items-center justify-between text-[0.9rem]">
        <span class="text-muted">{label}</span>
        <b class="font-semibold text-fg tabular-nums">{value}</b>
    </div>
{/snippet}

<svelte:head>
    <title>{title}</title>
</svelte:head>

<svelte:window
    onkeydown={(event) => {
        if (event.key === "Enter" && feedback) next();
        else if (awaiting && document.activeElement !== input) input?.focus();
    }}
/>

<main class="w-[min(96vw,1900px)]">
    <a href={resolve("/")} class="mb-3 inline-flex items-center gap-1.5 text-[0.9rem] text-muted hover:text-fg">
        <Icon src={ArrowLeft} size="16" mini />
        Back
    </a>
    <div class="grid gap-4 lg:grid-cols-[340px_1fr] xl:h-[calc(100dvh-6rem)] xl:grid-cols-[1fr_640px_1fr]">
        <div class="flex flex-col gap-4 xl:min-h-0 xl:overflow-hidden">
            <aside class="border border-line bg-surface p-6 text-left">
                <h2 class="mb-4 text-[0.95rem] font-semibold">Stats</h2>
                <div class="space-y-2">
                    {@render stat("Streak", streak)}
                    {@render stat("Accuracy", accuracy)}
                    {@render stat("Correct", `${correctCount} / ${totalCount}`)}
                </div>
            </aside>
            <aside class="border border-line bg-surface p-6 text-left">
                <h2 class="mb-4 text-[0.95rem] font-semibold">Settings</h2>
                {#each topicGroups as group}
                    <div class="mb-5 last:mb-0">
                        <div class="mb-2 text-[0.8rem] text-muted">{group.label}</div>
                        <div class="flex flex-wrap gap-2">
                            {#each group.topics as topic}
                                <button
                                    class="cursor-pointer px-3 py-1 text-[0.8rem] font-medium transition-all duration-100 active:scale-95 {enabledTopics.includes(
                                        topic.key,
                                    )
                                        ? 'bg-fg/20 text-fg'
                                        : 'bg-fg/10 text-muted'} hover:scale-105"
                                    onclick={() => toggleTopic(topic.key)}
                                >
                                    {topic.label}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/each}
                {#if filterGroups}
                    {#each filterGroups as group}
                        <div class="mb-5 last:mb-0">
                            <div class="mb-2 text-[0.8rem] text-muted">{group.label}</div>
                            <div class="flex flex-wrap gap-2">
                                {#each group.topics as topic}
                                    <button
                                        class="cursor-pointer px-3 py-1 text-[0.8rem] font-medium transition-all duration-100 active:scale-95 {enabledFilters.includes(
                                            topic.key,
                                        )
                                            ? 'bg-fg/20 text-fg'
                                            : 'bg-fg/10 text-muted'} hover:scale-105"
                                        onclick={() => toggleFilter(topic.key)}
                                    >
                                        {topic.label}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}
                <div class="mt-5">
                    <div class="mb-2 text-[0.8rem] text-muted">Display</div>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="cursor-pointer px-3 py-1 text-[0.8rem] font-medium transition-all duration-100 active:scale-95 {showStress
                                ? 'bg-fg/20 text-fg'
                                : 'bg-fg/10 text-muted'} hover:scale-105"
                            onclick={() => (showStress = !showStress)}
                        >
                            Stress marks
                        </button>
                        <button
                            class="cursor-pointer px-3 py-1 text-[0.8rem] font-medium transition-all duration-100 active:scale-95 {phoneticTyping
                                ? 'bg-fg/20 text-fg'
                                : 'bg-fg/10 text-muted'} hover:scale-105"
                            onclick={() => (phoneticTyping = !phoneticTyping)}
                        >
                            Phonetic typing
                        </button>
                    </div>
                </div>
            </aside>
            <aside class="flex flex-col border border-line bg-surface p-6 text-left xl:min-h-0 xl:flex-1">
                <h2 class="mb-4 text-[0.95rem] font-semibold">History</h2>
                <div class="h-72 overflow-y-auto xl:h-auto xl:min-h-0 xl:flex-1">
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
                                <span class="font-medium">{entry.typed || "-"}</span>
                                <span class="ml-auto text-muted">{entry.good ? entry.base : entry.answer}</span>
                            </li>
                        {/each}
                    </ul>
                {/if}
                </div>
            </aside>
        </div>
        <div class="flex flex-col gap-4 xl:min-h-0">
        <div class="relative border border-line bg-surface p-12 text-center xl:flex xl:flex-1 xl:flex-col xl:justify-center">
            <div
                class="mb-2 flex min-h-28 items-center justify-center text-[1.8rem] font-medium leading-snug select-none"
            >
                {#if item}
                    <span>
                        <StressText text={parts[0]} />{#if feedback}<span
                                class={feedback.good ? "text-good" : "text-bad"}>{item.answers[0]}</span
                            >{:else}<span class="relative inline-block"
                                ><span class="invisible">{item.answers[0]}</span><span
                                    class="absolute inset-x-0 bottom-1 border-b-2 border-muted"
                                ></span></span
                            >{/if}<StressText text={parts[1]} />
                    </span>
                {:else if noItems}
                    <span class="text-[1.1rem] text-muted">No cards match the current selection.</span>
                {/if}
            </div>
            <hr class="mb-6 border-line" />
            <div class="mb-2 flex min-h-[1.9em] items-center justify-center gap-2">
                {#if item}
                    <span class="text-[1.05rem] font-semibold"><StressText text={displayBase} /></span>
                    {#each taskBadges as badge}
                        <span class="bg-fg/10 px-2 py-0.5 text-[0.75rem] font-medium text-muted">
                            {badge}
                        </span>
                    {/each}
                {/if}
            </div>
            <div class="mb-6 min-h-[1.5em] text-[0.9rem] text-muted">
                {#if item}{feedback ? item.hint : maskedHint}{/if}
            </div>
            <div class="flex flex-col items-center gap-4">
                {#if noItems}
                    <p class="text-[0.9rem] text-muted">Enable more options in Settings to continue.</p>
                {:else}
                    <input
                        bind:this={input}
                        value={answer}
                        oninput={handleInput}
                        onkeydown={(event) => {
                            if (event.key === "Enter") {
                                event.stopPropagation();
                                check();
                            }
                        }}
                        onanimationend={() => (shake = false)}
                        type="text"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        {placeholder}
                        disabled={!awaiting}
                        class:shake
                        class="w-full border border-line bg-bg px-4 py-[0.8rem] text-center text-[1.25rem] text-fg transition-colors outline-none focus:border-accent disabled:opacity-40"
                    />
                    {#if feedback}
                        <button
                            onclick={next}
                            class="cursor-pointer bg-accent px-6 py-2 text-[0.95rem] font-medium text-accent-fg transition-all duration-100 hover:brightness-110 active:scale-95"
                        >
                            Next
                        </button>
                    {:else}
                        <button
                            disabled={!awaiting}
                            onclick={check}
                            class="cursor-pointer bg-accent px-6 py-2 text-[0.95rem] font-medium text-accent-fg transition-all duration-100 hover:brightness-110 active:scale-95 disabled:opacity-40"
                        >
                            Submit
                        </button>
                    {/if}
                {/if}
            </div>
            <div class="mt-5 min-h-[3em] text-[0.9rem] text-muted">
                {hint}
            </div>
        </div>
        <div class="border border-line bg-surface p-6">
            <h2 class="mb-4 text-left text-[0.95rem] font-semibold">Keyboard</h2>
            <Keyboard
                onkey={(letter) => {
                    if (!awaiting) return;
                    answer += letter;
                    input?.focus();
                }}
                onbackspace={() => {
                    if (!awaiting) return;
                    answer = answer.slice(0, -1);
                    input?.focus();
                }}
            />
        </div>
        </div>
        <div class="relative border border-line bg-surface text-left lg:col-span-2 xl:col-span-1 xl:min-h-0">
            <div class="p-8 xl:absolute xl:inset-0 xl:overflow-y-auto">
                <h2 class="mb-4 text-[0.95rem] font-semibold">Grammar Reference</h2>
                {@render reference()}
            </div>
        </div>
    </div>
</main>
