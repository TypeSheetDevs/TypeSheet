import { useLayoutEffect, useRef } from 'react';
import { NoteRenderer } from '@services/noteRenderer/NoteRenderer';
import { Renderer } from 'vexflow';
import { useWindowSize } from '@hooks/useWindowSize';

function NoteViewRenderer() {
  const container = useRef<HTMLDivElement>(null!);
  const [width, height] = useWindowSize();

  useLayoutEffect(() => {
    container.current.innerHTML = '';
    const renderer = new Renderer(container.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    const containerWidth = container.current.clientWidth;
    const noteRenderer = new NoteRenderer(context, containerWidth);

    noteRenderer.Draw();
  }, [width, height]);

  return (
    <div
      id="container"
      ref={container}></div>
  );
}

export default NoteViewRenderer;
