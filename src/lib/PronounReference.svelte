<script lang="ts">
    const PERSONAL_HEADERS = ["", "Accusative", "Genitive", "Dative", "Instrumental", "Prepositional"];
    const PERSONAL = [
        ["я", "меня", "меня", "мне", "мной", "мне"],
        ["ты", "тебя", "тебя", "тебе", "тобой", "тебе"],
        ["он / оно", "(н)его", "(н)его", "(н)ему", "(н)им", "нём"],
        ["она", "(н)её", "(н)её", "(н)ей", "(н)ей", "ней"],
        ["мы", "нас", "нас", "нам", "нами", "нас"],
        ["вы", "вас", "вас", "вам", "вами", "вас"],
        ["они", "(н)их", "(н)их", "(н)им", "(н)ими", "них"],
    ];

    const MOY_HEADERS = ["Case", "Masc / Neuter", "Feminine", "Plural"];
    const MOY = [
        ["Nominative", "мой / моё", "моя", "мои"],
        ["Accusative", "= Nom or Gen*", "мою", "= Nom or Gen*"],
        ["Genitive", "моего", "моей", "моих"],
        ["Dative", "моему", "моей", "моим"],
        ["Instrumental", "моим", "моей", "моими"],
        ["Prepositional", "моём", "моей", "моих"],
    ];

    const NASH_HEADERS = ["Case", "Masc / Neuter", "Feminine", "Plural"];
    const NASH = [
        ["Nominative", "наш / наше", "наша", "наши"],
        ["Genitive", "нашего", "нашей", "наших"],
        ["Dative", "нашему", "нашей", "нашим"],
        ["Instrumental", "нашим", "нашей", "нашими"],
        ["Prepositional", "нашем", "нашей", "наших"],
    ];
</script>

{#snippet table(headers: string[], rows: string[][])}
    <table class="mt-3 mb-6 w-full border-collapse text-[0.85rem]">
        {#if headers.some((header) => header)}
            <thead>
                <tr class="border-b border-line">
                    {#each headers as header}
                        <th class="py-1.5 pr-3 text-left font-semibold">{header}</th>
                    {/each}
                </tr>
            </thead>
        {/if}
        <tbody>
            {#each rows as row}
                <tr class="border-b border-line last:border-b-0">
                    {#each row as cell, index}
                        <td class="py-1.5 pr-3 {index === 0 ? 'text-muted' : ''}">{cell}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/snippet}

{#snippet heading(text: string)}
    <h3 class="mt-8 mb-2 text-[1rem] font-semibold first:mt-0">{text}</h3>
{/snippet}

{#snippet chapter(title: string, open: boolean, content: import("svelte").Snippet)}
    <details class="border-b border-line last:border-b-0" {open}>
        <summary class="cursor-pointer py-3 text-[1rem] font-semibold select-none hover:text-muted">{title}</summary>
        <div class="pb-4">
            {@render content()}
        </div>
    </details>
{/snippet}

<div class="text-[0.9rem] leading-relaxed">
    {#snippet basics()}
        <p class="mb-3 text-muted">
            Russian has two kinds of pronoun that behave very differently.
            <b class="text-fg">Personal</b> pronouns (я, ты, он...) stand in for a noun and change by
            <b class="text-fg">case only</b>. <b class="text-fg">Possessive</b> pronouns (мой, наш...) describe a noun
            and <b class="text-fg">agree</b> with it in gender, number, and case, just like adjectives.
        </p>
        <ul class="list-disc space-y-2 pl-5 text-muted">
            <li>Personal pronoun forms are irregular and simply have to be learned.</li>
            <li>The possessives его, её, их ("his, her, their") are the exception: they never change.</li>
            <li>In this exercise, typing е instead of ё is accepted.</li>
        </ul>
    {/snippet}

    {#snippet personal()}
        <p class="mb-1 text-muted">
            The full set of personal pronoun forms. The accusative and genitive are always identical.
        </p>
        {@render table(PERSONAL_HEADERS, PERSONAL)}
        {@render heading("The н- rule")}
        <p class="text-muted">
            The third-person pronouns (он, она, оно, они) add an <b class="text-fg">н-</b> at the front whenever a
            preposition governs them: <b class="text-fg">у него</b>, <b class="text-fg">к ней</b>,
            <b class="text-fg">с ними</b>, <b class="text-fg">о них</b>. As a bare object with no preposition they keep
            the plain form: <b class="text-fg">Я вижу его</b>, <b class="text-fg">Я дал ему книгу</b>. The prepositional
            always needs a preposition, so it is always нём / ней / них.
        </p>
    {/snippet}

    {#snippet possessive()}
        <p class="mb-1 text-muted">
            <b class="text-fg">мой</b> ("my"); <b class="text-fg">твой</b> ("your", familiar) and
            <b class="text-fg">свой</b> ("one's own") decline identically. *In the accusative, the masculine and plural
            equal the nominative for things and the genitive for people/animals.
        </p>
        {@render table(MOY_HEADERS, MOY)}
        {@render heading("наш and ваш")}
        <p class="mb-1 text-muted">
            <b class="text-fg">наш</b> ("our") and <b class="text-fg">ваш</b> ("your", polite/plural) follow the same
            pattern with the stress on на-/ва-.
        </p>
        {@render table(NASH_HEADERS, NASH)}
    {/snippet}

    {@render chapter("Basics", true, basics)}
    {@render chapter("Personal Pronouns", false, personal)}
    {@render chapter("Possessive Pronouns", false, possessive)}
</div>
