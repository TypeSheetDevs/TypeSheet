import { chord } from 'music21j';
import { ChordType, ChordTypeMusic21 } from '@services/HarmonicsService/Harmonics.chords.enums';
import { ChordInfo } from '@services/HarmonicsService/Harmonics.types';

export class HarmonicsService {
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
}
