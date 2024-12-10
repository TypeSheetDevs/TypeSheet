import React, { useEffect } from 'react';

function useEventListenerOnRenderer(
    container: React.MutableRefObject<HTMLCanvasElement | HTMLDivElement>,
    eventName: keyof HTMLElementEventMap,
    listener: EventListener,
) {
    useEffect(() => {
        container.current.addEventListener(eventName, listener);
        return () => {
            container.current?.removeEventListener(eventName, listener);
        };
    }, [container, listener]);
}

export default useEventListenerOnRenderer;
