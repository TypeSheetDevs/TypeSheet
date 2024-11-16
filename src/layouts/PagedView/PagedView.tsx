import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { ConfigKey } from '@services/ConfigService/ConfigKey';

function PagedView() {
  let stavesPerPage = 4;
  const stavesPerPageConfig = Number(ConfigService.getInstance().getValue(ConfigKey.StavesPerPage));
  if (!Number.isNaN(stavesPerPageConfig)) {
    stavesPerPage = stavesPerPageConfig;
  }

  const [currentPage, maxPages, prevPage, nextPage, setPage] = usePages(1);
  const startingStaveIndex = currentPage * stavesPerPage - stavesPerPage;
  const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;

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
