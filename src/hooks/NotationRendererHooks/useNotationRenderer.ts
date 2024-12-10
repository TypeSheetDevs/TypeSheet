import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import React, { useRef } from 'react';
import { RendererBackends } from 'vexflow';
import useOnClickRendererEvent from '@hooks/NotationRendererHooks/useOnClickRendererEvent';
import useOnMouseMoveRendererEvent from '@hooks/NotationRendererHooks/useOnMouseMoveRendererEvent';
import useResizeNotationRenderer from '@hooks/NotationRendererHooks/useResizeNotationRenderer';

function useNotationRenderer(
    props: RenderArguments,
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
) {
    const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
    const renderArgs = useRef<RenderArguments>(props);
    renderArgs.current = props;

    useResizeNotationRenderer(noteRenderer, container, backend, renderArgs);
    useOnClickRendererEvent(container, renderArgs);
    useOnMouseMoveRendererEvent(container, renderArgs);

    EventNotifier.Notify('needsRender');
}

export default useNotationRenderer;
