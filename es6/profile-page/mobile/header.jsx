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
        <nav className="container">
          <a className="logo" href="#">
            <img src={sv_logo}/>
          </a>
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
