export type NotationData = {
    title: string;
    author: string;
    stavesData: RenderableStaveData[];
};

export type RenderableStaveData = {
    barsData: RenderableBarData[];
};

export type RenderableBarData = {
    voicesData: RenderableVoiceData[];
    ratio: number;
};

export type RenderableVoiceData = {
    notesData: RenderableNoteData[];
    beatValue: number;
    ties: { firstIndex: number; lastIndex: number }[];
    hairpins: {
        firstIndex: number;
        lastIndex: number;
        type: number;
        position?: number;
    }[];
    dynamics: { modifier: string; noteIndex: number; line: number }[];
};

export type RenderableNoteData = {
    keysData: KeyData[];
    modifiers: string[];
    duration: string;
    dotted: boolean;
    color?: string;
};

export type KeyData = {
    pitch: string;
    modifier?: string;
};
