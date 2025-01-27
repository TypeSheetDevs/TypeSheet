export enum KeySignature {
    C = 'C',
    G = 'G',
    D = 'D',
    A = 'A',
    E = 'E',
    B = 'B',
    'F#' = 'F#',
    'C#' = 'C#',
    F = 'F',
    'Bb' = 'Bb',
    'Eb' = 'Eb',
    'Ab' = 'Ab',
    'Db' = 'Db',
    'Gb' = 'Gb',
    'Cb' = 'Cb',
}

export type SignatureData = {
    startIndex: number;
    key: KeySignature;
};

const SignatureAccidentals: Record<KeySignature, string[]> = {
    [KeySignature.C]: [],
    [KeySignature.G]: ['F#'],
    [KeySignature.D]: ['F#', 'C#'],
    [KeySignature.A]: ['F#', 'C#', 'G#'],
    [KeySignature.E]: ['F#', 'C#', 'G#', 'D#'],
    [KeySignature.B]: ['F#', 'C#', 'G#', 'D#', 'A#'],
    [KeySignature['F#']]: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
    [KeySignature['C#']]: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'],
    [KeySignature.F]: ['Bb'],
    [KeySignature['Bb']]: ['Bb', 'Eb'],
    [KeySignature['Eb']]: ['Bb', 'Eb', 'Ab'],
    [KeySignature['Ab']]: ['Bb', 'Eb', 'Ab', 'Db'],
    [KeySignature['Db']]: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
    [KeySignature['Gb']]: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
    [KeySignature['Cb']]: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'],
};

export function GetSignatureAccidentals(signature: KeySignature) {
    return SignatureAccidentals[signature];
}
