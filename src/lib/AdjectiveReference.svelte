<script lang="ts">
    const NOM_HEADERS = ["Type", "Masculine", "Neuter", "Feminine", "Plural"];
    const NOM = [
        ["Hard (новый)", "-ый", "-ое", "-ая", "-ые"],
        ["Soft (синий)", "-ий", "-ее", "-яя", "-ие"],
        ["Stressed (молодой)", "-ой", "-ое", "-ая", "-ые"],
    ];

    const HARD_HEADERS = ["Case", "Masc / Neuter", "Feminine", "Plural"];
    const HARD = [
        ["Nominative", "новый / новое", "новая", "новые"],
        ["Accusative", "= Nom or Gen*", "новую", "= Nom or Gen*"],
        ["Genitive", "нового", "новой", "новых"],
        ["Dative", "новому", "новой", "новым"],
        ["Instrumental", "новым", "новой", "новыми"],
        ["Prepositional", "новом", "новой", "новых"],
    ];

    const SOFT_HEADERS = ["Case", "Masc / Neuter", "Feminine", "Plural"];
    const SOFT = [
        ["Nominative", "синий / синее", "синяя", "синие"],
        ["Accusative", "= Nom or Gen*", "синюю", "= Nom or Gen*"],
        ["Genitive", "синего", "синей", "синих"],
        ["Dative", "синему", "синей", "синим"],
        ["Instrumental", "синим", "синей", "синими"],
        ["Prepositional", "синем", "синей", "синих"],
    ];

    const SPELLING_HEADERS = ["Adjective", "Nominative", "Note"];
    const SPELLING = [
        ["русский (m)", "русский", "к → и, never ы"],
        ["маленькие (pl)", "маленькие", "к → и, never ы"],
        ["хороший (n)", "хорошее", "ш + unstressed о → е"],
        ["большой (n)", "большое", "stressed о stays: большо́е"],
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
            A Russian adjective <b class="text-fg">agrees</b> with its noun in gender, number, and case. The dictionary
            form is the masculine nominative singular (новый). To describe a feminine, neuter, or plural noun, or a noun
            in another case, you swap the ending. Most adjectives are <b class="text-fg">hard-stem</b> like новый; a
            smaller group is <b class="text-fg">soft-stem</b> like синий.
        </p>
        {@render heading("Nominative endings")}
        <p class="mb-1 text-muted">
            Start here: the ending changes with the gender and number of the noun. Stressed-ending adjectives (молодой)
            differ from новый only in the masculine.
        </p>
        {@render table(NOM_HEADERS, NOM)}
        <ul class="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>The adjective takes its gender and case from the noun, not from the sentence's subject.</li>
            <li>Plural endings are the same for all three genders.</li>
            <li>In this exercise, typing е instead of ё is accepted.</li>
        </ul>
    {/snippet}

    {#snippet hard()}
        <p class="mb-1 text-muted">
            The full pattern for <b class="text-fg">новый</b> ("new"). Masculine and neuter share every ending except the
            nominative and accusative. *In the accusative, masculine and plural equal the nominative for things and the
            genitive for people/animals.
        </p>
        {@render table(HARD_HEADERS, HARD)}
        <p class="mt-2 text-muted">
            The genitive/accusative <b class="text-fg">-ого</b> ending is spelled with г but pronounced as if it were в.
        </p>
    {/snippet}

    {#snippet soft()}
        <p class="mb-1 text-muted">
            Soft-stem adjectives like <b class="text-fg">синий</b> ("dark blue") take the soft counterpart of every
            ending: -ий/-ее/-яя/-ие in the nominative, then -его, -ему, -им, -ем and so on.
        </p>
        {@render table(SOFT_HEADERS, SOFT)}
    {/snippet}

    {#snippet spelling()}
        <p class="mb-1 text-muted">
            Two rules override the hard endings after certain consonants.
        </p>
        <ul class="mb-2 list-disc space-y-2 pl-5 text-muted">
            <li>After <b class="text-fg">г, к, х, ж, ш, ч, щ</b> you write и, never ы (русский, большие).</li>
            <li>
                After <b class="text-fg">ж, ш, ч, щ, ц</b> an unstressed о in the ending becomes е (хорошее), but a
                stressed ending keeps о (большо́е).
            </li>
        </ul>
        {@render table(SPELLING_HEADERS, SPELLING)}
    {/snippet}

    {@render chapter("Basics", true, basics)}
    {@render chapter("Hard-Stem Adjectives", false, hard)}
    {@render chapter("Soft-Stem Adjectives", false, soft)}
    {@render chapter("Spelling Rules", false, spelling)}
</div>
