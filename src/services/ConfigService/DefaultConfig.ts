import { ViewType } from '@layouts/MainView/MainView.types';
import { DefaultConfigType } from '@services/ConfigService/ConfigService.types';
import { NotationRenderEngine } from '@utils/getRendererEngine';

const DefaultConfig: DefaultConfigType = {
    StartingView: ViewType.Paged,
    BarsPerStave: 7,
    StaveMinimumHeightDistance: 40,
    MainViewMargin: 10,
    StavesPerPage: 4,
    TopBarColor: '#0E0B52',
    ToggleBubbleColor: '#0C4A6E',
    TopBarTextColor: '#e8eaed',
    HoveredNoteColor: '#0000ff',
    SelectedNoteColor: '#ff0000',
    TopBarHighlightColor: '#3fc2cb',
    RendererEngine: NotationRenderEngine.Canvas,
};

export default DefaultConfig;
