import { useLayoutEffect, useRef } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { Renderer } from 'vexflow';
import { useWindowSize } from '@hooks/useWindowSize';

function Clear(container) {
  if (!container.current.firstChild) return;

  container.current.firstChild.innerHTML = '';
}

function NoteViewRenderer() {
  const container = useRef<HTMLCanvasElement>(null!);
  const [width, height] = useWindowSize();

  useLayoutEffect(() => {
    container.current.innerHTML = '';
    const renderer = new Renderer(container.current, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    const containerWidth = container.current.clientWidth;
    renderer.resize(width, height);
    const noteRenderer = new NotationRenderer(context, containerWidth - 1, () => Clear(container));
    noteRenderer.Render();
  }, [width, height]);

  return (
    <canvas
      id="container"
      ref={container}></canvas>
  );
}

export default NoteViewRenderer;
