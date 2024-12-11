import styles from './ScrollableView.styles.module.css';
import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { useRef } from 'react';
import useScrollBox from './useScrollBox';
import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';

function ScrollableView() {
  const scrollableBox = useRef<HTMLDivElement>(null);
  const containerHeight = useScrollBox(scrollableBox);

  return (
    <div
      className={styles.scrollableView}
      ref={scrollableBox}>
      <div
        className={styles.container}
        style={{ height: `${containerHeight}px` }}>
        <NoteViewRenderer />
      </div>
    </div>
  );
}

export default ScrollableView;
