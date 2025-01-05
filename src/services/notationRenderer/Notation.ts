import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { FileService } from '@services/FileService/FileService';
import { NotationData } from '@services/notationRenderer/DataStructures/IRecoverable.types';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';

export class Notation implements IRecoverable<Notation> {
    private static _instance: Notation = null!;
    private _fileService: FileService = FileService.getInstance();
    static getInstance() {
        return Notation._instance || new Notation();
    }

    private staves: RenderableStave[] = [];
    // TODO: use them in NotationRenderer
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

    public async SaveToJson(): Promise<void> {
        try {
            const notationData: NotationData = {
                title: this.title,
                author: this.author,
                stavesData: [],
            };
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
            this.RecoverFromNotationData(notationData);
        } catch (error) {
            console.warn(`Error saving to JSON: ${(error as Error).message}`);
        }
    }

    private RecoverFromNotationData(notationData: NotationData) {
        this.title = notationData.title;
        this.author = notationData.author;
    }

    FromData<NotationData>(data: NotationData): Notation {
        console.log(data);
        return null!;
    }
}
