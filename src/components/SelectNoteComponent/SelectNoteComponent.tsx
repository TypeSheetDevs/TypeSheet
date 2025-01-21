import styles from './SelectNoteComponent.styles.module.css';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';
import SelectableNoteBox from '@components/SelectNoteComponent/SelectableNoteBox';
import { useEffect, useState } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

export default function SelectNoteComponent() {
  const [selectedNote, setSelectedNote] = useState<number>(2);

  const noteValues = [
    { noteEnum: NoteDuration.Whole, value: '\uD834\uDD5D' },
    { noteEnum: NoteDuration.Half, value: '\uD834\uDD5E' },
    { noteEnum: NoteDuration.Quarter, value: '\uD834\uDD5F' },
    { noteEnum: NoteDuration.Eighth, value: '\uD834\uDD60' },
    { noteEnum: NoteDuration.Sixteenth, value: '\uD834\uDD61' },
    { noteEnum: NoteDuration.ThirtySecond, value: '\uD834\uDD62' },
  ];

  useEffect(() => {
    NotationRenderer.getInstance().AddingNoteIndicator.NoteDuration =
      noteValues[selectedNote].noteEnum;
  }, [selectedNote]);

  return (
    <div className={styles.box}>
      {noteValues.map((noteValue, idx) => (
        <SelectableNoteBox
          key={idx}
          selected={selectedNote === idx}
          setSelected={() => setSelectedNote(idx)}
          noteValue={noteValue.value}
        />
      ))}
    </div>
  );
}
