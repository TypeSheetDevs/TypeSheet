import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { useState, useEffect } from 'react';
import { Notation } from '@services/notationRenderer/Notation';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

function usePages(currentPageDefault: number) {
    const [currentPage, setCurrentPage] = useState(currentPageDefault);
    const [maxPages, setMaxPages] = useState(1);

    const stavesPerPage = ConfigService.getInstance().getValue('StavesPerPage');

    const changeViewport = (page: number, clearSelected: boolean = true) => {
        const startingStaveIndex = page * stavesPerPage - stavesPerPage;
        const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;
        if (clearSelected) NotationRenderer.getInstance().ClearSelectedBar();
        EventNotifier.Notify('viewportChanged', {
            lastStaveIndex: lastStaveIndex,
            startingStaveIndex: startingStaveIndex,
            startingHeight: 0,
        });
    };

    useEffect(() => {
        const setPages = (numberOfStaves: number) => {
            setMaxPages(Math.max(1, Math.ceil(numberOfStaves / stavesPerPage)));
            changeViewport(currentPage, false);
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
            changeViewport(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            changeViewport(currentPage - 1);
        }
    };

    const setPage = (page: number) => {
        if (page <= 1) {
            page = 1;
        } else if (page >= maxPages) {
            page = maxPages;
        }
        setCurrentPage(page);
        changeViewport(page);
    };

    return [currentPage, maxPages, prevPage, nextPage, setPage] as const;
}

export default usePages;
