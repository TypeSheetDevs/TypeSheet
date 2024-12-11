import React, { useCallback } from 'react';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import useEventListenerOnRenderer from '@hooks/NotationRendererHooks/useEventListenerOnRenderer';

function useOnClickRendererEvent(
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
) {
    const onClick = useCallback(
        (ev: Event) => {
            const mouseEvent = ev as MouseEvent;
            const rect = container.current.getBoundingClientRect();

            EventNotifier.Notify('clickedInsideRenderer', {
                positionY: mouseEvent.y - rect.top,
                positionX: mouseEvent.x - rect.left,
            });
            ev.preventDefault();
        },
        [container],
    );

    useEventListenerOnRenderer(container, 'click', onClick);
}

export default useOnClickRendererEvent;
