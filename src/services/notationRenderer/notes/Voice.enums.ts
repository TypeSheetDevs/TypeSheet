export enum HairpinType {
    Crescendo = 1,
    Decrescendo = 2,
}

export enum DynamicModifier {
    Pianissimo = 'pp',
    Piano = 'p',
    MezzoPiano = 'mp',
    MezzoForte = 'mf',
    Forte = 'f',
    Fortissimo = 'ff',
    Sforzando = 'sfz',
}

export function ParseDynamicModifier(modifierString: string): DynamicModifier | undefined {
    if (Object.values(DynamicModifier).includes(modifierString as DynamicModifier)) {
        return modifierString as DynamicModifier;
    }
    return undefined;
}
