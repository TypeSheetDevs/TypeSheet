export enum KeyModifier {
    Sharp = '#',
    DoubleSharp = '##',
    Flat = 'b',
    DoubleFlat = 'bb',
    Natural = 'n',
}

export function ParseKeyModifier(modifierString?: string): KeyModifier | undefined {
    if (!modifierString || Object.values(KeyModifier).includes(modifierString as KeyModifier))
        return undefined;
    return KeyModifier[modifierString as keyof typeof KeyModifier];
}
