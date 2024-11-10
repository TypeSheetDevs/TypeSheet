import NoteViewSVGRenderer from '@components/NoteViewSVGRenderer/NoteViewSVGRenderer';

function PagedView() {
  return (
    <div id="pagedView">
      Paged
      <NoteViewSVGRenderer
        lastStaveIndex={5}
        startingHeight={0}
        startingStaveIndex={0}
      />
    </div>
  );
}

export default PagedView;
