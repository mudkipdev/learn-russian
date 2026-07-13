<script lang="ts">
    import ClozeExercise from "$lib/ClozeExercise.svelte";
    import { PRONOUN_TOPIC_GROUPS, PRONOUN_FILTER_GROUPS } from "$lib/pronounTopics";
    import PronounReference from "$lib/PronounReference.svelte";
    import pronouns from "$lib/data/pronouns.json";
</script>

<ClozeExercise
    items={pronouns}
    topicGroups={PRONOUN_TOPIC_GROUPS}
    filterGroups={PRONOUN_FILTER_GROUPS}
    defaultTopics={["ya", "ty"]}
    storagePrefix="pronoun"
    title="Pronoun Declension"
    placeholder="Type the correct pronoun"
    groupNoun=""
    confusionGroups={[
        ["я", "ты", "мы", "вы"],
        ["он", "она", "оно", "они"],
        ["мой", "твой", "свой", "наш", "ваш"],
    ]}
>
    {#snippet reference()}
        <PronounReference />
    {/snippet}
</ClozeExercise>
