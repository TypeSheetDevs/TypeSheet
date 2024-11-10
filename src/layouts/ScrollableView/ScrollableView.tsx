import NoteViewRenderer from '@components/NoteViewRenderer/NoteViewRenderer';
import { useState } from 'react';

function ScrollableView() {
  return (
    <div id="scrollableView">
      Scrollable
      <NoteViewRenderer
        lastStaveIndex={3}
        startingHeight={-50}
        startingStaveIndex={0}
      />
    </div>
  );
}

export default ScrollableView;
