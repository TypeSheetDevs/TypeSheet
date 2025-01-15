export enum NoteDuration {
    Whole = 'w',
    Half = 'h',
    Quarter = 'q',
    Eighth = '8',
    Sixteenth = '16',
    ThirtySecond = '32',
    SixtyFourth = '64',
    OneTwentyEighth = '128',
    WholeRest = 'wr',
    HalfRest = 'hr',
    QuarterRest = 'qr',
    EighthRest = '8r',
    SixteenthRest = '16r',
    ThirtySecondRest = '32r',
    SixtyFourthRest = '64r',
    OneTwentyEighthRest = '128r',
}

export const Rests = [
    NoteDuration.WholeRest,
    NoteDuration.HalfRest,
    NoteDuration.QuarterRest,
    NoteDuration.EighthRest,
    NoteDuration.SixteenthRest,
    NoteDuration.ThirtySecondRest,
    NoteDuration.SixtyFourthRest,
    NoteDuration.OneTwentyEighthRest,
];

export const NoteDurationValues = {
    [NoteDuration.Whole]: 4,
    [NoteDuration.Half]: 2,
    [NoteDuration.Quarter]: 1,
    [NoteDuration.Eighth]: 0.5,
    [NoteDuration.Sixteenth]: 0.25,
    [NoteDuration.ThirtySecond]: 0.125,
    [NoteDuration.SixtyFourth]: 0.0625,
    [NoteDuration.OneTwentyEighth]: 0.03125,
    [NoteDuration.WholeRest]: 4,
    [NoteDuration.HalfRest]: 2,
    [NoteDuration.QuarterRest]: 1,
    [NoteDuration.EighthRest]: 0.5,
    [NoteDuration.SixteenthRest]: 0.25,
    [NoteDuration.ThirtySecondRest]: 0.125,
    [NoteDuration.SixtyFourthRest]: 0.0625,
    [NoteDuration.OneTwentyEighthRest]: 0.03125,
};

export enum NoteModifier {
    Staccato = 'a.',
    Staccatissimo = 'a..',
    Tenuto = 'a-',
    Accent = 'a>',
    Marcato = 'a^',
    Fermata = 'a@a',
}
