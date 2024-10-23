import { barsPerStave, staveMinimumHeightDistance } from '@data/config';
import { RenderContext } from 'vexflow';
import Music from '@services/core/Notes';

export class NoteRenderer {
    context: RenderContext;
    Width: number;
    Clear: () => void;

    MusicInstance: Music;

    constructor(context: RenderContext, containerWidth: number, clearFunction: () => void) {
        this.context = context;
        this.Width = containerWidth;
        this.Clear = clearFunction;

        this.MusicInstance = Music.getInstance();
        this.MusicInstance.SetRedrawFunction(() => this.Draw());
    }

    Draw() {
        this.Clear();
        const margin = 10;
        const barLenght = (this.Width - margin * 2) / barsPerStave;
        const barHeight = this.MusicInstance.bars.forEach((bar, i) => {
            bar.setX(margin + barLenght * (i % barsPerStave));
            bar.setY((bar.getHeight() + staveMinimumHeightDistance) * Math.trunc(i / barsPerStave));
            bar.setWidth(barLenght);

            bar.setContext(this.context).draw();
        });
    }
}
