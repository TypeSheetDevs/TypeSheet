import { useWindowSize } from '@hooks/useWindowSize';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow';

function NoteViewRenderer() {
  const [width, height] = useWindowSize();
  const canvas = useRef<HTMLCanvasElement>(null!);
  const container = useRef<HTMLDivElement>(null!);
  useLayoutEffect(() => {
    canvas.current.width = (container.current.clientWidth * 90) / 100;
    canvas.current.height = (container.current.clientHeight * 90) / 100;
    const renderer = new Renderer(canvas.current, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    context.setFont('Arial', 10);
    const stave = new Stave(10, 0, canvas.current.clientWidth - 20);
    stave.setContext(context).draw();
    return () => renderer.getContext().clear();
  }, [width, height]);

  return (
    <div
      id="temp"
      ref={container}>
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
