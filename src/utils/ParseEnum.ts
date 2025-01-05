export default function ParseEnum<TEnum>(
    enumType: TEnum,
    value: string,
): TEnum[keyof TEnum] | null {
    if (Object.values(enumType as never).includes(value as TEnum[keyof TEnum])) {
        return enumType[value as keyof TEnum];
    }
    return null;
}
