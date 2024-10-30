import { barsPerStave, staveMinimumHeightDistance } from '@data/config';
import { BarlineType, RenderContext } from 'vexflow';
import Music from '@services/core/Music';
import RenderableStave from './RenderableStave';

export class NotationRenderer {
    context: RenderContext;
    width: number;
    Clear: () => void;
    staves: RenderableStave[] = [];

    constructor(context: RenderContext, containerWidth: number, clearFunction: () => void) {
        this.context = context;
        this.width = containerWidth;
        this.Clear = clearFunction;

        for (let i = 0; i < 10; i++)
            this.staves.push(
                new RenderableStave(containerWidth, i > 0 ? this.staves[i - 1] : undefined),
            );
    }

    Render() {
        this.Clear();
        const margin = 10;
        const barLenght = (this.width - margin * 2) / barsPerStave;
        this.staves.forEach(stave => stave.Draw(this.context));
    }
}
