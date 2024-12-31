import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';

export enum NotationRenderEngine {
  Canvas = 'Canvas',
  SVG = 'SVG',
}

export function getRendererEngine(engine: NotationRenderEngine) {
  switch (engine) {
    case NotationRenderEngine.SVG:
      return <NoteViewSVGRenderer />;
    case NotationRenderEngine.Canvas:
      return <NoteViewRenderer />;
  }
}
