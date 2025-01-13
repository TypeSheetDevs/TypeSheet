import { ReactNode } from 'react';
import styles from './SlideInOutComponent.styles.module.css';

function SlideInOutComponent({
  isVisible,
  delay,
  children,
}: {
  isVisible: boolean;
  children: ReactNode;
  delay: number;
}) {
  return (
    <div style={{ position: 'relative', overflowY: 'auto' }}>
      <div
        className={`${styles.slideInOutComponent} ${isVisible ? styles.inAnimation : styles.outAnimation}`}
        style={{ animationDuration: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

export default SlideInOutComponent;
