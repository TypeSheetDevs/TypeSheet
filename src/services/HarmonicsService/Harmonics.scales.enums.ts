export enum Mode {
    // Major
    Ionian = 'Ionian',
    Lydian = 'Lydian',
    Mixolydian = 'Mixolydian',
    // Minor
    Aeolian = 'Aeolian',
    Dorian = 'Dorian',
    Phrygian = 'Phrygian',
    Locrian = 'Locrian',
    HarmonicMinor = 'Harmonic Minor',
    MelodicMinor = 'Melodic Minor',
}

export type ModeType = 'minor' | 'major';

export const ModeTypes: Record<Mode, ModeType> = {
    [Mode.Ionian]: 'major',
    [Mode.Lydian]: 'major',
    [Mode.Mixolydian]: 'major',
    [Mode.Aeolian]: 'minor',
    [Mode.Dorian]: 'minor',
    [Mode.Phrygian]: 'minor',
    [Mode.Locrian]: 'minor',
    [Mode.HarmonicMinor]: 'minor',
    [Mode.MelodicMinor]: 'minor',
};

export const ScalePatterns: Record<Mode, number[]> = {
    [Mode.Ionian]: [2, 2, 1, 2, 2, 2, 1],
    [Mode.Lydian]: [2, 2, 2, 1, 2, 2, 1],
    [Mode.Mixolydian]: [2, 2, 1, 2, 2, 1, 2],
    [Mode.Aeolian]: [2, 1, 2, 2, 1, 2, 2],
    [Mode.Dorian]: [2, 1, 2, 2, 2, 1, 2],
    [Mode.Phrygian]: [1, 2, 2, 2, 1, 2, 2],
    [Mode.Locrian]: [1, 2, 2, 1, 2, 2, 2],
    [Mode.HarmonicMinor]: [2, 1, 2, 2, 1, 3, 1],
    [Mode.MelodicMinor]: [2, 1, 2, 2, 2, 2, 1],
};

export const NotesSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'B#'];
export const NotesFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'Cb'];
