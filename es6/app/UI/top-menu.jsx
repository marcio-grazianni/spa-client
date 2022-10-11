import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import * as actions from '../actions'

@branch({})
class MenuItem extends Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
  };
  _changeSection() {
    this.props.dispatch(
      actions.changeTopMenuSection,
      this.props.section,
      this.props.value
    );
    if (this.props.onChange) { //Section specific callback passed through props.
      this.props.dispatch(
        this.props.onChange
      )
    }
  }
  _renderMenuItem() {
    const {value, label, selected, control} = this.props;
    const menu_class = classnames('menu-item', {'active': (value == selected)});
    return (
      <li className={menu_class}>
        <a onClick={::this._changeSection}>
          {label}
        </a>
        {
          control &&
          control
        }
      </li>
    );
  }
  render() {
    return (
      ::this._renderMenuItem()
    );
  }
}

class TopMenu extends Component {
  static propTypes = {
    section: React.PropTypes.string.isRequired,
  };
  _renderTopMenu() {
    const {section, MenuItems} = this.props;
    const top_menu_class = classnames('top-menu', `${section}-menu`);
    const MenuItemComponents = MenuItems.map((item) =>
      <MenuItem
        key={item.value}
        value={item.value}
        label={item.label}
        control={item.control}
        {...this.props}
      />
    );
    return (
      <div className={top_menu_class}>
        <ul className='top-menu'>
          {MenuItemComponents}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTopMenu()
    );
  }
}

export { TopMenu }
