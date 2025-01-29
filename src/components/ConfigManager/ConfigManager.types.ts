/* eslint-disable @typescript-eslint/no-explicit-any */

import { SavedParameterName, ValueOf } from '@services/ConfigService/ConfigService.types';
import { ViewType } from '@layouts/MainView/MainView.types';
import { NotationRenderEngine } from '@utils/getRendererEngine';

export enum EditorType {
    Text,
    Number,
    Color,
    Enum,
}

export type Validator<T> = (value: T) => boolean;

export type EditorConfig<T> = {
    editorType: EditorType;
    validators?: Validator<T>[];
    extraParams?: { [key: string]: any };
};

export type EditorConfigMapType = {
    [key in SavedParameterName]: EditorConfig<ValueOf<key>>;
};

export const EditorConfigMap: EditorConfigMapType = {
    [SavedParameterName.StartingView]: {
        editorType: EditorType.Enum,
        extraParams: {
            options: [ViewType.Paged, ViewType.Scrollable],
        },
    },
    [SavedParameterName.BarsPerStave]: {
        editorType: EditorType.Number,
        extraParams: {
            min: 1,
            max: 10,
        },
    },
    [SavedParameterName.StaveMinimumHeightDistance]: {
        editorType: EditorType.Number,
        extraParams: {
            min: 20,
            max: 60,
        },
    },
    [SavedParameterName.MainViewMargin]: {
        editorType: EditorType.Number,
        extraParams: {
            min: 5,
            max: 20,
        },
    },
    [SavedParameterName.StavesPerPage]: {
        editorType: EditorType.Number,
        extraParams: {
            min: 10,
            max: 40,
        },
    },
    [SavedParameterName.TopBarColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.TopBarHighlightColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.TopBarTextColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.SelectedNoteColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.HoveredNoteColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.ToggleBubbleColor]: {
        editorType: EditorType.Color,
    },
    [SavedParameterName.RendererEngine]: {
        editorType: EditorType.Enum,
        extraParams: {
            options: [NotationRenderEngine.SVG, NotationRenderEngine.Canvas],
        },
    },
};
