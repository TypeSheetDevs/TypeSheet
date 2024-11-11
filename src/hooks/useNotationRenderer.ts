import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useRef, useLayoutEffect } from 'react';
import { Renderer, RendererBackends } from 'vexflow';

function useNotationRenderer(
    props: RenderArguments,
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    backend: RendererBackends,
) {
    const noteRenderer = useRef<NotationRenderer>(NotationRenderer.getInstance());
    const renderArgs = useRef<RenderArguments>(props);
    renderArgs.current = props;

    document.dispatchEvent(new CustomEvent<never>('needRender'));

    useLayoutEffect(() => {
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

        checkResize();

        window.addEventListener('resize', checkResize);
        document.addEventListener('needRender', checkResize);

        return () => {
            window.removeEventListener('resize', checkResize);
            document.removeEventListener('needRender', checkResize);
            container.current.firstChild?.remove();
        };
    }, []);
}

export default useNotationRenderer;
