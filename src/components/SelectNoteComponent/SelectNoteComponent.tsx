import styles from './SelectNoteComponent.styles.module.css';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';

export default function SelectNoteComponent() {
  return (
    <div className={styles.additionalBar}>
      <div
        className={styles.note}
        onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Whole)}>
        &#x1D15D;
      </div>
      <div
        className={styles.note}
        onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Half)}>
        &#x1D15E;
      </div>
      <div
        className={styles.note}
        onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Quarter)}>
        &#x1D15F;
      </div>
      <div
        className={styles.note}
        onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Eighth)}>
        &#x1D160;
      </div>
      <div
        className={styles.note}
        onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Sixteenth)}>
        &#x1D161;
      </div>
    </div>
  );
}
