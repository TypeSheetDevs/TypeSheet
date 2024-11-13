import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { stavesPerPage } from '@data/config';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';

function PagedView() {
  const [currentPage, maxPages, prevPage, nextPage] = usePages(1);
  const startingStaveIndex = currentPage * stavesPerPage - stavesPerPage;
  const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;

  return (
    <div id={styles.pagedView}>
      <div id={styles.nav}>
        <button onClick={prevPage}>left</button>
        {currentPage} / {maxPages}
        <button onClick={nextPage}>right</button>
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
