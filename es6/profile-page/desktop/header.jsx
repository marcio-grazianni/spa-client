import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
  'sv_logo': ['sv_logo']
})
class Header extends Component {
  _renderHeader() {
    const {sv_logo} = this.props;
    return(
      <header>
        <nav className="container desktop">
          <a className="logo" href="#">
            <img src={sv_logo}/>
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
