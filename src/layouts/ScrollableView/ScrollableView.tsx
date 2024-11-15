import styles from './ScrollableView.styles.module.css';
import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { useRef } from 'react';
import useScrollBox from './useScrollBox';

function ScrollableView() {
  const scrollableBox = useRef<HTMLDivElement>(null);
  const [containerHeight, stavesStartingHeight, firstStaveIndex, visibleStavesCount] =
    useScrollBox(scrollableBox);

  return (
    <div
      className={styles.scrollableView}
      ref={scrollableBox}>
      <div
        style={{
          height: `${containerHeight}px`,
          display: 'flex',
          flex: '1 1 0',
        }}>
        <NoteViewSVGRenderer
          startingHeight={stavesStartingHeight}
          startingStaveIndex={firstStaveIndex}
          lastStaveIndex={firstStaveIndex + visibleStavesCount + 3}
        />
      </div>
    </div>
  );
}

export default ScrollableView;
