import './main.css';
import MainView from '@renderer/components/MainView/MainView';
import TopBar from '@renderer/components/TopBar/TopBar';

function MainLayout(): JSX.Element {
  return (
    <>
      <TopBar></TopBar>
      <MainView></MainView>
    </>
  );
}

export default MainLayout;
