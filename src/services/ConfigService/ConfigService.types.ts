import { ViewType } from '@layouts/MainView/MainView.types';

export type AppConfig = {
    configs: SavedParameter[];
};

export enum SavedParameterNames {
    StartingView = 'StartingView',
    BarsPerStave = 'BarsPerStave',
    StaveMinimumHeightDistance = 'StaveMinimumHeightDistance',
    MainViewMargin = 'MainViewMargin',
    StavesPerPage = 'StavesPerPage',
    TopBarColor = 'TopBarColor',
}

export type SavedParameter =
    | { name: SavedParameterNames.StartingView; value: ViewType }
    | { name: SavedParameterNames.BarsPerStave; value: number }
    | { name: SavedParameterNames.StaveMinimumHeightDistance; value: number }
    | { name: SavedParameterNames.MainViewMargin; value: number }
    | { name: SavedParameterNames.StavesPerPage; value: number }
    | { name: SavedParameterNames.TopBarColor; value: string };

export type ValueOf<T extends SavedParameter['name']> = Extract<
    SavedParameter,
    { name: T }
>['value'];

export type DefaultConfigType = {
    [K in SavedParameter['name']]: Extract<SavedParameter, { name: K }>['value'];
};
