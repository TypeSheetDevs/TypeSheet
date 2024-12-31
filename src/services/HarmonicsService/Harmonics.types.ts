import { ChordType } from '@services/HarmonicsService/Harmonics.chords.enums';

export type ChordInfo = {
    rootPitch: string;
    octave: number;
    chordType: ChordType;
    canBeTonic: boolean;
};
