import './main.css';
import MainView from '@renderer/components/MainView/MainView';
import TopBar from '@renderer/components/TopBar/TopBar';

function MainLayout(): JSX.Element {
  return (
    <div id="mainLayout">
      <TopBar></TopBar>
      <MainView></MainView>
    </div>
  );
}

export default MainLayout;
