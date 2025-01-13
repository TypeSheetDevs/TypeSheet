import { useState } from 'react';
import styles from './MainView.styles.module.css';
import { ViewType } from '@layouts/MainView/MainView.types';
import PagedView from '@layouts/PagedView/PagedView';
import ScrollableView from '@layouts/ScrollableView/ScrollableView';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import LabeledToggle from '@components/LabeledToggle/LabeledToggle';

function MainView() {
  const [currentView, setCurrentView] = useState(
    ConfigService.getInstance().getValue(SavedParameterName.StartingView),
  );

  return (
    <div className={styles.mainView}>
      <LabeledToggle
        toggled={currentView == ViewType.Paged}
        onToggle={() =>
          setCurrentView(currentView == ViewType.Paged ? ViewType.Scrollable : ViewType.Paged)
        }
        toggledText="Paged"
        unToggledText="Scrollable"
      />
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
