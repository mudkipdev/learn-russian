<script lang="ts">
    import { resolve } from "$app/paths";
    import type { RouteId } from "$app/types";
    import { Icon, Bolt, PencilSquare, TableCells, Swatch, UserGroup, type IconSource } from "svelte-hero-icons";

    const exercises: { href: RouteId; icon: IconSource; title: string; description: string }[] = [
        {
            href: "/reading",
            icon: Bolt,
            title: "Speed Reading",
            description: "Read a briefly flashed Russian word, then type its English cognate.",
        },
        {
            href: "/verbs",
            icon: PencilSquare,
            title: "Verb Conjugation",
            description: "Fill in the correct verb form.",
        },
        {
            href: "/nouns",
            icon: TableCells,
            title: "Noun Declension",
            description: "Fill in the correct noun case.",
        },
        {
            href: "/pronouns",
            icon: UserGroup,
            title: "Pronoun Declension",
            description: "Fill in the correct personal or possessive pronoun.",
        },
        {
            href: "/adjectives",
            icon: Swatch,
            title: "Adjective Agreement",
            description: "Fill in the agreeing adjective.",
        }
    ];
</script>

<svelte:head>
    <title>Learn Russian</title>
</svelte:head>

<main class="w-[min(92vw,720px)]">
    <div class="rounded-lg border border-line bg-surface p-6">
        <div class="grid auto-rows-fr gap-4">
            {#each exercises as exercise}
                <a
                    href={resolve(exercise.href)}
                    class="exercise flex items-center gap-4 rounded-md border border-line px-6 py-5 hover:bg-black/10"
                >
                    <div
                        class="color flex size-12 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-600/20 text-red-300"
                    >
                        <Icon src={exercise.icon} size="24" mini />
                    </div>
                    <div>
                        <div class="font-semibold">{exercise.title}</div>
                        <div class="mt-1 text-[0.9rem] text-muted">{exercise.description}</div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</main>

<style>
    .exercise:nth-child(4n + 1) .color {
        filter: hue-rotate(10deg);
    }

    .exercise:nth-child(4n + 2) .color {
        filter: hue-rotate(45deg);
    }

    .exercise:nth-child(4n + 3) .color {
        filter: hue-rotate(65deg);
    }

    .exercise:nth-child(4n + 4) .color {
        filter: hue-rotate(110deg);
    }

    .exercise:nth-child(4n + 5) .color {
        filter: hue-rotate(190deg);
    }
</style>
