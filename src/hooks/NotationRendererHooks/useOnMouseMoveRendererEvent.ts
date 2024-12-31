import React, { useCallback } from 'react';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import useEventListenerOnRenderer from '@hooks/NotationRendererHooks/useEventListenerOnRenderer';
import throttle from '@utils/throttle';

function useOnMouseMoveRendererEvent(
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
) {
    const onMouseMove = useCallback(
        (ev: Event) => {
            const mouseEvent = ev as MouseEvent;
            const rect = container.current.getBoundingClientRect();

            EventNotifier.Notify('movedInsideRenderer', {
                positionY: mouseEvent.y - rect.top,
                positionX: mouseEvent.x - rect.left,
            });
            ev.preventDefault();
        },
        [container],
    );

    useEventListenerOnRenderer(container, 'mousemove', throttle(onMouseMove, 10));
}

export default useOnMouseMoveRendererEvent;
