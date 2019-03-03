import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from './Feed';
import './Main.css';
import { Registration } from './Registration';

const LandingPage = (props: Route['props']) => {
  return <Redirect to="/feed"/>;
}

export class Main extends React.Component {
  public render() {
    return (
      <main className="Main">
        <Switch>
          <Route
            path="/feed"
            component={Feed}
          />
          <Route
            path="/registration"
            component={Registration}
          />
          <Route
            path="/"
            component={LandingPage}
          />
        </Switch>
      </main>
    );
  }
}