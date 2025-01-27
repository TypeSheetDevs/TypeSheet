import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export type AccidentalData = {
    accidental: KeyModifier;
    pitch: string;
    allOctaves: boolean;
    startIndex: number;
};
