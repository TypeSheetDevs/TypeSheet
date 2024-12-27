import { ViewType } from '@layouts/MainView/MainView.types';

export type AppConfig = {
    configs: SavedParameter[];
};

export enum SavedParameterName {
    StartingView = 'StartingView',
    BarsPerStave = 'BarsPerStave',
    StaveMinimumHeightDistance = 'StaveMinimumHeightDistance',
    MainViewMargin = 'MainViewMargin',
    StavesPerPage = 'StavesPerPage',
    TopBarColor = 'TopBarColor',
}

export type SavedParameter =
    | { name: SavedParameterName.StartingView; value: ViewType }
    | { name: SavedParameterName.BarsPerStave; value: number }
    | { name: SavedParameterName.StaveMinimumHeightDistance; value: number }
    | { name: SavedParameterName.MainViewMargin; value: number }
    | { name: SavedParameterName.StavesPerPage; value: number }
    | { name: SavedParameterName.TopBarColor; value: string };

export type ValueOf<T extends SavedParameter['name']> = Extract<
    SavedParameter,
    { name: T }
>['value'];

export type DefaultConfigType = {
    [K in SavedParameter['name']]: Extract<SavedParameter, { name: K }>['value'];
};
