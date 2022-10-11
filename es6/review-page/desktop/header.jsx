import React, {Component} from 'react'

class Header extends Component {
  _renderHeader() {
    return(
      <header>
        <nav className="container desktop">
          <a className="logo" href="#">
            <img src={Django.static('images/appointpal/banner-logo.svg')}/>
          </a>
          <ul className="navItems">
            <li><a href="/ap-login/" className="login">Log in</a></li>
          </ul>
        </nav>
      </header>
    );
  }
  render() {
    return (
      ::this._renderHeader()
    );
  }
}

export { Header };
