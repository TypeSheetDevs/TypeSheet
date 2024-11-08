import './NoteViewRenderer.styles.css';
import { useLayoutEffect, useRef } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { Renderer } from 'vexflow';

function NoteViewRenderer() {
  const canvas = useRef<HTMLCanvasElement>(null!);
  const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
  useLayoutEffect(() => {
    const renderer = new Renderer(canvas.current, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    noteRenderer.current.setContext(context);

    const checkResize = () => {
      canvas.current.height = 0;
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      noteRenderer.current.Resize(canvas.current.width, canvas.current.height);
      noteRenderer.current.Render();
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvas}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
