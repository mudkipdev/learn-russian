<script lang="ts">
    import { Icon, Backspace } from "svelte-hero-icons";

    interface Key {
        code: string;
        letter: string;
        latin: string;
    }

    const ROWS: Key[][] = [
        [
            { code: "Backquote", letter: "ё", latin: "`" },
            { code: "KeyQ", letter: "й", latin: "q" },
            { code: "KeyW", letter: "ц", latin: "w" },
            { code: "KeyE", letter: "у", latin: "e" },
            { code: "KeyR", letter: "к", latin: "r" },
            { code: "KeyT", letter: "е", latin: "t" },
            { code: "KeyY", letter: "н", latin: "y" },
            { code: "KeyU", letter: "г", latin: "u" },
            { code: "KeyI", letter: "ш", latin: "i" },
            { code: "KeyO", letter: "щ", latin: "o" },
            { code: "KeyP", letter: "з", latin: "p" },
            { code: "BracketLeft", letter: "х", latin: "[" },
            { code: "BracketRight", letter: "ъ", latin: "]" },
        ],
        [
            { code: "KeyA", letter: "ф", latin: "a" },
            { code: "KeyS", letter: "ы", latin: "s" },
            { code: "KeyD", letter: "в", latin: "d" },
            { code: "KeyF", letter: "а", latin: "f" },
            { code: "KeyG", letter: "п", latin: "g" },
            { code: "KeyH", letter: "р", latin: "h" },
            { code: "KeyJ", letter: "о", latin: "j" },
            { code: "KeyK", letter: "л", latin: "k" },
            { code: "KeyL", letter: "д", latin: "l" },
            { code: "Semicolon", letter: "ж", latin: ";" },
            { code: "Quote", letter: "э", latin: "'" },
        ],
        [
            { code: "KeyZ", letter: "я", latin: "z" },
            { code: "KeyX", letter: "ч", latin: "x" },
            { code: "KeyC", letter: "с", latin: "c" },
            { code: "KeyV", letter: "м", latin: "v" },
            { code: "KeyB", letter: "и", latin: "b" },
            { code: "KeyN", letter: "т", latin: "n" },
            { code: "KeyM", letter: "ь", latin: "m" },
            { code: "Comma", letter: "б", latin: "," },
            { code: "Period", letter: "ю", latin: "." },
        ],
    ];

    let { onkey, onbackspace }: { onkey?: (letter: string) => void; onbackspace?: () => void } = $props();

    let pressed = $state<string[]>([]);

    function keyDown(event: KeyboardEvent) {
        if (!pressed.includes(event.code)) pressed = [...pressed, event.code];
    }

    function keyUp(event: KeyboardEvent) {
        pressed = pressed.filter((code) => code !== event.code);
    }
</script>

<svelte:window onkeydown={keyDown} onkeyup={keyUp} onblur={() => (pressed = [])} />

<div class="flex w-full flex-col gap-1.5 select-none">
    {#each ROWS as row}
        <div class="flex w-full justify-center gap-1.5">
            {#each row as key}
                <button
                    tabindex="-1"
                    onclick={() => onkey?.(key.letter)}
                    class="key relative flex h-10 cursor-pointer items-center justify-center border pt-1 text-[1.05rem] font-medium transition-all duration-100 active:scale-90 {pressed.includes(
                        key.code,
                    )
                        ? 'border-white bg-white text-black'
                        : 'border-line bg-bg hover:bg-fg/10 active:border-white active:bg-white active:text-black'}"
                >
                    {key.letter}
                    <span class="absolute top-0.5 right-1.5 text-[0.6rem] font-normal text-muted">{key.latin}</span>
                </button>
            {/each}
            {#if row === ROWS[ROWS.length - 1]}
                <button
                    tabindex="-1"
                    onclick={() => onbackspace?.()}
                    aria-label="Backspace"
                    class="key relative flex h-10 cursor-pointer items-center justify-center border border-line bg-bg text-[1.05rem] transition-all duration-100 hover:bg-fg/10 active:scale-90 active:border-white active:bg-white active:text-black"
                >
                    <Icon src={Backspace} size="18" mini />
                </button>
            {/if}
        </div>
    {/each}
</div>

<style>
    .key {
        width: calc((100% - 4.5rem) / 13);
    }
</style>
