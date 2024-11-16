import { useEffect, useState } from 'react';
import styles from './MainView.styles.module.css';
import { ViewType } from '@layouts/MainView/MainView.types';
import PagedView from '@layouts/PagedView/PagedView';
import ScrollableView from '@layouts/ScrollableView/ScrollableView';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { ConfigKey } from '@services/ConfigService/ConfigKey';

function MainView() {
  const [currentView, setCurrentView] = useState(ViewType.Paged);

  useEffect(() => {
    const loadConfig = async () => {
      const configService = await ConfigService.getInstance();

      const viewType = await configService.getValue(ConfigKey.StartingView);
      if (viewType && parseInt(viewType)) {
        setCurrentView(parseInt(viewType));
      }
    };

    loadConfig().catch(console.error);
  }, []);

  return (
    <div className={styles.mainView}>
      <button
        onClick={() =>
          setCurrentView(currentView == ViewType.Paged ? ViewType.Scrollable : ViewType.Paged)
        }>
        Change View
      </button>
      <button
        onClick={() => {
          NotationRenderer.getInstance().AddNewStave(Math.floor(Math.random() * 7) + 1);
        }}>
        Add Bar
      </button>
      {GetViewComponent(currentView)}
    </div>
  );
}

function GetViewComponent(viewType: ViewType) {
  switch (viewType) {
    case ViewType.Paged:
      return <PagedView></PagedView>;
    case ViewType.Scrollable:
      return <ScrollableView></ScrollableView>;
  }

  throw new Error('Invalid View Type');
}

export default MainView;
