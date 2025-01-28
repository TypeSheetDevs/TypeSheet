import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';

export class MoveNoteIndicator extends NoteIndicator {
    protected RefreshIndicator(): void {
        throw new Error('Method not implemented.');
    }
    public OnCreation(): void {
        throw new Error('Method not implemented.');
    }
    public OnDestroy(): void {
        throw new Error('Method not implemented.');
    }
    public MovedAtNote(noteData: ChosenEntityData, positionY: number): void {
        throw new Error('Method not implemented.');
    }
    public OnMouseClick(): void {
        throw new Error('Method not implemented.');
    }
}
