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
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';

function MainView() {
  const [currentView, setCurrentView] = useState(
    ConfigService.getInstance().getValue(SavedParameterName.StartingView),
  );
  const [notationRendererState, setNotationRendererState] = useState(
    NotationRenderer.getInstance().State,
  );

  useEffect(() => {
    EventNotifier.AddListener('rendererStateChanged', state => setNotationRendererState(state));
    return () => {
      EventNotifier.RemoveListener('rendererStateChanged', state =>
        setNotationRendererState(state),
      );
    };
  }, []);

  return (
    <div className={styles.mainView}>
      {notationRendererState === NotationRendererState.AddingNote && <NoteModsTopBar />}
      {notationRendererState === NotationRendererState.ModifyingNote && <NoteModsTopBar />}
      {notationRendererState === NotationRendererState.MoveNote && <NoteModsTopBar />}
      {notationRendererState === NotationRendererState.AddingToChord && <NoteModsTopBar />}
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
