import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { useState, useEffect } from 'react';
import { Notation } from '@services/notationRenderer/Notation';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

function usePages(currentPageDefault: number) {
    const [currentPage, setCurrentPage] = useState(currentPageDefault);
    const [maxPages, setMaxPages] = useState(1);

    const stavesPerPage = ConfigService.getInstance().getValue('StavesPerPage');

    useEffect(() => {
        const setPages = (numberOfStaves: number) => {
            setMaxPages(Math.max(1, Math.ceil(numberOfStaves / stavesPerPage)));
            EventNotifier.Notify('needsRender');
        };

        setPages(Notation.getInstance().staves.length);

        EventNotifier.AddListener('numberOfStavesChanged', setPages);
        return () => {
            EventNotifier.RemoveListener('numberOfStavesChanged', setPages);
        };
    }, []);

    const nextPage = () => {
        if (currentPage < maxPages) {
            setCurrentPage(currentPage + 1);
            NotationRenderer.getInstance().ClearSelectedBar();
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            NotationRenderer.getInstance().ClearSelectedBar();
        }
    };

    const setPage = (page: number) => {
        if (page <= 1) {
            page = 1;
        } else if (page >= maxPages) {
            page = maxPages;
        }
        setCurrentPage(page);
        NotationRenderer.getInstance().ClearSelectedBar();
    };

    return [currentPage, maxPages, prevPage, nextPage, setPage] as const;
}

export default usePages;
