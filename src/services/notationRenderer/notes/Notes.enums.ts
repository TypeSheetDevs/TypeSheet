export enum NoteDuration {
    Whole = 'w',
    Half = 'h',
    Quarter = 'q',
    Eighth = '8',
    Sixteenth = '16',
    ThirtySecond = '32',
    SixtyFourth = '64',
    OneTwentyEighth = '128',
}

export function ParseNoteDuration(durationString: string): NoteDuration | null {
    if (Object.values(NoteDuration).includes(durationString as NoteDuration)) {
        return NoteDuration[durationString as keyof typeof NoteDuration];
    }
    return null;
}

export const NoteDurationValues = {
    [NoteDuration.Whole]: 4,
    [NoteDuration.Half]: 2,
    [NoteDuration.Quarter]: 1,
    [NoteDuration.Eighth]: 0.5,
    [NoteDuration.Sixteenth]: 0.25,
    [NoteDuration.ThirtySecond]: 0.125,
    [NoteDuration.SixtyFourth]: 0.0625,
    [NoteDuration.OneTwentyEighth]: 0.03125,
};

export enum NoteModifier {
    Staccato = 'a.',
    Staccatissimo = 'a..',
    Tenuto = 'a-',
    Accent = 'a>',
    Marcato = 'a^',
    Fermata = 'a@a',
}

export function ParseNoteModifier(modifierString: string): NoteModifier | null {
    if (Object.values(NoteModifier).includes(modifierString as NoteModifier)) {
        return NoteModifier[modifierString as keyof typeof NoteModifier];
    }
    return null;
}
