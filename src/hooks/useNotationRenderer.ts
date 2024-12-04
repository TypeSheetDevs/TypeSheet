import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import React, { useRef, useEffect } from 'react';
import { Renderer, RendererBackends } from 'vexflow';

function useNotationRenderer(
    props: RenderArguments,
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
) {
    const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
    const renderArgs = useRef<RenderArguments>(props);
    renderArgs.current = props;

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
                renderArgs.current.startingHeight,
                renderArgs.current.startingStaveIndex,
                renderArgs.current.lastStaveIndex,
            );
        };
        const onClick = (ev: Event) => {
            const mouseEvent = ev as MouseEvent;

            const rect = container.current.getBoundingClientRect();

            EventNotifier.Notify('clickedInsideRenderer', {
                positionY: mouseEvent.y - rect.top,
                positionX: mouseEvent.x - rect.left,
                startingStaveIndex: renderArgs.current.startingStaveIndex,
                lastStaveIndex: renderArgs.current.lastStaveIndex,
            });
            ev.preventDefault();
        };

        const resizeObserver = new ResizeObserver(checkResize);
        resizeObserver.observe(container.current);

        EventNotifier.AddListener('needsRender', checkResize);
        container.current.addEventListener('click', onClick);

        return () => {
            resizeObserver.disconnect();
            EventNotifier.RemoveListener('needsRender', checkResize);
            container.current?.removeEventListener('click', onClick);
            container.current?.firstChild?.remove();
        };
    }, []);

    EventNotifier.Notify('needsRender');
}

export default useNotationRenderer;
