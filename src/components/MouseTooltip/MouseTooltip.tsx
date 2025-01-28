import { useCallback, useEffect, useState } from 'react';
import styles from './MouseTooltip.styles.module.css';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function MouseTooltip() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1, y: -1 });

  const handleToggle = useCallback((params: { x: number; y: number; visible: boolean }) => {
    console.log(params);
    setVisible(params.visible);
    setPosition({ x: params.x, y: params.y });
  }, []);

  useEffect(() => {
    EventNotifier.AddListener('toggleHarmonicsTooltip', handleToggle);
    return () => {
      EventNotifier.RemoveListener('toggleHarmonicsTooltip', handleToggle);
    };
  }, []);

  return (
    <>
      {visible && (
        <div
          className={styles.tooltip}
          style={{
            left: position.x,
            top: position.y,
          }}>
          Tooltip
        </div>
      )}
    </>
  );
}

export default MouseTooltip;
