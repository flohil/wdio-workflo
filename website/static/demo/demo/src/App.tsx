import * as React from 'react';

import { Fabric } from 'office-ui-fabric-react';
import './App.css';
import { Header } from './Header';
import { Main } from './Main';

class App extends React.Component {
  public render() {
    return (
      <Fabric className="App">
        <Header />
        <Main />
      </Fabric>
    );
  }
}

export default App;
