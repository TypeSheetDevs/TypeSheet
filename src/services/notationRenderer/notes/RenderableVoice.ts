import { Beam, Formatter, RenderContext, Stave, StaveHairpin, StaveTie, Vex, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { HairpinType } from '@services/notationRenderer/notes/Voice.enums';

const POSITION_ABOVE = Vex.Flow.Articulation.Position.ABOVE;
const POSITION_BELOW = Vex.Flow.Articulation.Position.BELOW;

export class RenderableVoice implements IRenderable {
    private cachedVoice: Voice | null = null;
    private isVoiceDirty: boolean = true;

    private readonly notes: RenderableNote[];
    private ties: { firstIndex: number; lastIndex: number }[] = [];
    private hairpins: {
        firstIndex: number;
        lastIndex: number;
        type: HairpinType;
        position?: number;
    }[] = [];
    private numBeats: number;
    private beatValue: number;

    constructor(beatValue: number, notes: RenderableNote[] = []) {
        this.beatValue = beatValue;
        this.notes = notes;
        this.numBeats = this.CalculateNumBeats();
    }

    set BeatValue(beatValue: number) {
        this.beatValue = beatValue;
        this.isVoiceDirty = true;
    }

    SetNotesColor(color: string): void {
        this.notes.forEach(note => (note.Color = color));
        this.isVoiceDirty = true;
    }

    GetAsVexFlowVoice(): Voice {
        if (this.cachedVoice && !this.isVoiceDirty) {
            return this.cachedVoice;
        }

        const voice = new Voice({
            num_beats: this.numBeats,
            beat_value: this.beatValue,
        });

        voice.addTickables(this.notes.map(note => note.GetAsVexFlowNote()));

        this.cachedVoice = voice;
        this.isVoiceDirty = false;

        return voice;
    }

    Draw(context: RenderContext, bar: Stave, length: number): void {
        if (this.notes.length === 0) return;

        const voice = this.GetAsVexFlowVoice();
        new Formatter().joinVoices([voice]).format([voice], length - 20);

        const beams = Beam.applyAndGetBeams(voice);
        voice.draw(context, bar);
        beams.forEach(beam => beam.setContext(context).draw());

        this.DrawTies(context);
        this.DrawHairpins(context);

        const absoluteXs = voice.getTickables().map(t => t.getAbsoluteX());
        this.notes.forEach((note, index) => (note.AbsoluteX = absoluteXs[index]));
    }

    private DrawTies(context: RenderContext) {
        // if needed those could be cached
        this.ties.forEach(tie => {
            const staveTie = new StaveTie({
                first_note: this.notes[tie.firstIndex].GetAsVexFlowNote(),
                last_note: this.notes[tie.lastIndex].GetAsVexFlowNote(),
                first_indices: [0],
                last_indices: [0],
            });
            staveTie.setContext(context).draw();
        });
    }

    private DrawHairpins(context: RenderContext) {
        // if needed those could be cached
        this.hairpins.forEach(hairpin => {
            const firstNote = this.notes[hairpin.firstIndex];
            const lastNote = this.notes[hairpin.lastIndex];

            let usedPosition: number | undefined = hairpin.position;
            if (usedPosition === undefined) {
                usedPosition =
                    firstNote.GetModifierPosition() === POSITION_ABOVE &&
                    lastNote.GetModifierPosition() === POSITION_ABOVE
                        ? POSITION_ABOVE
                        : POSITION_BELOW;
            }

            const staveHairpin = new StaveHairpin(
                {
                    first_note: firstNote.GetAsVexFlowNote(),
                    last_note: lastNote.GetAsVexFlowNote(),
                },
                hairpin.type,
            );
            staveHairpin.setPosition(usedPosition);

            staveHairpin.setContext(context).draw();
        });
    }

    GetNoteIndexByPositionX(positionX: number): number {
        const positionsX = this.notes.map(n => n.AbsoluteX);
        console.log(positionX, positionsX);
        for (let i = 1; i < positionsX.length; i++) {
            const diff = positionsX[i] - positionsX[i - 1];
            if (positionX <= positionsX[i - 1] + diff / 2) return i - 1;
        }
        return positionsX.length - 1;
    }

    GetNote(index: number): RenderableNote {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        return this.notes[index];
    }

    AddNote(note: RenderableNote, index?: number): void {
        if (!note || note.KeysLength === 0) {
            throw new Error('Invalid note data provided.');
        }

        if (index !== undefined) {
            if (index < 0 || index > this.notes.length) {
                throw new Error('Index out of bounds.');
            }
            this.notes.splice(index, 0, note);

            this.ties.forEach(tie => {
                if (tie.firstIndex >= index) tie.firstIndex++;
                if (tie.lastIndex >= index) tie.lastIndex++;
            });

            this.hairpins.forEach(hairpin => {
                if (hairpin.firstIndex >= index) hairpin.firstIndex++;
                if (hairpin.lastIndex >= index) hairpin.lastIndex++;
            });
        } else {
            this.notes.push(note);
        }

        this.numBeats = this.CalculateNumBeats();
        this.isVoiceDirty = true;
    }

    RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        this.notes.splice(index, 1);

        this.ties = this.ties.filter(tie => tie.firstIndex !== index && tie.lastIndex !== index);
        this.hairpins = this.hairpins.filter(
            hairpin => hairpin.firstIndex !== index && hairpin.lastIndex !== index,
        );

        this.ties.forEach(tie => {
            if (tie.firstIndex > index) tie.firstIndex--;
            if (tie.lastIndex > index) tie.lastIndex--;
        });

        this.hairpins.forEach(hairpin => {
            if (hairpin.firstIndex > index) hairpin.firstIndex--;
            if (hairpin.lastIndex > index) hairpin.lastIndex--;
        });

        this.numBeats = this.CalculateNumBeats();
        this.isVoiceDirty = true;
    }

    AddTie(firstIndex: number, lastIndex: number): boolean {
        if (
            firstIndex < 0 ||
            firstIndex >= this.notes.length ||
            lastIndex < 0 ||
            lastIndex >= this.notes.length
        ) {
            return false;
        }

        this.ties.push({ firstIndex: firstIndex, lastIndex: lastIndex });
        return true;
    }

    RemoveTie(firstIndex: number, lastIndex: number): void {
        if (
            firstIndex < 0 ||
            firstIndex >= this.notes.length ||
            lastIndex < 0 ||
            lastIndex >= this.notes.length
        ) {
            return;
        }

        for (let i = 0; i < this.ties.length; i++) {
            if (this.ties[i].firstIndex === firstIndex && this.ties[i].lastIndex === lastIndex) {
                this.ties.splice(i, 1);
                break;
            }
        }
    }

    AddHairpin(
        firstIndex: number,
        lastIndex: number,
        type: HairpinType,
        position?: number,
    ): boolean {
        if (
            firstIndex < 0 ||
            firstIndex >= this.notes.length ||
            lastIndex < 0 ||
            lastIndex >= this.notes.length
        ) {
            return false;
        }
        for (const hairpin of this.hairpins) {
            if (firstIndex >= hairpin.firstIndex && firstIndex <= hairpin.lastIndex) {
                return false;
            }
            if (lastIndex >= hairpin.firstIndex && lastIndex <= hairpin.lastIndex) {
                return false;
            }
        }
        this.hairpins.push({ firstIndex: firstIndex, lastIndex: lastIndex, type, position });

        return true;
    }

    RemoveHairpin(firstIndex: number) {
        if (firstIndex < 0 || firstIndex >= this.notes.length) {
            return;
        }

        for (let i = 0; i < this.hairpins.length; i++) {
            if (this.hairpins[i][0] === firstIndex) {
                this.hairpins.splice(i, 1);
                break;
            }
        }
    }

    private CalculateNumBeats(): number {
        return this.notes.reduce((totalBeats, note) => {
            const noteDurationValue = note.DurationValue;
            return totalBeats + noteDurationValue;
        }, 0);
    }
}
