import MusicSingleton from '@services/core/Notes';
import { RenderContext, Stave } from 'vexflow';

export class NoteRenderer {
    context: RenderContext;
    Width: number;

    constructor(context: RenderContext, containerWidth: number) {
        this.context = context;
        this.Width = containerWidth;

        MusicSingleton.setRedrawFunction(this.Draw);
    }

    Draw() {
        const stave = new Stave(10, 0, this.Width - 22);
        stave.setContext(this.context).draw();
    }
}
