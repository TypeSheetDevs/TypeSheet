import React, { useEffect } from 'react';
import { Renderer, RendererBackends } from 'vexflow';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

function useResizeNotationRenderer(
    noteRenderer: React.MutableRefObject<NotationRenderer>,
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
) {
    useEffect(() => {
        const renderer = new Renderer(container.current, backend);
        noteRenderer.current.SetContext(renderer.getContext());

        const checkResize = () => {
            renderer.resize(container.current.clientWidth, 0);
            renderer.resize(container.current.clientWidth, container.current.clientHeight);

            EventNotifier.Notify('resized', {
                width: container.current.clientWidth,
                height: container.current.clientHeight,
            });
        };

        const resizeObserver = new ResizeObserver(checkResize);
        resizeObserver.observe(container.current);

        return () => {
            resizeObserver.disconnect();
            container.current?.firstChild?.remove();
        };
    }, []);
}

export default useResizeNotationRenderer;
