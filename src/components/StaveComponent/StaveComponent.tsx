import { useEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow';

function StaveComponent() {
  const container = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (container.current == null) {
      return;
    }
    if (rendererRef.current == null) {
      rendererRef.current = new Renderer(container.current, Renderer.Backends.CANVAS);
    }
    const renderer = rendererRef.current;
    renderer.resize(700, 700);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    const stave = new Stave(10, 40, 700);
    stave.setContext(context).draw();
  }, []);
  return <canvas ref={container}></canvas>;
}

export default StaveComponent;
