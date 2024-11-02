import { barsPerStave, staveMinimumHeightDistance } from '@data/config';
import { BarlineType, RenderContext } from 'vexflow';
import Music from '@services/core/Music';
import RenderableStave from './RenderableStave';

export class NotationRenderer {
    context: RenderContext | null;
    width: number;
    height: number;
    staves: RenderableStave[] = [];

    constructor() {
        this.width = 0;
        this.height = 0;
        this.context = null;
    }

    setContext(context: RenderContext) {
        this.context = context;

        this.Render();
    }

    Resize(width, height) {
        this.width = width;
        this.height = height;
        this.staves.pop();
        this.staves.push(new RenderableStave(width - 2));

        this.Render();
    }

    Render() {
        if (this.context === null) return;
        this.context.clear();
        this.staves.forEach(stave => stave.Draw(this.context));
    }
}
