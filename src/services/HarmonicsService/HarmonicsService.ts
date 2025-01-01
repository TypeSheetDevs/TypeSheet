import { chord } from 'music21j';
import { ChordType, ChordTypeMusic21 } from '@services/HarmonicsService/Harmonics.chords.enums';
import { ChordInfo } from '@services/HarmonicsService/Harmonics.types';
import { Mode, ScalePatterns, Notes } from '@services/HarmonicsService/Harmonics.scales.enums';

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
    public static GenerateScale(tonic: string, mode: Mode): string[] {
        const scale: string[] = [tonic];
        let currentIndex = Notes.indexOf(tonic[0]);
        if (currentIndex === -1) {
            throw new Error(`Invalid tonic: ${tonic}`);
        }

        // Determine the initial offset (sharp or flat).
        let offset = tonic.length === 2 ? (tonic.includes('#') ? 1 : -1) : 0;

        for (const step of ScalePatterns[mode]) {
            const lastNote = Notes[currentIndex];
            currentIndex = (currentIndex + 1) % Notes.length;

            offset += step - 2;
            if (lastNote === 'E' || lastNote === 'B') offset += 1;
            console.log(lastNote, offset);

            if (offset <= -2 || offset >= 2) throw new Error('Scale cannot be generated');

            scale.push(Notes[currentIndex] + (offset === -1 ? 'b' : offset === 1 ? '#' : ''));
        }

        return scale;
    }
}
