import TopBar from '@components/TopBar/TopBar';
import { MainTopBarButtonsLayout } from '@components/TopBar/MainTopBarButtonsLayout';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import OpenCloseButton from '@components/TopBar/OpenCloseButton/OpenCloseButton';

function TopBarMainLayout() {
  return (
    <TopBar
      buttonsGroups={MainTopBarButtonsLayout}
      endButton={
        <OpenCloseButton
          style={{ marginLeft: 'auto', order: 100 }}
          onToggle={EventNotifier.NotifyAction('toggleConfigManager')}
        />
      }
    />
  );
}

export default TopBarMainLayout;
