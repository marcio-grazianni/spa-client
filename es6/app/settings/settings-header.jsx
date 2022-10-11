import React, {Component} from 'react'
import classnames from 'classnames'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'
import {onChangeSection, setSettingsLock, selectTable} from './actions'
import {hideDropdown} from '../actions'

@branch({
  selected: ['settings', 'selected_top_menu'],
  settings_lock: ['account', 'settings_lock'],
  vertical_config: ['account', 'vertical_config'],
})
class SettingsHeader extends Component {
  componentDidMount() {
    if (this.props.settings_lock) {
      this.props.dispatch(
        setSettingsLock
      );
    }
  }
  _renderSettingsHeader() {
    const {selected, settings_lock} = this.props;

    let MenuItems = [{value: 'notifications', label: 'notifications'}];
    if(!settings_lock) {
      MenuItems.unshift({value: 'password', label: 'password'});
      MenuItems.unshift({value: 'company_info', label: 'company info'});
      MenuItems.unshift({value: 'user_info', label: 'user info'});
    }
    return (
      <SectionHeader
        id="settings"
        icon="fa-cogs"
        title="Settings"
        datePickerEnabled={false}
      >
        <TopMenu
          section="settings"
          selected={selected}
          MenuItems={MenuItems}
          onChange={onChangeSection}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderSettingsHeader()
    );
  }
}

export { SettingsHeader };