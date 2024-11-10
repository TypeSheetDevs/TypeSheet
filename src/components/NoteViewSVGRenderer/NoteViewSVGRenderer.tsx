import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useLayoutEffect, useRef } from 'react';
import { Renderer } from 'vexflow';

function NoteViewSVGRenderer(props: NoteViewSVGRendererProps) {
  const container = useRef<HTMLDivElement>(null!);
  const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
  const renderArgs = useRef<RenderArguments>(props);
  renderArgs.current = props;

  useLayoutEffect(() => {
    const renderer = new Renderer(container.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    const checkResize = () => {
      const width = container.current.clientWidth;
      const height = container.current.clientHeight;
      renderer.resize(width, 0);
      renderer.resize(width, container.current.clientHeight);
      noteRenderer.current.Render(
        context,
        width,
        height,
        renderArgs.current.startingHeight,
        renderArgs.current.startingStaveIndex,
        renderArgs.current.lastStaveIndex,
      );
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    document.addEventListener('needRender', checkResize);
    return () => {
      window.removeEventListener('resize', checkResize);
      document.removeEventListener('needRender', checkResize);
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
