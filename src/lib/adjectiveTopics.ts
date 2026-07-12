import type { Topic, TopicGroup } from "./topics";

export const ADJECTIVE_TOPIC_GROUPS: TopicGroup[] = [
    {
        label: "Nominative",
        topics: [
            { key: "masculine", label: "Masculine" },
            { key: "feminine", label: "Feminine" },
            { key: "neuter", label: "Neuter" },
            { key: "plural", label: "Plural" },
        ],
    },
    {
        label: "Cases",
        topics: [
            { key: "accusative", label: "Accusative" },
            { key: "genitive", label: "Genitive" },
            { key: "dative", label: "Dative" },
            { key: "instrumental", label: "Instrumental" },
            { key: "prepositional", label: "Prepositional" },
        ],
    },
];

export const ADJECTIVE_TOPICS: Topic[] = ADJECTIVE_TOPIC_GROUPS.flatMap((group) => group.topics);
