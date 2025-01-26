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

export function ParseNoteDuration(durationString: string): NoteDuration | undefined {
    if (Object.values(NoteDuration).includes(durationString as NoteDuration)) {
        return durationString as NoteDuration;
    }
    return undefined;
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

// used for enumerating over NoteDuration in order
export const NoteDurationOrder = [
    NoteDuration.Whole,
    NoteDuration.Half,
    NoteDuration.Quarter,
    NoteDuration.Eighth,
    NoteDuration.Sixteenth,
    NoteDuration.ThirtySecond,
    NoteDuration.SixtyFourth,
    NoteDuration.OneTwentyEighth,
];

export enum NoteModifier {
    Staccato = 'a.',
    Staccatissimo = 'a..',
    Tenuto = 'a-',
    Accent = 'a>',
    Marcato = 'a^',
    Fermata = 'a@a',
}

export function ParseNoteModifier(modifierString: string): NoteModifier | undefined {
    if (Object.values(NoteModifier).includes(modifierString as NoteModifier)) {
        return modifierString as NoteModifier;
    }
    return undefined;
}

export function toRest(note: NoteDuration): NoteDuration {
    if (note.endsWith('r')) {
        return note;
    }
    return `${note}r` as NoteDuration;
}

export function IsRest(durationString: string): boolean {
    return Rests.includes(durationString as NoteDuration);
}

export function RestToNote(note: NoteDuration): NoteDuration {
    if (note.endsWith('r')) {
        return note.slice(0, -1) as NoteDuration;
    }
    return note;
}
