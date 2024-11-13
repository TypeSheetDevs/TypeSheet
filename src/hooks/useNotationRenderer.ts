import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useRef, useEffect } from 'react';
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

        const resizeObserver = new ResizeObserver(checkResize);
        resizeObserver.observe(container.current);

        EventNotifier.AddListener('needsRender', checkResize);

        return () => {
            resizeObserver.disconnect();
            EventNotifier.RemoveListener('needsRender', checkResize);
            container.current?.firstChild?.remove();
        };
    }, []);

    EventNotifier.Notify('needsRender');
}

export default useNotationRenderer;
