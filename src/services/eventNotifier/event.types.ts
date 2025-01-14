type NotationEvent =
    | { name: 'needsRender' }
    | { name: 'toggleConfigManager' }
    | { name: 'numberOfStavesChanged'; params: number }
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
      }
    | {
          name: 'removeBar';
          params: {
              stave: boolean;
          };
      };
