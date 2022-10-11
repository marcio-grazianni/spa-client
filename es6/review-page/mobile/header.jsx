import React, {Component} from 'react'

class Header extends Component {
  _renderHeader() {
    return(
      <header>
        <nav className="container">
          <a className="logo" href="#">
            <img src={Django.static('images/appointpal/banner-logo.svg')}/>
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
