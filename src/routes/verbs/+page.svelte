<script lang="ts">
    import ClozeExercise from "$lib/ClozeExercise.svelte";
    import { TOPIC_GROUPS } from "$lib/topics";
    import Reference from "$lib/Reference.svelte";
    import cloze from "$lib/data/cloze.json";
</script>

<ClozeExercise
    items={cloze}
    topicGroups={TOPIC_GROUPS}
    defaultTopics={["type1", "type2", "type1b"]}
    storagePrefix="verb"
    title="Verb Conjugation"
    placeholder="Type the missing verb form"
    groupNoun="tense"
>
    {#snippet reference()}
        <Reference />
    {/snippet}
</ClozeExercise>
