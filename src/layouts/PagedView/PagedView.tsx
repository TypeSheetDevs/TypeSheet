import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { stavesPerPage } from '@data/config';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { useEffect, useState } from 'react';

function PagedView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const startingStaveIndex = currentPage * stavesPerPage - stavesPerPage;
  const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;

  useEffect(() => {
    const setPages = () => {
      setMaxPages(
        Math.max(1, Math.ceil(NotationRenderer.getInstance().staves.length / stavesPerPage)),
      );
    };
    setPages();

    document.addEventListener('numberOfStavesChanged', setPages);
    return () => {
      document.removeEventListener('numberOfStavesChanged', setPages);
    };
  }, []);

  return (
    <div id="pagedView">
      <div id="nav">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              document.dispatchEvent(new CustomEvent<never>('needRender'));
            }
          }}>
          left
        </button>
        {currentPage} / {maxPages}
        <button
          onClick={() => {
            if (currentPage < maxPages) {
              setCurrentPage(currentPage + 1);
              document.dispatchEvent(new CustomEvent<never>('needRender'));
            }
          }}>
          right
        </button>
      </div>
      <div
        style={{
          height: `${NotationRenderer.getInstance().StaveHeight * stavesPerPage}px`,
          display: 'flex',
          flex: '1 1 0',
        }}>
        <NoteViewSVGRenderer
          startingStaveIndex={startingStaveIndex}
          lastStaveIndex={lastStaveIndex}
          startingHeight={0}
        />
      </div>
    </div>
  );
}

export default PagedView;
