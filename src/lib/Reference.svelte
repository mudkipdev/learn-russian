<script lang="ts">
    const PRONOUNS = [
        ["я", "I"],
        ["ты", "you (familiar)"],
        ["вы", "you (polite or plural)"],
        ["он", "he"],
        ["она", "she"],
        ["оно", "it"],
        ["мы", "we"],
        ["они", "they"],
    ];

    const ZNAT = [
        ["я", "знаю", "I know"],
        ["ты", "знаешь", "you know"],
        ["он/она/оно", "знает", "he/she/it knows"],
        ["мы", "знаем", "we know"],
        ["вы", "знаете", "you know"],
        ["они", "знают", "they know"],
    ];

    const GOVORIT = [
        ["я", "говорю", "I speak"],
        ["ты", "говоришь", "you speak"],
        ["он/она/оно", "говорит", "he/she/it speaks"],
        ["мы", "говорим", "we speak"],
        ["вы", "говорите", "you speak"],
        ["они", "говорят", "they speak"],
    ];

    const EKHAT = [
        ["я", "еду", "I go"],
        ["ты", "едешь", "you go"],
        ["он/она/оно", "едет", "he/she/it goes"],
        ["мы", "едем", "we go"],
        ["вы", "едете", "you go"],
        ["они", "едут", "they go"],
    ];

    const ZHIT = [
        ["я", "живу", "I live"],
        ["ты", "живёшь", "you live"],
        ["он/она/оно", "живёт", "he/she/it lives"],
        ["мы", "живём", "we live"],
        ["вы", "живёте", "you live"],
        ["они", "живут", "they live"],
    ];

    const SUMMARY_HEADERS = ["", "знать (1)", "говорить (2)", "жить (1B)", "ехать (1B)"];
    const SUMMARY_ROWS = [
        ["Stem", "зна-", "говор-", "жив-", "ед-"],
        ["я", "-ю", "-ю", "-у", "-у"],
        ["ты", "-ешь", "-ишь", "-ёшь", "-ешь"],
        ["он/она/оно", "-ет", "-ит", "-ёт", "-ет"],
        ["мы", "-ем", "-им", "-ём", "-ем"],
        ["вы", "-ете", "-ите", "-ёте", "-ете"],
        ["они", "-ют", "-ят", "-ут", "-ут"],
    ];

    const MORE_VERBS_HEADERS = ["Infinitive", "Type", "Stem", "я-form", "Meaning"];
    const MORE_VERBS = [
        ["читать", "1", "чита-", "читаю", "to read"],
        ["понимать", "1", "понима-", "понимаю", "to understand"],
        ["работать", "1", "работа-", "работаю", "to work"],
        ["слушать", "1", "слуша-", "слушаю", "to listen"],
        ["отвечать", "1", "отвеча-", "отвечаю", "to answer"],
        ["смотреть", "2", "смотр-", "смотрю", "to watch, to look"],
        ["звонить", "2", "звон-", "звоню", "to call (by phone)"],
    ];

    const MUTATION_HEADERS = ["Infinitive", "я-form", "ты-form", "Meaning"];
    const MUTATION = [
        ["любить", "люблю", "любишь", "to love"],
        ["готовить", "готовлю", "готовишь", "to cook, to prepare"],
        ["видеть", "вижу", "видишь", "to see"],
        ["сидеть", "сижу", "сидишь", "to sit"],
        ["ходить", "хожу", "ходишь", "to go (on foot)"],
        ["просить", "прошу", "просишь", "to ask, to request"],
    ];

    const RISOVAT = [
        ["я", "рисую", "I draw"],
        ["ты", "рисуешь", "you draw"],
        ["он/она/оно", "рисует", "he/she/it draws"],
        ["мы", "рисуем", "we draw"],
        ["вы", "рисуете", "you draw"],
        ["они", "рисуют", "they draw"],
    ];

    const OVAT_HEADERS = ["Infinitive", "я-form", "Meaning"];
    const OVAT = [
        ["танцевать", "танцую", "to dance"],
        ["советовать", "советую", "to advise"],
        ["пробовать", "пробую", "to try, to taste"],
    ];

    const DAVAT = [
        ["я", "даю", "I give"],
        ["ты", "даёшь", "you give"],
        ["он/она/оно", "даёт", "he/she/it gives"],
        ["мы", "даём", "we give"],
        ["вы", "даёте", "you give"],
        ["они", "дают", "they give"],
    ];

    const UCHITSYA = [
        ["я", "учусь", "I study"],
        ["ты", "учишься", "you study"],
        ["он/она/оно", "учится", "he/she/it studies"],
        ["мы", "учимся", "we study"],
        ["вы", "учитесь", "you study"],
        ["они", "учатся", "they study"],
    ];

    const IRREGULAR_HEADERS = ["", "хотеть (to want)", "мочь (to be able)", "есть (to eat)"];
    const IRREGULAR = [
        ["я", "хочу", "могу", "ем"],
        ["ты", "хочешь", "можешь", "ешь"],
        ["он/она/оно", "хочет", "может", "ест"],
        ["мы", "хотим", "можем", "едим"],
        ["вы", "хотите", "можете", "едите"],
        ["они", "хотят", "могут", "едят"],
    ];

    const PAST_HEADERS = ["Subject", "читать", "быть", "Ending"];
    const PAST = [
        ["он (masculine)", "читал", "был", "-л"],
        ["она (feminine)", "читала", "была", "-ла"],
        ["оно (neuter)", "читало", "было", "-ло"],
        ["они/мы/вы (plural)", "читали", "были", "-ли"],
    ];

    const FUTURE = [
        ["я", "буду читать", "I will read"],
        ["ты", "будешь читать", "you will read"],
        ["он/она/оно", "будет читать", "he/she/it will read"],
        ["мы", "будем читать", "we will read"],
        ["вы", "будете читать", "you will read"],
        ["они", "будут читать", "they will read"],
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
            The present tense describes actions taking place at the moment of speech. Russian has only one present
            tense: <b class="text-fg">я работаю</b> means both "I work" and "I am working". Verb endings attach to the verb's
            stem; the set of forms is called the conjugation.
        </p>
        {@render heading("Personal Pronouns")}
        {@render table(["", ""], PRONOUNS)}
        {@render heading("Usage Notes")}
        <ul class="list-disc space-y-2 pl-5 text-muted">
            <li>
                The он, она and оно forms are always identical in the present tense of <b class="text-fg">all</b>
                verbs.
            </li>
            <li>
                Use <b class="text-fg">ты</b> with family, friends and children; use <b class="text-fg">вы</b> with strangers,
                in formal situations, and whenever addressing more than one person.
            </li>
            <li>
                Yes/no questions keep the same word order as statements: <b class="text-fg">Вы говорите по-русски?</b>
                Only the intonation changes.
            </li>
            <li>
                To negate, place <b class="text-fg">не</b> before the verb: <b class="text-fg">Я не понимаю.</b>
            </li>
            <li>In this exercise, typing е instead of ё is accepted (живешь counts as живёшь).</li>
        </ul>
    {/snippet}

    {#snippet presentCore()}
        {@render heading("Type 1: знать (to know)")}
        <p class="mb-1 text-muted">
            Most Type 1 verbs have a stem that is simply the infinitive minus <b class="text-fg">-ть</b>, so знать has
            the stem зна-.
        </p>
        {@render table(["", "", ""], ZNAT)}

        {@render heading("Type 2: говорить (to speak)")}
        <p class="mb-1 text-muted">
            The standard example of the second conjugation. The stem is говор-. Note the <b class="text-fg">-ят</b>
            ending of the они-form.
        </p>
        {@render table(["", "", ""], GOVORIT)}

        {@render heading("Type 1B: ехать (to go by transport)")}
        <p class="mb-1 text-muted">
            Type 1B verbs take much the same endings as знать, but the stem cannot be predicted from the infinitive. The
            stem of ехать is <b class="text-fg">ед-</b>: you just have to learn it. The я and они forms have
            <b class="text-fg">-у</b> where the знать type has -ю.
        </p>
        {@render table(["", "", ""], EKHAT)}

        {@render heading("Type 1B: жить (to live)")}
        <p class="mb-1 text-muted">
            Despite its -ить ending, жить is an ехать-type verb. The unguessable stem is <b class="text-fg">жив-</b>.
            When the ending is stressed, е becomes ё: живёшь, живёт.
        </p>
        {@render table(["", "", ""], ZHIT)}

        {@render heading("Verb Summary Table")}
        {@render table(SUMMARY_HEADERS, SUMMARY_ROWS)}

        {@render heading("More Verbs by Type")}
        {@render table(MORE_VERBS_HEADERS, MORE_VERBS)}
    {/snippet}

    {#snippet presentSpecial()}
        {@render heading("Consonant Mutation in Type 2")}
        <p class="mb-1 text-muted">
            Many Type 2 verbs change their final stem consonant in the <b class="text-fg">я-form only</b>; the other
            five forms are regular. Common changes: д → ж, с → ш, and б/в/п get an inserted <b class="text-fg">л</b>.
        </p>
        {@render table(MUTATION_HEADERS, MUTATION)}

        {@render heading("Verbs in -овать / -евать")}
        <p class="mb-1 text-muted">
            Verbs ending in -овать or -евать replace that suffix with <b class="text-fg">-у-</b> in the present tense, then
            take Type 1 endings: рисовать → рису-.
        </p>
        {@render table(["", "", ""], RISOVAT)}
        {@render table(OVAT_HEADERS, OVAT)}

        {@render heading("Verbs in -авать")}
        <p class="mb-1 text-muted">
            Verbs like давать and вставать drop the <b class="text-fg">-ва-</b> in the present tense and stress the endings:
            давать → да-, вставать → вста- (встаю, встаёшь).
        </p>
        {@render table(["", "", ""], DAVAT)}

        {@render heading("Reflexive Verbs (-ся)")}
        <p class="mb-1 text-muted">
            Reflexive verbs add <b class="text-fg">-ся</b> after a consonant and <b class="text-fg">-сь</b> after a vowel
            to the normal conjugated form. учиться conjugates like a Type 2 verb plus the reflexive ending.
        </p>
        {@render table(["", "", ""], UCHITSYA)}

        {@render heading("Irregular Verbs")}
        <p class="mb-1 text-muted">
            A few common verbs must be learned form by form. хотеть follows Type 1 in the singular and Type 2 in the
            plural; мочь changes г to ж in the middle forms; есть is one of the oldest verbs in the language.
        </p>
        {@render table(IRREGULAR_HEADERS, IRREGULAR)}
    {/snippet}

    {#snippet pastTense()}
        <p class="mb-1 text-muted">
            Remove -ть from the infinitive and add <b class="text-fg">-л</b>. The past tense agrees with the subject's
            gender and number, not person: я/ты/он читал, but я/ты/она читала.
        </p>
        {@render table(PAST_HEADERS, PAST)}
    {/snippet}

    {#snippet futureTense()}
        <p class="mb-1 text-muted">
            The compound future combines the future of <b class="text-fg">быть</b> with an infinitive. Only быть changes;
            the main verb stays in the infinitive.
        </p>
        {@render table(["", "", ""], FUTURE)}
    {/snippet}

    {@render chapter("Basics", true, basics)}
    {@render chapter("Present Tense: Core Types", false, presentCore)}
    {@render chapter("Present Tense: Special Patterns", false, presentSpecial)}
    {@render chapter("Past Tense", false, pastTense)}
    {@render chapter("Future Tense", false, futureTense)}
</div>
