import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { FileService } from '@services/FileService/FileService';
import { NotationData } from '@services/notationRenderer/DataStructures/IRecoverable.types';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';

export class Notation implements IRecoverable<NotationData> {
    private static _instance: Notation = null!;
    private _fileService: FileService = FileService.getInstance();
    static getInstance() {
        return Notation._instance || new Notation();
    }

    staves: RenderableStave[] = [];
    private title: string = '';
    private author: string = '';

    constructor() {
        if (Notation._instance === null) {
            Notation._instance = this;
            return this;
        } else return Notation._instance;
    }
    AddNewBar(newLine: boolean, staveIndex: number, barIndex?: number) {
        if (staveIndex >= this.staves.length) {
            this.staves.push(new RenderableStave(1));
            EventNotifier.Notify('numberOfStavesChanged', this.staves.length);
            return;
        }

        if (newLine) {
            this.staves.splice(staveIndex + 1, 0, new RenderableStave(1));
            EventNotifier.Notify('numberOfStavesChanged', this.staves.length);
            return;
        }

        this.staves[staveIndex].AddNewBar(barIndex);
        EventNotifier.Notify('needsRender');
    }
    RemoveStave(staveIndex: number) {
        if (staveIndex < 0 || staveIndex >= this.staves.length) return;
        this.staves.splice(staveIndex, 1);
        EventNotifier.Notify('numberOfStavesChanged', this.staves.length);
    }

    RemoveBar(staveIndex: number, barIndex: number) {}

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

    public async SaveToJson(): Promise<void> {
        try {
            const notationData = this.ToData();
            const filePath = await this._fileService.SaveFileDialog();
            await this._fileService.SaveFile(filePath, JSON.stringify(notationData));
        } catch (error) {
            console.warn(`Error saving to JSON: ${(error as Error).message}`);
        }
    }

    public async ReadFromJson(filePath?: string): Promise<void> {
        try {
            if (!filePath) {
                filePath = await this._fileService.ReadFileDialog();
            }
            const notationData = await this._fileService.ReadJsonFile<NotationData>(filePath);
            this.FromData(notationData);
            EventNotifier.Notify('needsRender');
            console.log(this);
        } catch (error) {
            console.warn(`Error reading from JSON: ${(error as Error).message}`);
        }
    }

    FromData(data: NotationData): Notation {
        this.title = data.title;
        this.author = data.author;
        this.staves = data.stavesData.map(staveData => RenderableStave.FromData(staveData));
        return this;
    }

    ToData(): NotationData {
        return {
            title: this.title,
            author: this.author,
            stavesData: this.staves.map(stave => stave.ToData()),
        };
    }
}
