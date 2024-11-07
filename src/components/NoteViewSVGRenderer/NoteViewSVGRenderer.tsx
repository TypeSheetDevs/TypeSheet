import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useLayoutEffect, useRef } from 'react';
import { Renderer } from 'vexflow';

function NoteViewSVGRenderer() {
  const container = useRef<HTMLDivElement>(null!);
  const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
  useLayoutEffect(() => {
    const renderer = new Renderer(container.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    noteRenderer.current.setContext(context);
    const checkResize = () => {
      renderer.resize(container.current.clientWidth, container.current.clientHeight);
      noteRenderer.current.Resize(container.current.clientWidth, container.current.clientHeight);
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => {
      window.removeEventListener('resize', checkResize);
      container.current.firstChild?.remove();
    };
  }, []);
  return (
    <div
      id="container"
      ref={container}></div>
  );
}

export default NoteViewSVGRenderer;
