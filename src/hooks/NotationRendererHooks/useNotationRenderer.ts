import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import React, { useRef } from 'react';
import { RendererBackends } from 'vexflow';
import useOnClickRendererEvent from '@hooks/NotationRendererHooks/useOnClickRendererEvent';
import useOnMouseMoveRendererEvent from '@hooks/NotationRendererHooks/useOnMouseMoveRendererEvent';
import useResizeNotationRenderer from '@hooks/NotationRendererHooks/useResizeNotationRenderer';

function useNotationRenderer(
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
) {
    const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());

    useResizeNotationRenderer(noteRenderer, container, backend);
    useOnClickRendererEvent(container);
    useOnMouseMoveRendererEvent(container);
}

export default useNotationRenderer;
