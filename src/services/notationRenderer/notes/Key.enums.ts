export enum KeyModifier {
    Sharp = '#',
    DoubleSharp = '##',
    Flat = 'b',
    DoubleFlat = 'bb',
    Natural = 'n',
}

export function ParseKeyModifier(durationString: string): KeyModifier | null {
    if (Object.values(KeyModifier).includes(durationString as KeyModifier)) {
        return KeyModifier[durationString as keyof typeof KeyModifier];
    }
    return null;
}
