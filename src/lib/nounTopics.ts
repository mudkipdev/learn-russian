import type { Topic, TopicGroup } from "./topics";

export const NOUN_TOPIC_GROUPS: TopicGroup[] = [
    {
        label: "Singular",
        topics: [
            { key: "accusative", label: "Accusative" },
            { key: "genitive", label: "Genitive" },
            { key: "dative", label: "Dative" },
            { key: "instrumental", label: "Instrumental" },
            { key: "prepositional", label: "Prepositional" },
        ],
    },
    {
        label: "Plural",
        topics: [
            { key: "nominative-plural", label: "Nominative pl." },
            { key: "genitive-plural", label: "Genitive pl." },
        ],
    },
];

export const NOUN_TOPICS: Topic[] = NOUN_TOPIC_GROUPS.flatMap((group) => group.topics);
