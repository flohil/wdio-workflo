import { Fabric } from 'office-ui-fabric-react';
import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { registerIcons } from '@uifabric/styling';

import './App.css';
import { Header } from './Header';
import { Main } from './Main';



registerIcons({
  icons: {
    CheckMark: <FontAwesomeIcon icon="check"/>,
  }
})

class App extends React.Component {
  public render() {
    return (
      <Fabric className="App">
        <Header />
        <Main/>
      </Fabric>
    );
  }
}

export default App;
