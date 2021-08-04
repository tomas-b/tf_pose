import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import Collect from "./Collect";
import Train from "./Train";
import Classify from "./Classify";
import TrainRegression from "./TrainRegression";
import Regression from "./Regression";
import "./index.css";

const App = () => {
  return (
    <RecoilRoot>
    <Router>
      <nav>
        <Link to="/collect">Collect</Link>
         - [
        <Link to="/train">Train</Link>
        <Link to="/classify">Classify</Link>
         ] - [
        <Link to="/trainRegression">Train Regression</Link>
        <Link to="/regression">regression</Link>
         ]
      </nav>
      <Switch>
        <Route path="/collect">
          <Collect />
        </Route>
        <Route path="/train">
          <Train />
        </Route>
        <Route path="/classify">
          <Classify />
        </Route>
        <Route path="/trainRegression">
          <TrainRegression />
        </Route>
        <Route path="/regression">
          <Regression />
        </Route>
        <Redirect from="/" to="/collect" />
      </Switch>
    </Router>
    </RecoilRoot>
  );
};

export default App;
