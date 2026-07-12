<script lang="ts">
    import ClozeExercise from "$lib/ClozeExercise.svelte";
    import { NOUN_TOPIC_GROUPS } from "$lib/nounTopics";
    import NounReference from "$lib/NounReference.svelte";
    import nouns from "$lib/data/nouns.json";
</script>

<ClozeExercise
    items={nouns}
    topicGroups={NOUN_TOPIC_GROUPS}
    defaultTopics={["accusative", "genitive", "prepositional"]}
    storagePrefix="noun"
    title="Noun Declension"
    placeholder="Type the missing noun form"
    groupNoun=""
>
    {#snippet reference()}
        <NounReference />
    {/snippet}
</ClozeExercise>
