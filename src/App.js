import React from 'react';
import Welcome     from './components/welcome.component'
import SignUp     from './components/signup.component'
import SignIn     from './components/signin.component'
import Menu        from './components/menu.component'
import NewGameForm from './components/new-game-form.component'
import MineSweeper from './components/minesweeper.component'
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
          <Welcome />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/signin">
          <SignIn />
        </Route>
        <Route exact path="/menu">
          <Menu />
        </Route>
        <Route exact path="/new">
          <NewGameForm />
        </Route>
        <Route exact path="/play/:uuid">
          <MineSweeper />
        </Route>
      </Switch>
    </Router>
  )

}

export default App;
