import { chord } from 'music21j';
import {
    ChordIntervals,
    ChordType,
    ChordTypeMusic21,
} from '@services/HarmonicsService/Harmonics.chords.enums';
import {
    ChordInfo,
    ChromaticScale,
    ChromaticScaleMap,
    Notes,
} from '@services/HarmonicsService/Harmonics.types';
import { Mode, ScalePatterns } from '@services/HarmonicsService/Harmonics.scales.enums';

export class HarmonicsService {
    // Chords
    public static GetChordInfo(keys: string[]): ChordInfo {
        const c = new chord.Chord(keys.map(key => key.replace('b', '-')));

        const rootInfo = c.root().stringInfo();

        const [rootPitch, octaveString] = rootInfo.match(/^([A-G#-]+)(\d+)$/)!.slice(1);
        const octave = parseInt(octaveString, 10);

        const chordType = this.MapChordCommonName(c.commonName);

        return {
            rootPitch: rootPitch.replace('-', 'b'),
            octave: octave,
            chordType: chordType,
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

    public static GenerateChord(rootNote: string, chordType: ChordType): string[] {
        const intervals = ChordIntervals[chordType];
        const chromaticRootNote =
            rootNote === 'E#' ||
            rootNote === 'B#' ||
            rootNote.includes('b') ||
            rootNote.includes('##')
                ? ChromaticScaleMap[rootNote]
                : rootNote;

        const chromaticChord = [chromaticRootNote];
        const chromaticIndex = ChromaticScale.indexOf(chromaticRootNote);

        // finding chromatic chord
        for (const interval of intervals) {
            chromaticChord.push(
                ChromaticScale[(chromaticIndex + interval) % ChromaticScale.length],
            );
        }

        // finding expectedNotes
        const expectedNotes = [rootNote.slice(0, 1)];
        for (let i = 0; i < intervals.length; ++i) {
            expectedNotes.push(
                Notes[(Notes.indexOf(rootNote.slice(0, 1)) + (i + 1) * 2) % Notes.length],
            );
        }

        // converting chromatic chord to refined chord
        const refinedChord: string[] = [];
        for (let index = 0; index < chromaticChord.length; ++index) {
            const chromaticNote = chromaticChord[index];
            const expectedNote = expectedNotes[index];

            const chromaticNoteCIndex = ChromaticScale.indexOf(chromaticNote);
            const expectedNoteCIndex = ChromaticScale.indexOf(expectedNote);
            console.log(
                `Chromatic note index: ${chromaticNoteCIndex}, Expected note index: ${expectedNoteCIndex}`,
            );
            let distance = 0;
            const inwardDistance = Math.abs(chromaticNoteCIndex - expectedNoteCIndex);
            const outwardDistance = Math.abs(ChromaticScale.length - inwardDistance);

            if (inwardDistance < outwardDistance) {
                distance = Math.sign(chromaticNoteCIndex - expectedNoteCIndex) * inwardDistance;
            } else if (inwardDistance > outwardDistance) {
                distance = Math.sign(expectedNoteCIndex - chromaticNoteCIndex) * outwardDistance;
            }

            console.log(
                `Chromatic note: ${chromaticNote}, Expected note: ${expectedNote}, Distance: ${distance}`,
            );

            refinedChord.push(expectedNote + (distance < 0 ? 'b' : '#').repeat(Math.abs(distance)));
        }

        return refinedChord;
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

            if (offset <= -3 || offset >= 3) throw new Error('Scale cannot be generated');

            scale.push(Notes[currentIndex] + (offset < 0 ? 'b' : '#').repeat(Math.abs(offset)));
        }

        return scale;
    }
}
