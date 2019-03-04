import * as classnames from 'classnames';
import * as React from 'react';
import { RouteComponentProps, RouteProps, withRouter } from "react-router";
import { Link } from 'react-router-dom';

import './Header.css';

interface IHeaderProps {
  className?: string
}

class Header extends React.Component<RouteProps & RouteComponentProps<any> & IHeaderProps> {

  public static PAGE_NAMES = ['Feed', 'Registration'];

  public renderLinks() {
    return Header.PAGE_NAMES.map(
      pageName => {
        const linkStyles = classnames({
          ["Header-link"]: true,
          ["Header-link-active"]: `/demo/${pageName.toLowerCase()}` === this.props.location.pathname
        })

        return (
          <li key={`/demo/${pageName.toLowerCase()}`} className="Header-li">
            <Link to={`/demo/${pageName.toLowerCase()}`} className={linkStyles}>
              {pageName}
            </Link>
          </li>
        )
      }
    )
  }

  public render() {
    return (
      <header className={classnames("header", this.props.className)}>
        <nav className="Header-nav">
          <ul className="Header-ul">
            {this.renderLinks()}
          </ul>
        </nav>
      </header>
    );
  }
}

const HeaderWithRouter = withRouter(Header);

export { HeaderWithRouter as Header }