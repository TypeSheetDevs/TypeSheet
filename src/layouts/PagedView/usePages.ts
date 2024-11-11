import { stavesPerPage } from '@data/config';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useState, useEffect } from 'react';

function usePages(currentPageDefault: number) {
    const [currentPage, setCurrentPage] = useState(currentPageDefault);
    const [maxPages, setMaxPages] = useState(1);

    useEffect(() => {
        const setPages = () => {
            setMaxPages(
                Math.max(
                    1,
                    Math.ceil(NotationRenderer.getInstance().staves.length / stavesPerPage),
                ),
            );
        };
        setPages();

        document.addEventListener('numberOfStavesChanged', setPages);
        return () => {
            document.removeEventListener('numberOfStavesChanged', setPages);
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
