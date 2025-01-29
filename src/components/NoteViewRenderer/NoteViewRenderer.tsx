import styles from './NoteViewRenderer.styles.module.css';
import { Renderer } from 'vexflow';
import { useRef } from 'react';
import useNotationRenderer from '@hooks/NotationRendererHooks/useNotationRenderer';
import MouseTooltip from '@components/MouseTooltip/MouseTooltip';

function NoteViewRenderer() {
  const container = useRef<HTMLCanvasElement>(null!);

  useNotationRenderer(container, Renderer.Backends.CANVAS);

  return (
    <div className={styles.container}>
      <MouseTooltip />
      <canvas
        className={styles.canvas}
        ref={container}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
