import { ConfigKey } from './ConfigKey';
import { castNumber } from './ConfigService.functions';

export type ConfigTypes = {
    [ConfigKey.StartingView]: number;
    [ConfigKey.BarsPerStave]: number;
    [ConfigKey.StaveMinimumHeightDistance]: number;
    [ConfigKey.MainViewMargin]: number;
    [ConfigKey.StavesPerPage]: number;
    [ConfigKey.TopBarColor]: string;
};

export const DefaultConfig: ConfigTypes = {
    [ConfigKey.StartingView]: 1,
    [ConfigKey.BarsPerStave]: 7,
    [ConfigKey.StaveMinimumHeightDistance]: 40,
    [ConfigKey.MainViewMargin]: 10,
    [ConfigKey.StavesPerPage]: 4,
    [ConfigKey.TopBarColor]: '#0E0B52',
};

export const TypeCasters: { [K in keyof ConfigTypes]: (value: string) => ConfigTypes[K] | null } = {
    [ConfigKey.StartingView]: (value: string) => castNumber(value),
    [ConfigKey.BarsPerStave]: (value: string) => castNumber(value),
    [ConfigKey.StaveMinimumHeightDistance]: (value: string) => castNumber(value),
    [ConfigKey.MainViewMargin]: (value: string) => castNumber(value),
    [ConfigKey.StavesPerPage]: (value: string) => castNumber(value),
    [ConfigKey.TopBarColor]: (value: string) => value,
};
