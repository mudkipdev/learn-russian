import type { Topic, TopicGroup } from "./topics";

export const PRONOUN_TOPIC_GROUPS: TopicGroup[] = [
    {
        label: "Personal",
        topics: [
            { key: "ya", label: "я" },
            { key: "ty", label: "ты" },
            { key: "on", label: "он" },
            { key: "ona", label: "она" },
            { key: "ono", label: "оно" },
            { key: "my", label: "мы" },
            { key: "vy", label: "вы" },
            { key: "oni", label: "они" },
        ],
    },
    {
        label: "Possessive",
        topics: [
            { key: "moy", label: "мой" },
            { key: "tvoy", label: "твой" },
            { key: "nash", label: "наш" },
            { key: "vash", label: "ваш" },
            { key: "svoy", label: "свой" },
        ],
    },
];

export const PRONOUN_TOPICS: Topic[] = PRONOUN_TOPIC_GROUPS.flatMap((group) => group.topics);

// Second selection axis: which case to drill. Keys match each item's badge string.
export const PRONOUN_FILTER_GROUPS: TopicGroup[] = [
    {
        label: "Case",
        topics: [
            { key: "Nominative", label: "Nominative" },
            { key: "Accusative", label: "Accusative" },
            { key: "Genitive", label: "Genitive" },
            { key: "Dative", label: "Dative" },
            { key: "Instrumental", label: "Instrumental" },
            { key: "Prepositional", label: "Prepositional" },
        ],
    },
];
