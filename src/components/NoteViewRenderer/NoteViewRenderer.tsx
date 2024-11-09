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

    const checkResize = () => {
      canvas.current.height = 0;
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      noteRenderer.current.Render(context, canvas.current.width, canvas.current.height);
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    document.addEventListener('needRender', checkResize);
    return () => {
      window.removeEventListener('resize', checkResize);
      document.removeEventListener('needRender', checkResize);
    };
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
