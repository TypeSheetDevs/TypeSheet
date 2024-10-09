import { useState } from 'react';
import './MainView.styles.css';
import { ViewType } from './MainView.types';
import PagedView from '@components/PagedView/PagedView';
import ScrollableView from '@components/ScrollableView/ScrollableView';

function MainView() {
  const [currentView, setCurrentView] = useState(ViewType.Paged);

  return (
    <>
      <button
        onClick={() =>
          setCurrentView(currentView == ViewType.Paged ? ViewType.Scrollable : ViewType.Paged)
        }>
        Change View
      </button>
      {GetViewComponent(currentView)}
    </>
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
