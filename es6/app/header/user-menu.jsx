import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Link} from 'react-router-component'
import classnames from 'classnames'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'
import {toggleContactPrompt, toggleUpgradePrompt} from '../actions'

@branch({
  account_logo: ['account', 'account_logo'],
  first_name: ['user', 'first_name'],
  last_name: ['user', 'last_name'],
})
class UserToggleInner extends Component {
  render() {
    const {account_logo, first_name, last_name} = this.props;
    const logo_exists = (account_logo != Django.media_url);
    return (
      <div>
        {first_name}
        <div className="logo-thumbnail">
          {
            (logo_exists) ? <img src={account_logo} /> : <span>{first_name.charAt(0)}{last_name.charAt(0)}</span>
          }
        </div>
      </div>
    );
  }
}

@branch({
  visible: ['drop_down', 'user_menu', 'visible'],
  active: ['drop_down', 'user_menu', 'active'],
  first_name: ['user', 'first_name'],
  last_name: ['user', 'last_name'],
  username: ['user', 'username'],
  vertical: ['account', 'vertical'],
})
class UserMenu extends Component {
  _openMarketplace() {
    window.open("https://www.appointpal.com/marketplace", "_blank");
  }
  _toggleContactPrompt() {
    this.props.dispatch(toggleContactPrompt);
  }
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  _renderUserMenu() {
    const { visible, first_name, last_name, username, vertical} = this.props;
    const dropdownClass = classnames('username', 'dropdown-wrapper', {'open': visible})
    return (
      <div className={dropdownClass}>
        <i className="fa fa-shopping-cart marketplace" onClick={::this._openMarketplace}></i>
        <DropDownToggle className="username" id="user_menu">
          <UserToggleInner />
        </DropDownToggle>
        {
          visible &&
          <DropDownMenu id="user_menu" {...this.props}>
            <div className="title">
              <span className="name">{first_name} {last_name}</span>
              <span className="email">{username}</span>
              <div className="divider"></div>
            </div>
            <li><Link href='/team/'><i className="fa fa-users"></i> Add user</Link></li>
            <li><Link href='/settings/'><i className="fa fa-cogs"></i> Settings</Link></li>
            <li><a onClick={::this._toggleContactPrompt}><i className="fa fa-comment"></i> Help</a></li>
            <li><a href={Django.url('users:logout')}><i className="fa fa-sign-out"></i> Logout</a></li>
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderUserMenu()}
      </div>
    );
  }
}

export { UserMenu };