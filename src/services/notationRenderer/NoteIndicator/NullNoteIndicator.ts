import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';

export class NullNoteIndicator extends NoteIndicator {
    protected RefreshIndicator(): void {}
    public OnCreation(): void {}
    public OnDestroy(): void {}
    public MovedAtNote(_noteData: ChosenEntityData, _positionY: number): void {}
    public OnMouseClick(): void {}
}
