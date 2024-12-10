import React, { useEffect } from 'react';
import { Renderer, RendererBackends } from 'vexflow';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

function useResizeNotationRenderer(
    noteRenderer: React.MutableRefObject<NotationRenderer>,
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
    args: React.MutableRefObject<RenderArguments>,
) {
    useEffect(() => {
        const renderer = new Renderer(container.current, backend);
        const context = renderer.getContext();

        const checkResize = () => {
            renderer.resize(container.current.clientWidth, 0);
            renderer.resize(container.current.clientWidth, container.current.clientHeight);
            noteRenderer.current.Render(
                context,
                container.current.clientWidth,
                container.current.clientHeight,
                args.current.startingHeight,
                args.current.startingStaveIndex,
                args.current.lastStaveIndex,
            );
        };

        const resizeObserver = new ResizeObserver(checkResize);
        resizeObserver.observe(container.current);

        EventNotifier.AddListener('needsRender', checkResize);

        return () => {
            resizeObserver.disconnect();
            EventNotifier.RemoveListener('needsRender', checkResize);

            container.current?.firstChild?.remove();
        };
    }, []);
}

export default useResizeNotationRenderer;
