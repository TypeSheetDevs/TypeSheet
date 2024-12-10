import React, { useCallback } from 'react';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import useEventListenerOnRenderer from '@hooks/NotationRendererHooks/useEventListenerOnRenderer';

function useOnMouseMoveRendererEvent(
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    args: React.MutableRefObject<RenderArguments>,
) {
    const onMouseMove = useCallback(
        (ev: Event) => {
            const mouseEvent = ev as MouseEvent;
            const rect = container.current.getBoundingClientRect();

            EventNotifier.Notify('movedInsideRenderer', {
                positionY: mouseEvent.y - rect.top,
                positionX: mouseEvent.x - rect.left,
                startingStaveIndex: args.current.startingStaveIndex,
                lastStaveIndex: args.current.lastStaveIndex,
            });
            ev.preventDefault();
        },
        [args],
    );

    useEventListenerOnRenderer(container, 'mousemove', onMouseMove);
}

export default useOnMouseMoveRendererEvent;
