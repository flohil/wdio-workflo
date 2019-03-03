import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { Contact } from './Contact';
import { Feed } from './Feed';
import './Main.css';

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
            path="/contact"
            component={Contact}
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