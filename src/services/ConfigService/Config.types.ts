import { ConfigKey } from './ConfigKey';

export type ConfigTypes = {
    [ConfigKey.StartingView]: string;
    [ConfigKey.BarsPerStave]: number;
    [ConfigKey.StaveMinimumHeightDistance]: number;
    [ConfigKey.MainViewMargin]: number;
    [ConfigKey.StavesPerPage]: number;
    [ConfigKey.TopBarColor]: string;
};
