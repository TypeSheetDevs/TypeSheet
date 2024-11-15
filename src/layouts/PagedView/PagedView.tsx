import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { stavesPerPage } from '@data/config';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';

function PagedView() {
  const [currentPage, maxPages, prevPage, nextPage, setPage] = usePages(1);
  const startingStaveIndex = currentPage * stavesPerPage - stavesPerPage;
  const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;

  return (
    <div className={styles.pagedView}>
      <div className={styles.nav}>
        <button onClick={prevPage}>left</button>
        <input
          type="number"
          value={currentPage}
          onChange={e => setPage(Number.parseInt(e.target.value))}
        />
        / {maxPages}
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
