import { useWindowSize } from '@hooks/useWindowSize';
import { useEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow';

function NoteViewRenderer() {
  const [width, height] = useWindowSize();
  const canvas = useRef<HTMLCanvasElement>(null!);
  const container = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const renderer = new Renderer(canvas.current, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    context.setFont('Arial', 10);
    renderer.resize(
      container.current.getBoundingClientRect().width,
      container.current.getBoundingClientRect().height,
    );
    const stave = new Stave(10, 0, 20);
    stave.setContext(context).draw();
    return () => renderer.getContext().clear();
  }, []);

  return (
    <div
      id="temp"
      ref={container}>
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default NoteViewRenderer;
