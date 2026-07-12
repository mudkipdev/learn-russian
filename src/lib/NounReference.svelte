<script lang="ts">
    const GENDER_HEADERS = ["Gender", "Typical endings", "Examples"];
    const GENDER = [
        ["Masculine", "consonant, -й, -ь", "стол, музей, словарь"],
        ["Feminine", "-а, -я, -ь", "книга, неделя, дверь"],
        ["Neuter", "-о, -е", "окно, море"],
    ];

    const CASE_USE_HEADERS = ["Case", "Main uses"];
    const CASE_USE = [
        ["Nominative", "the subject; the dictionary form"],
        ["Accusative", "the direct object; after motion в/на"],
        ["Genitive", '"of", possession, after нет, after quantities'],
        ["Dative", 'the indirect object, "to/for", after к, нравиться'],
        ["Instrumental", '"with/by", after с, professions'],
        ["Prepositional", "only after prepositions: в, на, о"],
    ];

    const SG_HEADERS = ["Case", "Masculine", "Feminine", "Neuter"];
    const SG_ROWS = [
        ["Nominative", "стол", "книга", "окно"],
        ["Accusative", "стол / брата*", "книгу", "окно"],
        ["Genitive", "стола", "книги", "окна"],
        ["Dative", "столу", "книге", "окну"],
        ["Instrumental", "столом", "книгой", "окном"],
        ["Prepositional", "столе", "книге", "окне"],
    ];

    const ACC_HEADERS = ["Noun", "Nominative", "Accusative", "Rule"];
    const ACC = [
        ["стол (m, thing)", "стол", "стол", "unchanged"],
        ["брат (m, person)", "брат", "брата", "animate = genitive"],
        ["книга (f)", "книга", "книгу", "-а → -у"],
        ["неделя (f)", "неделя", "неделю", "-я → -ю"],
        ["окно (n)", "окно", "окно", "unchanged"],
    ];

    const GEN_HEADERS = ["Noun", "Genitive", "Ending"];
    const GEN = [
        ["стол (m)", "стола", "-а"],
        ["музей (m)", "музея", "-я"],
        ["книга (f)", "книги", "-ы / -и"],
        ["неделя (f)", "недели", "-и"],
        ["дверь (f)", "двери", "-и"],
        ["окно (n)", "окна", "-а"],
        ["море (n)", "моря", "-я"],
    ];

    const DAT_HEADERS = ["Noun", "Dative", "Ending"];
    const DAT = [
        ["стол (m)", "столу", "-у"],
        ["музей (m)", "музею", "-ю"],
        ["книга (f)", "книге", "-е"],
        ["дверь (f)", "двери", "-и"],
        ["окно (n)", "окну", "-у"],
    ];

    const INST_HEADERS = ["Noun", "Instrumental", "Ending"];
    const INST = [
        ["стол (m)", "столом", "-ом"],
        ["музей (m)", "музеем", "-ем"],
        ["книга (f)", "книгой", "-ой"],
        ["неделя (f)", "неделей", "-ей"],
        ["дверь (f)", "дверью", "-ью"],
        ["окно (n)", "окном", "-ом"],
    ];

    const PREP_HEADERS = ["Noun", "Prepositional", "Ending"];
    const PREP = [
        ["стол (m)", "столе", "-е"],
        ["книга (f)", "книге", "-е"],
        ["дверь (f)", "двери", "-и"],
        ["окно (n)", "окне", "-е"],
        ["здание (n, -ие)", "здании", "-и"],
    ];

    const NOM_PL_HEADERS = ["Singular", "Plural", "Rule"];
    const NOM_PL = [
        ["стол (m)", "столы", "-ы"],
        ["музей (m)", "музеи", "-и"],
        ["книга (f)", "книги", "-ы / -и"],
        ["окно (n)", "окна", "-а"],
        ["море (n)", "моря", "-я"],
        ["дом (m)", "дома", "irregular -а"],
        ["друг (m)", "друзья", "irregular"],
        ["брат (m)", "братья", "irregular"],
    ];

    const GEN_PL_HEADERS = ["Singular", "Genitive plural", "Rule"];
    const GEN_PL = [
        ["стол (m)", "столов", "-ов"],
        ["музей (m)", "музеев", "-ев"],
        ["словарь (m)", "словарей", "-ей"],
        ["книга (f)", "книг", "zero ending"],
        ["неделя (f)", "недель", "zero + -ь"],
        ["окно (n)", "окон", "zero ending"],
        ["море (n)", "морей", "-ей"],
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
            Russian nouns change their endings depending on their role in the sentence. This is called
            <b class="text-fg">declension</b>. There are six cases and two numbers (singular and plural). The ending you
            need depends on the noun's <b class="text-fg">gender</b>, its case, and its number.
        </p>
        {@render heading("Gender")}
        <p class="mb-1 text-muted">Gender is usually clear from the nominative (dictionary) ending.</p>
        {@render table(GENDER_HEADERS, GENDER)}
        {@render heading("What each case is for")}
        {@render table(CASE_USE_HEADERS, CASE_USE)}
        {@render heading("Singular endings at a glance")}
        <p class="mb-1 text-muted">
            One example noun of each gender through all six cases. *Masculine accusative equals the nominative for things
            but the genitive for people and animals.
        </p>
        {@render table(SG_HEADERS, SG_ROWS)}
        <ul class="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>After the letters г, к, х, ж, ш, ч, щ you write <b class="text-fg">и</b>, never ы.</li>
            <li>When an ending is stressed, an unstressed е often appears as ё (о́зеро → озёра).</li>
            <li>In this exercise, typing е instead of ё is accepted.</li>
        </ul>
    {/snippet}

    {#snippet accusative()}
        <p class="mb-1 text-muted">
            The accusative marks the direct object: <b class="text-fg">Я читаю книгу</b> ("I am reading a book"). Two
            rules decide the ending.
        </p>
        {@render heading("Feminine: -а → -у, -я → -ю")}
        <p class="mb-1 text-muted">Feminine nouns get a distinct accusative ending.</p>
        {@render heading("Masculine and neuter")}
        <p class="mb-1 text-muted">
            Inanimate masculine and all neuter nouns look exactly like the nominative. But an
            <b class="text-fg">animate</b> masculine noun (a person or animal) takes the genitive ending: Я вижу
            <b class="text-fg">брата</b>.
        </p>
        {@render table(ACC_HEADERS, ACC)}
    {/snippet}

    {#snippet genitive()}
        <p class="mb-1 text-muted">
            The genitive expresses "of" and possession (<b class="text-fg">дом брата</b>, "the brother's house"). It is
            also required after <b class="text-fg">нет</b> ("there is no..."), after many prepositions (у, из, до, без,
            для), and after quantity words (много, мало, стакан).
        </p>
        {@render table(GEN_HEADERS, GEN)}
    {/snippet}

    {#snippet dative()}
        <p class="mb-1 text-muted">
            The dative marks the indirect object, the "to/for" person: <b class="text-fg">Я дал книгу брату</b>. It
            follows the preposition <b class="text-fg">к</b> and the verb <b class="text-fg">нравиться</b> (Мне нравится
            музыка).
        </p>
        {@render table(DAT_HEADERS, DAT)}
    {/snippet}

    {#snippet instrumental()}
        <p class="mb-1 text-muted">
            The instrumental expresses the means ("by/with"): <b class="text-fg">Я пишу карандашом</b>. It follows the
            preposition <b class="text-fg">с</b> ("together with") and names a profession after быть or работать (Он
            работает <b class="text-fg">врачом</b>).
        </p>
        {@render table(INST_HEADERS, INST)}
    {/snippet}

    {#snippet prepositional()}
        <p class="mb-1 text-muted">
            The prepositional never appears alone. It follows <b class="text-fg">в</b> and <b class="text-fg">на</b>
            ("in/at", location) and <b class="text-fg">о</b> ("about"). The ending is almost always
            <b class="text-fg">-е</b>; feminine nouns in -ь and nouns in -ий/-ие/-ия take -и.
        </p>
        {@render table(PREP_HEADERS, PREP)}
    {/snippet}

    {#snippet nominativePlural()}
        <p class="mb-1 text-muted">
            Masculine and feminine nouns form the nominative plural in <b class="text-fg">-ы/-и</b>; neuter nouns in
            <b class="text-fg">-а/-я</b>. A handful of common masculine nouns take a stressed -а (дома, города) or an
            irregular soft plural (друзья, братья).
        </p>
        {@render table(NOM_PL_HEADERS, NOM_PL)}
    {/snippet}

    {#snippet genitivePlural()}
        <p class="mb-1 text-muted">
            The genitive plural is the hardest form. It is needed after quantities (много, пять, нет). Masculine nouns
            usually add <b class="text-fg">-ов/-ев/-ей</b>; feminine and neuter nouns most often have a
            <b class="text-fg">zero ending</b> (книга → книг, окно → окон), sometimes inserting a vowel to break up the
            final consonants.
        </p>
        {@render table(GEN_PL_HEADERS, GEN_PL)}
    {/snippet}

    {@render chapter("Basics", true, basics)}
    {@render chapter("Accusative", false, accusative)}
    {@render chapter("Genitive", false, genitive)}
    {@render chapter("Dative", false, dative)}
    {@render chapter("Instrumental", false, instrumental)}
    {@render chapter("Prepositional", false, prepositional)}
    {@render chapter("Nominative Plural", false, nominativePlural)}
    {@render chapter("Genitive Plural", false, genitivePlural)}
</div>
