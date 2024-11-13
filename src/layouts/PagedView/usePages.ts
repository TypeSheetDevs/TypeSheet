import { stavesPerPage } from '@data/config';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useState, useEffect } from 'react';

function usePages(currentPageDefault: number) {
    const [currentPage, setCurrentPage] = useState(currentPageDefault);
    const [maxPages, setMaxPages] = useState(1);

    useEffect(() => {
        const setPages = (numberOfStaves: number) =>
            setMaxPages(Math.max(1, Math.ceil(numberOfStaves / stavesPerPage)));

        setPages(NotationRenderer.getInstance().staves.length);

        EventNotifier.AddListener('numberOfStavesChanged', setPages);
        return () => {
            EventNotifier.RemoveListener('numberOfStavesChanged', setPages);
        };
    }, []);

    const nextPage = () => {
        if (currentPage < maxPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return [currentPage, maxPages, prevPage, nextPage] as const;
}

export default usePages;
