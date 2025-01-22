type NotationEvent =
    | { name: 'needsRender' }
    | { name: 'toggleConfigManager' }
    | { name: 'removeBar' }
    | { name: 'removeStave' }
    | { name: 'startAddingNotes' }
    | { name: 'startRemovingNotes' }
    | { name: 'startAddingSignature' }
    | { name: 'numberOfStavesChanged'; params: number }
    | { name: 'metaDataSet'; params: number }
    | { name: 'viewportChanged'; params: RenderArguments }
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
      };
