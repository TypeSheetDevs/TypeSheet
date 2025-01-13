import { ChordType } from '@services/HarmonicsService/Harmonics.chords.enums';

export type ChordInfo = {
    rootPitch: string;
    octave: number;
    chordType: ChordType;
    canBeTonic: boolean;
};

export const Notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const ChromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const ChromaticScaleMap: Record<string, string> = {
    Cb: 'B',
    Db: 'C#',
    Eb: 'D#',
    Fb: 'E',
    Gb: 'F#',
    Ab: 'G#',
    Bb: 'A#',
    Cbb: 'Bb',
    Dbb: 'C',
    Ebb: 'D',
    Fbb: 'Eb',
    Gbb: 'F',
    Abb: 'G',
    Bbb: 'A',
    'B#': 'C',
    'C##': 'D',
    'D##': 'E',
    'E##': 'F#',
    'F##': 'G',
    'G##': 'A',
    'A##': 'B',
    'B##': 'C#',
};
