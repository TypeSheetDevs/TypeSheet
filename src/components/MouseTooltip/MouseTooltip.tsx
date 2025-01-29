import { useCallback, useEffect, useState } from 'react';
import styles from './MouseTooltip.styles.module.css';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function MouseTooltip() {
  const [text, setText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1, y: -1 });

  const handleToggle = useCallback((params: { x: number; y: number; text: string }) => {
    setText(params.text);
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
      {text !== '' && (
        <div
          className={styles.tooltip}
          style={{
            left: position.x,
            top: position.y,
          }}>
          {text}
        </div>
      )}
    </>
  );
}

export default MouseTooltip;
