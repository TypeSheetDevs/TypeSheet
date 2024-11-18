export function castNumber(value: string): number | null {
    const castValue = parseInt(value);
    return !isNaN(castValue) ? castValue : null;
}
