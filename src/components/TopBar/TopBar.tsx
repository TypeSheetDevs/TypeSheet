import './TopBar.styles.css';
import { topBarColor } from '../../data/config';
import Button from '@components/Button/Button';

function TopBar() {
  return (
    <div
      className="top-bar"
      style={{ backgroundColor: topBarColor }}>
      <Button
        iconPath={'../../assets/icons/music_note.svg'}
        onClick={() => {}}></Button>
    </div>
  );
}

export default TopBar;
