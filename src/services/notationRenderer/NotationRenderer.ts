import { RenderContext } from 'vexflow';
import RenderableStave from './RenderableStave';

export class NotationRenderer {
    static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    context: RenderContext | null;
    width: number;
    height: number;
    staves: RenderableStave[] = [];

    constructor() {
        this.width = 0;
        this.height = 0;
        this.context = null;

        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            return this;
        } else return NotationRenderer._instance;
    }

    setContext(context: RenderContext) {
        this.context = context;

        this.Render();
    }

    Resize(width, height) {
        this.width = width;
        this.height = height;

        this.Render();
    }

    GetStavePositionY(index: number) {
        if (index <= 0) return 0;
        return this.staves[index - 1].currentPositionY;
    }

    AddNewStave(numberOfBars?: number) {
        this.staves.push(new RenderableStave(numberOfBars));
        this.Render();
    }

    Render() {
        if (this.context === null) {
            return;
        }

        this.context.clear();
        this.staves.forEach((stave, idx) =>
            stave.Draw(this.context!, this.width - 1, this.GetStavePositionY(idx)),
        );
        console.log(this.staves);
    }
}
