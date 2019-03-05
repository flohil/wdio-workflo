import { Fabric } from 'office-ui-fabric-react';
import * as React from 'react';

import fontawesome from '@fortawesome/fontawesome'
import { faCheck, faChevronDown } from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { registerIcons } from '@uifabric/styling';

import './App.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';

fontawesome.library.add(faCheck);
fontawesome.library.add(faChevronDown);

registerIcons({
  icons: {
    CheckMark: <FontAwesomeIcon icon="check"/>,
    ChevronDown: <FontAwesomeIcon icon="chevron-down"/>,
    Down: <FontAwesomeIcon icon="chevron-down" />,
  }
})

class App extends React.Component {
  public render() {
    return (
      <Fabric className="App">
        <Header className="App-header"/>
        <Main className="App-main"/>
        <Footer className="App-footer"/>
      </Fabric>
    );
  }
}

export default App;
