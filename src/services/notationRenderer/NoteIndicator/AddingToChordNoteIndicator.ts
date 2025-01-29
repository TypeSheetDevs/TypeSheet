import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Key } from '@services/notationRenderer/notes/Key';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { Notation } from '@services/notationRenderer/Notation';
import { ParseKeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export class AddingToChordNoteIndicator extends NoteIndicator {
    private noteData: ChosenEntityData;
    private actualKey: Key;
    private actualKeyIndex: number = -1;
    private visible: boolean = true;
    //TODO: Add component with accidentals
    constructor(notation: Notation) {
        super(notation);
        this.noteData = new ChosenEntityData(notation);
        this.actualKey = new Key('c/5');
        this.actualKey.Modifier = this.Accidental;
        this.actualKey.Color = ConfigService.getInstance().getValue(
            SavedParameterName.HoveredNoteColor,
        );
        EventNotifier.AddListener('midiPlayed', this.HandlePlayedMidi.bind(this));
    }

    private HandlePlayedMidi(keys: string[]) {
        if (!this.noteData.Note) return;

        keys.forEach((key: string) => {
            this.noteData.Note?.AddKey(new Key(key, ParseKeyModifier(key[1])));
        });
        this.RefreshIndicator();
    }

    private AdjustPitch(positionY: number) {
        if (!this.noteData.Note || !this.noteData.Bar) return;
        this.actualKey.Pitch = this.noteData.Bar.getKeyByPositionY(positionY).Pitch;
        this.AddActualKey();
    }

    private RemoveActualKeyIfVisible() {
        if (this.actualKeyIndex <= -1 || !this.visible) {
            this.actualKeyIndex = -1;
            return;
        }
        this.noteData.Note?.RemoveKey(this.actualKeyIndex);
        this.actualKeyIndex = -1;
        this.visible = false;
    }

    private AddActualKey() {
        if (this.actualKeyIndex >= 0) {
            return;
        }

        this.actualKeyIndex = this.noteData.Note?.KeysLength ?? -1;

        if (this.actualKeyIndex == -1) {
            return;
        }

        this.visible = this.noteData.Note?.AddKey(this.actualKey) ?? false;
    }

    private MoveFromOneNoteToAnother(noteData: ChosenEntityData) {
        this.RemoveActualKeyIfVisible();
        this.noteData.SetNoteIndex(noteData.StaveIndex, noteData.BarIndex, noteData.NoteIndex);
        this.AddActualKey();
    }

    protected RefreshIndicator(): void {
        EventNotifier.Notify('needsRender');
    }
    public OnCreation(): void {}

    public OnDestroy(): void {
        this.RemoveActualKeyIfVisible();
        EventNotifier.RemoveListener('midiPlayed', this.HandlePlayedMidi.bind(this));
    }
    public MovedAtNote(noteData: ChosenEntityData, positionY: number): void {
        if (noteData.Note) {
            this.MoveFromOneNoteToAnother(noteData);
        }
        this.AdjustPitch(positionY);
    }
    public OnMouseClick(): void {
        if (!this.noteData.Note) {
            this.visible = false;
            return;
        }
        this.RemoveActualKeyIfVisible();
        this.noteData.Note.AddKey(new Key(this.actualKey.Pitch, this.actualKey.Modifier));
        this.actualKeyIndex = -1;
        this.visible = false;
    }
}
