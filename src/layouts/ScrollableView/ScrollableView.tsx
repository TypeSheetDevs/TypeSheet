import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';
import styles from './ScrollableView.styles.module.css';

function ScrollableView() {
  return (
    <div id={styles.scrollableView}>
      Scrollable
      <NoteViewRenderer
        lastStaveIndex={3}
        startingHeight={-50}
        startingStaveIndex={0}
      />
    </div>
  );
}

export default ScrollableView;
