import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useState, useEffect, useCallback } from 'react';
import { Notation } from '@services/notationRenderer/Notation';

function useScrollBox(container: React.RefObject<HTMLDivElement>) {
    const [containerHeight, setContainerHeight] = useState(0);

    const handleScroll = useCallback(() => {
        if (!container.current) {
            return;
        }
        const staveHeight = NotationRenderer.getInstance().StaveHeight;
        const firstElementIndexHelper = Math.max(
            0,
            Math.floor(container.current.scrollTop / staveHeight) - 3,
        );
        const viewportHeight = container.current.clientHeight;
        const visibleElementsCount = Math.ceil(viewportHeight / staveHeight) + 2 * 3;
        const elementsStartingHeight = firstElementIndexHelper * staveHeight;
        const firstElementIndex = firstElementIndexHelper;

        EventNotifier.Notify('viewportChanged', {
            startingHeight: elementsStartingHeight,
            lastStaveIndex: firstElementIndex + visibleElementsCount,
            startingStaveIndex: firstElementIndex,
        });

        setContainerHeight(staveHeight * Notation.getInstance().staves.length);
    }, [container]);

    const handleHeightChange = useCallback((params: number) => {
        const staveHeight = NotationRenderer.getInstance().StaveHeight;
        const totalHeight = staveHeight * Notation.getInstance().staves.length + params;
        setContainerHeight(totalHeight);
    }, []);

    useEffect(() => {
        if (container.current) {
            handleScroll();
            container.current.addEventListener('scroll', handleScroll);
        }

        EventNotifier.AddListener('numberOfStavesChanged', handleScroll);
        EventNotifier.AddListener('metaDataSet', handleHeightChange);

        return () => {
            if (container.current) {
                container.current.removeEventListener('scroll', handleScroll);
            }
            EventNotifier.RemoveListener('numberOfStavesChanged', handleScroll);
            EventNotifier.RemoveListener('metaDataSet', handleHeightChange);
        };
    }, [handleScroll, handleHeightChange]);

    return containerHeight;
}

export default useScrollBox;
