import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { NoteDuration, NoteModifier } from '@services/notationRenderer/notes/Notes.enums';

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
    duration: NoteDuration;
    modifiers: NoteModifier[];
    dotted: boolean;
    color?: string;
};

export type KeyData = {
    pitch: string;
    modifier: KeyModifier | null;
};
