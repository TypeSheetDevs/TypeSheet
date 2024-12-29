import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { HarmonicsService } from '@services/HarmonicsService/HarmonicsService';

export class Notation {
    private static _instance: Notation = null!;
    static getInstance() {
        return Notation._instance || new Notation();
    }

    staves: RenderableStave[] = [];

    constructor() {
        if (Notation._instance === null) {
            Notation._instance = this;
            HarmonicsService.IdentifyChord(['C3', 'E-3', 'G-3']);
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
}
