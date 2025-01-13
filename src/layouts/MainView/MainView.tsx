import { useState } from 'react';
import styles from './MainView.styles.module.css';
import { ViewType } from '@layouts/MainView/MainView.types';
import PagedView from '@layouts/PagedView/PagedView';
import ScrollableView from '@layouts/ScrollableView/ScrollableView';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import LabeledToggle from '@components/LabeledToggle/LabeledToggle';
import { Notation } from '@services/notationRenderer/Notation';

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
      <button onClick={async () => Notation.getInstance().SaveToJson()}>save</button>
      <button onClick={async () => Notation.getInstance().ReadFromJson()}>read</button>
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
