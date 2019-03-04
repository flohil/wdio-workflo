import * as classnames from 'classnames';
import * as React from 'react';

import './Footer.css';

interface IFooterProps {
  className?: string
}

export class Footer extends React.Component<IFooterProps> {
  public render() {
    const frameworkStr = "This page was built to demonstrate the usage of "
    const examplesStr = "Check out the example code "

    return (
      <footer className={classnames("footer", this.props.className)}>
        {frameworkStr}<a href="https://github.com/flohil/wdio-workflo" className="Footer-link">wdio-workflo</a>.
        <br />
        {examplesStr}<a href="https://github.com/flohil/wdio-workflo-example" className="Footer-link">here</a>.
      </footer>
    );
  }
}
