import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';
import styles from './ScrollableView.styles.module.css';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { useEffect, useRef, useState } from 'react';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function ScrollableView() {
  const scrollableBox = useRef<HTMLDivElement>(null!);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [first, setFirst] = useState(0);
  const [visible, setVisible] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableBox.current) {
        let staveHeight = NotationRenderer.getInstance().StaveHeight;
        let firtStave = Math.floor(scrollableBox.current.scrollTop / staveHeight);
        let viewportHeight = scrollableBox.current.clientHeight;
        let visibleStaves = viewportHeight / staveHeight;
        setVisible(visibleStaves);
        setScrollHeight(firtStave * staveHeight);
        setFirst(firtStave);
        setContainerHeight(staveHeight * NotationRenderer.getInstance().staves.length);
      }
    };
    if (scrollableBox.current) {
      handleScroll();
      scrollableBox.current.addEventListener('scroll', handleScroll);
      EventNotifier.AddListener('numberOfStavesChanged', handleScroll);
    }

    return () => {
      if (scrollableBox.current) {
        scrollableBox.current.removeEventListener('scroll', handleScroll);
        EventNotifier.RemoveListener('numberOfStavesChanged', handleScroll);
      }
    };
  }, []);

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
          lastStaveIndex={first + visible + 1}
          startingHeight={scrollHeight}
          startingStaveIndex={first}
        />
      </div>
    </div>
  );
}

export default ScrollableView;
