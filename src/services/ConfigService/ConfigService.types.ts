import { ViewType } from '@layouts/MainView/MainView.types';
import { NotationRenderEngine } from '@utils/getRendererEngine';

export type AppConfig = {
    configs: SavedParameter[];
};

export enum SavedParameterName {
    StartingView = 'StartingView',
    BarsPerStave = 'BarsPerStave',
    StaveMinimumHeightDistance = 'StaveMinimumHeightDistance',
    MainViewMargin = 'MainViewMargin',
    StavesPerPage = 'StavesPerPage',
    RendererEngine = 'RendererEngine',
    TopBarColor = 'TopBarColor',
    ToggleBubbleColor = 'ToggleBubbleColor',
    TopBarTextColor = 'TopBarTextColor',
    SelectedNoteColor = 'SelectedNoteColor',
    HoveredNoteColor = 'HoveredNoteColor',
    TopBarHighlightColor = 'TopBarHighlightColor',
}

export type SavedParameter =
    | { name: SavedParameterName.StartingView; value: ViewType }
    | { name: SavedParameterName.BarsPerStave; value: number }
    | { name: SavedParameterName.StaveMinimumHeightDistance; value: number }
    | { name: SavedParameterName.MainViewMargin; value: number }
    | { name: SavedParameterName.StavesPerPage; value: number }
    | { name: SavedParameterName.RendererEngine; value: NotationRenderEngine }
    | { name: SavedParameterName.TopBarColor; value: string }
    | { name: SavedParameterName.ToggleBubbleColor; value: string }
    | { name: SavedParameterName.TopBarTextColor; value: string }
    | { name: SavedParameterName.SelectedNoteColor; value: string }
    | { name: SavedParameterName.HoveredNoteColor; value: string }
    | { name: SavedParameterName.TopBarHighlightColor; value: string };

export type ValueOf<T extends SavedParameter['name']> = Extract<
    SavedParameter,
    { name: T }
>['value'];

export type DefaultConfigType = {
    [K in SavedParameter['name']]: Extract<SavedParameter, { name: K }>['value'];
};
