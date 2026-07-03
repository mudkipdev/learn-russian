<script lang="ts">
    let { text }: { text: string } = $props();

    const segments = $derived.by(() => {
        const result: { text: string; stressed: boolean }[] = [];
        let buffer = "";
        for (let index = 0; index < text.length; index++) {
            if (text[index + 1] === "́") {
                if (buffer) result.push({ text: buffer, stressed: false });
                result.push({ text: text[index], stressed: true });
                buffer = "";
                index++;
            } else {
                buffer += text[index];
            }
        }
        if (buffer) result.push({ text: buffer, stressed: false });
        return result;
    });
</script>

{#each segments as segment}{#if segment.stressed}<span class="stress relative">{segment.text}</span
        >{:else}{segment.text}{/if}{/each}

<style>
    .stress::after {
        content: "´";
        position: absolute;
        top: -0.34em;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75em;
        line-height: 1;
    }
</style>
