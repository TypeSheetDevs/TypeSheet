import { ChordType } from '@services/HarmonicsService/Harmonics.enum';

export type ChordInfo = {
    rootPitch: string;
    octave: number;
    chordType: ChordType;
    canBeTonic: boolean;
};
