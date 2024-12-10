type NotationEvent =
    | { name: 'needsRender' }
    | { name: 'numberOfStavesChanged'; params: number }
    | {
          name: 'clickedInsideRenderer';
          params: {
              positionX: number;
              positionY: number;
              startingStaveIndex: number;
              lastStaveIndex: number;
          };
      }
    | {
          name: 'movedInsideRenderer';
          params: {
              positionX: number;
              positionY: number;
              startingStaveIndex: number;
              lastStaveIndex: number;
          };
      };
