import styles from './NoteViewRenderer.styles.module.css';
import { Renderer } from 'vexflow';
import { useRef } from 'react';
import useNotationRenderer from '@hooks/useNotationRenderer';

function NoteViewRenderer(props: NoteViewRendererProps) {
  const container = useRef<HTMLCanvasElement>(null!);

  useNotationRenderer(props, container, Renderer.Backends.CANVAS);

  return (
    <div className={styles.container}>
      <canvas
        className={styles.canvas}
        ref={container}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
