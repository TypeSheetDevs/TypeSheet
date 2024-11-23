import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useState, useEffect } from 'react';
import { Notation } from '@services/notationRenderer/Notation';

function useScrollBox(container: React.RefObject<HTMLDivElement>) {
    const [elementsStartingHeight, setElementsStartingHeight] = useState(0);
    const [firstElementIndex, setFirstElementIndex] = useState(0);
    const [visibleElementsCount, setVisibleElementsCount] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!container.current) {
                return;
            }
            const staveHeight = NotationRenderer.getInstance().StaveHeight;
            const firstElementIndexHelper = Math.max(
                0,
                Math.floor(container.current.scrollTop / staveHeight) - 3,
            );
            const viewportHeight = container.current.clientHeight;

            setVisibleElementsCount(Math.ceil(viewportHeight / staveHeight) + 2 * 3);
            setElementsStartingHeight(firstElementIndexHelper * staveHeight);
            setFirstElementIndex(firstElementIndexHelper);
            setContainerHeight(staveHeight * Notation.getInstance().staves.length);
        };

        if (container.current) {
            handleScroll();
            container.current.addEventListener('scroll', handleScroll);
        }
        EventNotifier.AddListener('numberOfStavesChanged', handleScroll);

        return () => {
            if (container.current) {
                container.current.removeEventListener('scroll', handleScroll);
            }
            EventNotifier.RemoveListener('numberOfStavesChanged', handleScroll);
        };
    }, []);

    return [
        containerHeight,
        elementsStartingHeight,
        firstElementIndex,
        visibleElementsCount,
    ] as const;
}

export default useScrollBox;
