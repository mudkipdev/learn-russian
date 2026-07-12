<script lang="ts">
    import ClozeExercise from "$lib/ClozeExercise.svelte";
    import { ADJECTIVE_TOPIC_GROUPS } from "$lib/adjectiveTopics";
    import AdjectiveReference from "$lib/AdjectiveReference.svelte";
    import adjectives from "$lib/data/adjectives.json";
</script>

<ClozeExercise
    items={adjectives}
    topicGroups={ADJECTIVE_TOPIC_GROUPS}
    defaultTopics={["masculine", "feminine", "neuter", "plural"]}
    storagePrefix="adjective"
    title="Adjective Agreement"
    placeholder="Type the agreeing adjective"
    groupNoun=""
>
    {#snippet reference()}
        <AdjectiveReference />
    {/snippet}
</ClozeExercise>
