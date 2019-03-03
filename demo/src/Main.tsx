import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from './Feed';
import './Main.css';
import { Registration } from './Registration';

const LandingPage = (props: Route['props']) => {
  return <Redirect to="/demo/feed"/>;
}

export class Main extends React.Component {
  public render() {
    return (
      <main className="Main">
        <Switch>
          <Route
            path="/demo/feed"
            component={Feed}
          />
          <Route
            path="/demo/registration"
            component={Registration}
          />
          <Route
            path="/demo/"
            component={LandingPage}
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