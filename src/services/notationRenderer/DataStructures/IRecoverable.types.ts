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
};

export type RenderableNoteData = {
    keysData: KeyData[];
    duration: string;
    modifiers: string[];
    dotted: boolean;
    color: string | null;
};

export type KeyData = {
    pitch: string;
    modifier?: string;
};
