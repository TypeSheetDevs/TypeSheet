import { useEffect, useState } from 'react';
import styles from './MainView.styles.module.css';
import { ViewType } from '@layouts/MainView/MainView.types';
import PagedView from '@layouts/PagedView/PagedView';
import ScrollableView from '@layouts/ScrollableView/ScrollableView';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import LabeledToggle from '@components/LabeledToggle/LabeledToggle';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import NoteModsTopBar from '@components/NoteModsTopBar/NoteModsTopBar';

function MainView() {
  const [currentView, setCurrentView] = useState(
    ConfigService.getInstance().getValue(SavedParameterName.StartingView),
  );
  const [isAddingNotesComponentVisible, setIsAddingNotesComponentVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const showAddingComponent = () => {
      setIsAddingNotesComponentVisible(true);
    };
    EventNotifier.AddListener('startAddingNotes', showAddingComponent);
    return () => {
      EventNotifier.RemoveListener('startAddingNotes', showAddingComponent);
    };
  }, []);

  return (
    <div className={styles.mainView}>
      {isAddingNotesComponentVisible && <NoteModsTopBar />}
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
