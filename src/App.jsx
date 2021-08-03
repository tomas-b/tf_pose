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
import "./index.css";

const App = () => {
  return (
    <RecoilRoot>
    <Router>
      <nav>
        <Link to="/collect">Collect</Link>
        <Link to="/train">Train</Link>
        <Link to="/classify">Classify</Link>
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
        <Redirect from="/" to="/collect" />
      </Switch>
    </Router>
    </RecoilRoot>
  );
};

export default App;
