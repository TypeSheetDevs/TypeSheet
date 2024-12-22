type NotationEvent =
    | { name: 'needsRender' }
    | { name: 'numberOfStavesChanged'; params: number }
    | { name: 'resized'; params: { width: number; height: number } }
    | { name: 'viewportChanged'; params: RenderArguments }
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
    | { name: 'toggleConfigManager' };
