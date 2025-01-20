import { useEffect, useState } from 'react';
import styles from './MainView.styles.module.css';
import { ViewType } from '@layouts/MainView/MainView.types';
import PagedView from '@layouts/PagedView/PagedView';
import ScrollableView from '@layouts/ScrollableView/ScrollableView';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import LabeledToggle from '@components/LabeledToggle/LabeledToggle';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';

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
    const dontShowAddingComponent = () => {
      setIsAddingNotesComponentVisible(false);
    };
    EventNotifier.AddListener('startAddingNotes', showAddingComponent);
    EventNotifier.AddListener('stopAddingNotes', dontShowAddingComponent);
    return () => {
      EventNotifier.RemoveListener('startAddingNotes', showAddingComponent);
      EventNotifier.RemoveListener('stopAddingNotes', dontShowAddingComponent);
    };
  }, []);

  return (
    <div className={styles.mainView}>
      {isAddingNotesComponentVisible && (
        <div className={styles.additionalBar}>
          <div
            className={styles.note}
            onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Whole)}>
            &#x1D15D;
          </div>
          <div
            className={styles.note}
            onClick={() => (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Half)}>
            &#x1D15E;
          </div>
          <div
            className={styles.note}
            onClick={() =>
              (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Quarter)
            }>
            &#x1D15F;
          </div>
          <div
            className={styles.note}
            onClick={() =>
              (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Eighth)
            }>
            &#x1D160;
          </div>
          <div
            className={styles.note}
            onClick={() =>
              (NotationRenderer.getInstance().AddedDurationNote = NoteDuration.Sixteenth)
            }>
            &#x1D161;
          </div>
        </div>
      )}
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
