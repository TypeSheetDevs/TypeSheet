export enum Scale {
    Ionian = 'Ionian',
    Lydian = 'Lydian',
    Mixolydian = 'Mixolydian',
    Aeolian = 'Aeolian',
    Dorian = 'Dorian',
    Phrygian = 'Phrygian',
    Locrian = 'Locrian',
    HarmonicMinor = 'Harmonic Minor',
    MelodicMinor = 'Melodic Minor',
}

export const ScalePatterns: Record<Scale, number[]> = {
    [Scale.Ionian]: [2, 2, 1, 2, 2, 2, 1],
    [Scale.Lydian]: [2, 2, 2, 1, 2, 2, 1],
    [Scale.Mixolydian]: [2, 2, 1, 2, 2, 1, 2],
    [Scale.Aeolian]: [2, 1, 2, 2, 1, 2, 2],
    [Scale.Dorian]: [2, 1, 2, 2, 2, 1, 2],
    [Scale.Phrygian]: [1, 2, 2, 2, 1, 2, 2],
    [Scale.Locrian]: [1, 2, 2, 1, 2, 2, 2],
    [Scale.HarmonicMinor]: [2, 1, 2, 2, 1, 3, 1],
    [Scale.MelodicMinor]: [2, 1, 2, 2, 2, 2, 1],
};
