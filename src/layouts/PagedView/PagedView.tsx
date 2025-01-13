import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import usePages from './usePages';
import styles from './PagedView.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { getRendererEngine } from '@utils/getRendererEngine';
import { useState } from 'react';
import NumericInput from '@components/NumericInput/NumericInput';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import ArrowButton from '@components/ArrowButton/ArrowButton';

function PagedView() {
  const rendererEngine = ConfigService.getInstance().getValue(SavedParameterName.RendererEngine);
  const [currentPage, maxPages, prevPage, nextPage, setPage] = usePages(1);
  const [stavesPerPage, setStavesPerPage] = useState(
    ConfigService.getInstance().getValue(SavedParameterName.StavesPerPage),
  );

  const onChangeStaves = (staves: number) => {
    ConfigService.getInstance().updateValue(SavedParameterName.StavesPerPage, staves);
    setStavesPerPage(staves);
    EventNotifier.Notify('needsRender');
  };

  const containerHeight = NotationRenderer.getInstance().StaveHeight * stavesPerPage;

  return (
    <>
      <div className={styles.pagedView}>
        <div
          className={styles.container}
          style={{ height: `${containerHeight}px` }}>
          {getRendererEngine(rendererEngine)}
        </div>
      </div>
      <div className={styles.nav}>
        <div className={styles.stavesPerPage}>
          Staves per page:
          <NumericInput
            value={stavesPerPage}
            max={10}
            min={1}
            onChange={onChangeStaves}
          />
        </div>
        <div className={styles.pages}>
          <input
            type="number"
            className={styles.pagesInput}
            value={currentPage}
            onChange={e => setPage(Number.parseInt(e.target.value))}
          />
          of {maxPages}
          <div className={styles.pagesButtons}>
            <ArrowButton
              direction={'left'}
              onClick={prevPage}
            />
            <ArrowButton
              direction={'right'}
              onClick={nextPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PagedView;
