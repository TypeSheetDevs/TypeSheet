import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';

export abstract class NoteIndicator {
    protected noteDuration: NoteDuration = NoteDuration.Eighth;
    protected isDotted: boolean = false;
    protected isRest: boolean = false;
    protected accidental: KeyModifier | undefined;

    protected abstract RefreshIndicator(): void;
    public abstract OnCreation(): void;
    public abstract OnDestroy(): void;
    public abstract MovedAtNote(noteData: ChosenEntityData, positionY: number): void;
    public abstract OnMouseClick(): void;

    public set Dotted(value: boolean) {
        this.isDotted = value;
        this.RefreshIndicator();
    }

    public set NoteDuration(duration: NoteDuration) {
        this.noteDuration = duration;
        this.RefreshIndicator();
    }

    public set IsRest(isRest: boolean) {
        this.isRest = isRest;
        this.RefreshIndicator();
    }

    public set Accidental(accidental: KeyModifier | undefined) {
        this.accidental = accidental;
        this.RefreshIndicator();
    }
}
