import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {LocationSelector} from './location-selector'
import {UserMenu} from './user-menu'

@branch({
})
class DesktopHeader extends Component {
  render() {
    return (
      <div className='wrapper newHeader'>
        <header className='desktop'>
          <nav className="mainContainer">
            <div id="signedIn">
              <LocationSelector />
              <UserMenu />
            </div>
          </nav>
          <div className='clearfix'></div>
        </header>
      </div>
    );
  }
}

export { DesktopHeader };
