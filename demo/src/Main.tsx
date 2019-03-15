import * as classnames from 'classnames';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from './Feed';
import './Main.css';
import { Registration } from './Registration';

interface IMainProps {
  className?: string
}

const LandingPage = (props: Route['props']) => {
  return <Redirect to="/wdio-workflo/demo/feed"/>;
}

export class Main extends React.Component<IMainProps> {
  public render() {
    return (
      <main className={classnames("main", this.props.className)}>
        <Switch>
          <Route
            path="/wdio-workflo/demo/feed"
            component={Feed}
          />
          <Route
            path="/wdio-workflo/demo/registration"
            component={Registration}
          />
          <Route
            path="/wdio-workflo/demo/"
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