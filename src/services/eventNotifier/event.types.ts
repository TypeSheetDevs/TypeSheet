import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';
import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export type NotationEvent =
    | { name: 'needsRender' }
    | { name: 'toggleConfigManager' }
    | { name: 'removeBar' }
    | { name: 'removeStave' }
    | { name: 'numberOfStavesChanged'; params: number }
    | { name: 'metaDataSet'; params: number }
    | { name: 'viewportChanged'; params: RenderArguments }
    | { name: 'rendererStateChanged'; params: NotationRendererState }
    | {
          name: 'toggleHarmonicsTooltip';
          params: {
              x: number;
              y: number;
              text: string;
          };
      }
    | {
          name: 'resized';
          params: {
              width: number;
              height: number;
          };
      }
    | {
          name: 'clickedInsideRenderer';
          params: {
              positionX: number;
              positionY: number;
          };
      }
    | {
          name: 'movedInsideRenderer';
          params: {
              positionX: number;
              positionY: number;
          };
      }
    | {
          name: 'addNewBar';
          params: {
              newStave: boolean;
          };
      }
    | {
          name: 'modifyingNoteSelectionChanged';
          params: {
              isRest: boolean;
              isDotted: boolean;
              duration: NoteDuration;
              accidental?: KeyModifier;
          };
      };
