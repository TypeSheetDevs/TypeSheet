import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';
// import { useEffect, useState } from 'react';
// import { ConfigService } from '@services/ConfigService/ConfigService';
// import { ConfigKey } from '@services/ConfigService/ConfigKey';

function PagedView() {
  const stavesPerPage = 4;

  const [currentPage, maxPages, prevPage, nextPage, setPage] = usePages(1);
  const startingStaveIndex = currentPage * stavesPerPage - stavesPerPage;
  const lastStaveIndex = startingStaveIndex + stavesPerPage - 1;

  const containerHeight = NotationRenderer.getInstance().StaveHeight * stavesPerPage;

  // useEffect(() => {
  //   const loadConfig = async () => {
  //     const configService = await ConfigService.getInstance();
  //     const value = configService.getValue(ConfigKey.BarsPerStave);
  //     if (value && Number(value)) {
  //       setStavesPerPage(Number(value));
  //     }
  //   };

  //   loadConfig().catch(console.error);
  // }, []);

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
