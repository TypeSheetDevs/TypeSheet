import { ViewType } from '@pages/MainView/MainView.types';

type AppConfig = {
    configs: SavedParameter[];
};

type SavedParameter =
    | { name: 'StartingView'; value: ViewType }
    | { name: 'BarsPerStave'; value: number }
    | { name: 'StaveMinimumHeightDistance'; value: number }
    | { name: 'MainViewMargin'; value: number }
    | { name: 'StavesPerPage'; value: number }
    | { name: 'TopBarColor'; value: string };

type ValueOf<T extends SavedParameter['name']> = Extract<SavedParameter, { name: T }>['value'];
