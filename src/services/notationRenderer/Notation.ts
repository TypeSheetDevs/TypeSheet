import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { HarmonicsService } from '@services/HarmonicsService/HarmonicsService';
import { Mode } from '@services/HarmonicsService/Harmonics.scales.enums';

export class Notation {
    private static _instance: Notation = null!;
    static getInstance() {
        return Notation._instance || new Notation();
    }

    staves: RenderableStave[] = [];

    constructor() {
        if (Notation._instance === null) {
            HarmonicsService.GenerateScale('E#', Mode.Locrian).forEach(note => console.log(note));
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
}
