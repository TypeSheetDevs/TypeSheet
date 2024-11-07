import './NoteViewRenderer.styles.css';
import { useLayoutEffect, useRef } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { Renderer } from 'vexflow';

function NoteViewRenderer() {
  const container = useRef<HTMLCanvasElement>(null!);
  const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
  useLayoutEffect(() => {
    const renderer = new Renderer(container.current, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    noteRenderer.current.setContext(context);

    const checkResize = () => {
      container.current.height = 0;
      container.current.width = container.current.clientWidth;
      container.current.height = container.current.clientHeight;
      noteRenderer.current.Resize(container.current.width, container.current.height);
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  return (
    <div>
      <canvas
        id="container"
        ref={container}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
