import { useWindowSize } from '@hooks/useWindowSize';
import { useEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow';

function StaveComponent() {
  const [width, height] = useWindowSize();
  const canvas = useRef<HTMLCanvasElement>(null!);
  const container = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    console.log(canvas.current.height);
    console.log(canvas.current.width);
    const renderer = new Renderer(canvas.current, Renderer.Backends.CANVAS);
    renderer.resize(
      container.current.getBoundingClientRect().width,
      container.current.getBoundingClientRect().height,
    );
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    const stave = new Stave(10, 0, container.current.getBoundingClientRect().width - 30);
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

export default StaveComponent;
