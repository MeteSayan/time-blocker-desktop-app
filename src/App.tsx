import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import MainApp from './apps/Main';
import TrayApp from './apps/Tray';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Switch >
        <Route path='/tray' component={TrayApp} />
        <Route path='/' component={MainApp} />
      </Switch>
    </HashRouter>
  );
}

export default App;
