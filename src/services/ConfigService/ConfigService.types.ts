import { ViewType } from '@layouts/MainView/MainView.types';

export type AppConfig = {
    configs: SavedParameter[];
};

export type SavedParameter =
    | { name: 'StartingView'; value: ViewType }
    | { name: 'BarsPerStave'; value: number }
    | { name: 'StaveMinimumHeightDistance'; value: number }
    | { name: 'MainViewMargin'; value: number }
    | { name: 'StavesPerPage'; value: number }
    | { name: 'TopBarColor'; value: `#${string}` };

export type ValueOf<T extends SavedParameter['name']> = Extract<
    SavedParameter,
    { name: T }
>['value'];

export type DefaultConfigType = {
    [K in SavedParameter['name']]: Extract<SavedParameter, { name: K }>['value'];
};
