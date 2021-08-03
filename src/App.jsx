import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Collect from './Collect'
import './index.css'

const App = () => {
  return (
    <Router>
      <nav>
        <Link to='/collect'>Collect</Link>
        <Link to='/train'>Train</Link>
        <Link to='/classify'>Classify</Link>
      </nav>
      <Switch>
        <Route path="/collect">
          <Collect/>
        </Route>
        <Route path="/train">
          <h1>train</h1>
        </Route>
        <Route path="/classify">
          <h1>classify</h1>
        </Route>
        <Redirect from='/' to='/collect'/>
      </Switch>
    </Router>
  );
};

export default App;
