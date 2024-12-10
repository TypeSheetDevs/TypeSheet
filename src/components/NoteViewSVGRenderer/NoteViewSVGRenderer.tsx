import useNotationRenderer from '@hooks/NotationRendererHooks/useNotationRenderer';
import { useRef } from 'react';
import { Renderer } from 'vexflow';
import styles from './NoteViewSVGRenderer.styles.module.css';

export function NoteViewSVGRenderer(props: NoteViewSVGRendererProps) {
  const container = useRef<HTMLDivElement>(null!);

  useNotationRenderer(props, container, Renderer.Backends.SVG);

  return (
    <div
      className={styles.container}
      ref={container}></div>
  );
}

export default NoteViewSVGRenderer;
