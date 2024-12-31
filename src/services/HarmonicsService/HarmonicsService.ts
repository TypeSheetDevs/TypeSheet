import { chord } from 'music21j';
import { ChordType, ChordTypeMusic21 } from '@services/HarmonicsService/Harmonics.chords.enums';
import { ChordInfo } from '@services/HarmonicsService/Harmonics.types';
import {
    NotesFlats,
    NotesSharps,
    Mode,
    ScalePatterns,
} from '@services/HarmonicsService/Harmonics.scales.enums';

export class HarmonicsService {
    // Chords
    public static GetChordInfo(keys: string[]): ChordInfo {
        const c = new chord.Chord(keys);

        const rootInfo = c.root().stringInfo();
        const [rootPitch, octaveString] = rootInfo.match(/^([A-G#b]+)(\d+)$/)!.slice(1);
        const octave = parseInt(octaveString, 10);

        const chordType = this.MapChordCommonName(c.commonName);

        return {
            rootPitch,
            octave,
            chordType,
            canBeTonic: c.canBeTonic(),
        };
    }

    public static GetChordIntervals(keys: string[]): number[] {
        const c = new chord.Chord(keys);
        return c.orderedPitchClasses
            .map((pitchClass, i, arr) => (arr[(i + 1) % arr.length] - pitchClass + 12) % 12)
            .slice(-1);
    }

    private static MapChordCommonName(chordName: string): ChordType {
        const entry = Object.entries(ChordTypeMusic21).find(([_, value]) => value === chordName);

        return entry ? (entry[0] as ChordType) : ChordType.Other;
    }

    // Scales
    public static GenerateScale(tonic: string, mode: Mode, useSharps?: boolean): string[] {
        let notes: string[];

        if (useSharps === undefined)
            notes = tonic.endsWith('b') || tonic === 'F' ? NotesFlats : NotesSharps;
        else notes = useSharps ? NotesSharps : NotesFlats;

        const scale: string[] = [];
        let index = notes.indexOf(tonic);

        if (index === -1) throw new Error(`Invalid tonic: ${tonic}`);

        for (const step of ScalePatterns[mode]) {
            scale.push(notes[index]);
            index = (index + step) % notes.length;
        }
        this.UseSharps(tonic, mode);
        return scale;
    }

    private static UseSharps(tonic: string, mode: Mode): boolean {
        if (tonic.indexOf('#') !== -1) return true;
        else if (tonic.indexOf('b') !== -1) return false;

        return true;
    }
}
