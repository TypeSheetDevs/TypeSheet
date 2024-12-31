import styles from './ScrollableView.styles.module.css';
import { useRef } from 'react';
import useScrollBox from './useScrollBox';
import { getRendererEngine } from '@utils/getRendererEngine';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

function ScrollableView() {
  const rendererEngine = ConfigService.getInstance().getValue(SavedParameterName.RendererEngine);

  const scrollableBox = useRef<HTMLDivElement>(null);
  const containerHeight = useScrollBox(scrollableBox);
  return (
    <div
      className={styles.scrollableView}
      ref={scrollableBox}>
      <div
        className={styles.container}
        style={{ height: `${containerHeight}px` }}>
        {getRendererEngine(rendererEngine)}
      </div>
    </div>
  );
}

export default ScrollableView;
