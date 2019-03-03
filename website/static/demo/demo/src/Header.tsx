import * as classnames from 'classnames';
import * as React from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';

import './Header.css';

interface IHeaderProps {
  history: any,
  location: any,
  match: any
}

class Header extends React.Component<IHeaderProps> {

  public static PAGE_NAMES = ['Feed', 'Contact'];

  public renderLinks() {
    return Header.PAGE_NAMES.map(
      pageName => {
        const linkStyles = classnames({
          ["Header-link"]: true,
          ["Header-link-active"]: `/${pageName.toLowerCase()}` === this.props.location.pathname
        })

        return (
          <li key={`/${pageName.toLowerCase()}`} className="Header-li">
            <Link to={`/${pageName.toLowerCase()}`} className={linkStyles}>
              {pageName}
            </Link>
          </li>
        )
      }
    )
  }

  public render() {
    return (
      <header>
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