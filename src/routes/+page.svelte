<script lang="ts">
    import { base } from "$app/paths";
    import { Icon, Bolt, PencilSquare, type IconSource } from "svelte-hero-icons";

    const exercises: { href: string; icon: IconSource; title: string; description: string }[] = [
        {
            href: "/reading",
            icon: Bolt,
            title: "Speed Reading",
            description: "Read a briefly flashed Russian word, then type its English cognate.",
        },
        {
            href: "/cloze",
            icon: PencilSquare,
            title: "Grammar Cloze",
            description: "Fill in the correct verb form. Choose which grammar topics to practice.",
        },
    ];
</script>

<svelte:head>
    <title>Learn Russian</title>
</svelte:head>

<main class="w-[min(92vw,720px)]">
    <div class="rounded-lg border border-line bg-surface p-6">
        <div class="flex flex-col gap-4">
            {#each exercises as exercise}
                <a
                    href="{base}{exercise.href}"
                    class="flex items-center gap-4 rounded-md border border-line px-6 py-5 transition-colors hover:border-accent"
                >
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-md border border-line bg-bg">
                        <Icon src={exercise.icon} size="20" mini />
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
