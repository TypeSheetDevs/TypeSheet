export enum KeyModifier {
    Sharp = '#',
    DoubleSharp = '##',
    Flat = 'b',
    DoubleFlat = 'bb',
    Natural = 'n',
}

export function ParseKeyModifier(modifierString?: string): KeyModifier | undefined {
    if (Object.values(KeyModifier).includes(modifierString as KeyModifier)) {
        return modifierString as KeyModifier;
    }
    return undefined;
}
