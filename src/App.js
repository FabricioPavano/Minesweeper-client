import React from 'react';
import Menu        from './components/menu.component'
import NewGameForm from './components/new-game-form.component'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Menu />
        </Route>
        <Route exact path="/new">
          <NewGameForm />
        </Route>
      </Switch>
    </Router>
  )

}

export default App;
