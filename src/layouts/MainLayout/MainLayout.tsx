import styles from './MainLayout.styles.module.css';
import MainView from '@layouts/MainView/MainView';
import TopBar from '@components/TopBar/TopBar';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { useEffect, useState } from 'react';
import ConfigManager from '@components/ConfigManager/ConfigManager';
import MidiSelector from '@components/MidiSelector/MidiSelector';

function MainLayout(): JSX.Element {
  const [showConfigManager, setShowConfigManager] = useState<boolean>(false);
  const visible = false;

  useEffect(() => {
    const toggleConfigManagerHandler = () => {
      setShowConfigManager(prevState => !prevState);
    };

    EventNotifier.AddListener('toggleConfigManager', toggleConfigManagerHandler);

    return () => {
      EventNotifier.RemoveListener('toggleConfigManager', toggleConfigManagerHandler);
    };
  }, []);

  return (
    <div className={styles.mainLayout}>
      <TopBar></TopBar>
      <MidiSelector />
      {visible && showConfigManager && <ConfigManager />}
      {visible && !showConfigManager && <MainView></MainView>}
    </div>
  );
}

export default MainLayout;
