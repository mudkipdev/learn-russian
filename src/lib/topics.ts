export interface Topic {
    key: string;
    label: string;
}

export interface TopicGroup {
    label: string;
    topics: Topic[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
    {
        label: "Present",
        topics: [
            { key: "type1", label: "Type 1" },
            { key: "type2", label: "Type 2" },
            { key: "type1b", label: "Type 1B" },
            { key: "mutation", label: "Mutation" },
            { key: "ovat", label: "-овать" },
            { key: "avat", label: "-авать" },
            { key: "reflexive", label: "Reflexive" },
            { key: "irregular", label: "Irregular" },
        ],
    },
    {
        label: "Past",
        topics: [{ key: "past", label: "Past tense" }],
    },
    {
        label: "Future",
        topics: [{ key: "future", label: "Future tense" }],
    },
];

export const TOPICS: Topic[] = TOPIC_GROUPS.flatMap((group) => group.topics);
