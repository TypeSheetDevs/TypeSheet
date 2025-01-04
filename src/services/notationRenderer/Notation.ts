import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class Notation {
    private static _instance: Notation = null!;
    static getInstance() {
        return Notation._instance || new Notation();
    }

    private staves: RenderableStave[] = [];
    private title: string = '';
    private author: string = '';

    constructor() {
        if (Notation._instance === null) {
            Notation._instance = this;
            return this;
        } else return Notation._instance;
    }

    AddNewStave(numberOfBars?: number) {
        this.staves.push(new RenderableStave(numberOfBars));
        EventNotifier.Notify('numberOfStavesChanged', this.staves.length);
    }

    getStaves(): RenderableStave[] {
        return this.staves;
    }

    get Title(): string {
        return this.title;
    }

    set Title(value: string) {
        this.title = value;
    }

    get Author(): string {
        return this.author;
    }

    set Author(value: string) {
        this.author = value;
    }
}
