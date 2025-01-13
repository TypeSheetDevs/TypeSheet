export enum ChordType {
    MajorTriad = 'Major Triad',
    MinorTriad = 'Minor Triad',
    DiminishedTriad = 'Diminished Triad',
    AugmentedTriad = 'Augmented Triad',
    MajorSeventhChord = 'Major Seventh Chord',
    MinorSeventhChord = 'Minor Seventh Chord',
    DiminishedSeventhChord = 'Diminished Seventh Chord',
    DominantSeventhChord = 'Dominant Seventh Chord',
    HalfDiminishedSeventhChord = 'Half-Diminished Seventh Chord',
    Other = 'Other',
}

export const ChordTypeMusic21: { [key in ChordType]: string } = {
    [ChordType.MajorTriad]: 'major triad',
    [ChordType.MinorTriad]: 'minor triad',
    [ChordType.DiminishedTriad]: 'diminished triad',
    [ChordType.AugmentedTriad]: 'augmented triad',
    [ChordType.MajorSeventhChord]: 'major seventh chord',
    [ChordType.MinorSeventhChord]: 'minor seventh chord',
    [ChordType.DiminishedSeventhChord]: 'diminished seventh chord',
    [ChordType.DominantSeventhChord]: 'dominant seventh chord',
    [ChordType.HalfDiminishedSeventhChord]: 'half-diminished seventh chord',
    [ChordType.Other]: 'other',
};

export const ChordIntervals: { [key in ChordType]: number[] } = {
    [ChordType.MajorTriad]: [4, 7],
    [ChordType.MinorTriad]: [3, 7],
    [ChordType.DiminishedTriad]: [3, 6],
    [ChordType.AugmentedTriad]: [4, 8],
    [ChordType.MajorSeventhChord]: [4, 7, 11],
    [ChordType.MinorSeventhChord]: [3, 7, 10],
    [ChordType.DiminishedSeventhChord]: [3, 6, 9],
    [ChordType.DominantSeventhChord]: [4, 7, 10],
    [ChordType.HalfDiminishedSeventhChord]: [3, 6, 10],
    [ChordType.Other]: [],
};
