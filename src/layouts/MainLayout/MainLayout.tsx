import styles from './MainLayout.styles.module.css';
import MainView from '@layouts/MainView/MainView';
import TopBar from '@components/TopBar/TopBar';

function MainLayout(): JSX.Element {
  return (
    <div className={styles.mainLayout}>
      <TopBar></TopBar>
      <MainView></MainView>
    </div>
  );
}

export default MainLayout;
