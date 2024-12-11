import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';

function PagedView() {
  const stavesPerPage = ConfigService.getInstance().getValue('StavesPerPage');

  const [currentPage, maxPages, prevPage, nextPage, setPage] = usePages(1);

  const containerHeight = NotationRenderer.getInstance().StaveHeight * stavesPerPage;

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
        className={styles.container}
        style={{ height: `${containerHeight}px` }}>
        <NoteViewRenderer />
      </div>
    </div>
  );
}

export default PagedView;
