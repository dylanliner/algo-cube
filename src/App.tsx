import React from "react";
import PathFinding from "./components/PathFindingGrid";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import {
  Link as RouterLink,
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import Searching from "./components/Searching";
import Sorting from "./components/Sorting";
import TravellingSalesman from "./components/TravellingSalesman";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Button color="inherit" component={RouterLink} to="/path-finding">
              Path Finding
            </Button>
            <Button color="inherit" component={RouterLink} to="/sorting">
              Sorting
            </Button>
            <Button color="inherit" component={RouterLink} to="/searching">
              Searching
            </Button>
            <Button color="inherit" component={RouterLink} to="/tsp">
              Travelling Salesman Problem
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Redirect exact from="/" to="path-finding" />
          <Route path="/path-finding">
            <PathFinding />
          </Route>
          <Route path="/sorting">
            <Sorting />
          </Route>
          <Route path="/searching">
            <Searching />
          </Route>
          <Route path="/tsp">
            <TravellingSalesman />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
