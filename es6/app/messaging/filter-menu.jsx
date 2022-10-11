import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Link} from 'react-router-component'
import classnames from 'classnames'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'

@branch({
  visible: ['drop_down', 'filter_menu', 'visible'],
  active: ['drop_down', 'filter_menu', 'active']
})
class FilterMenu extends Component {
  _renderFilterMenu() {
    const { visible } = this.props;
    const dropdownClass = classnames('dropdown-wrapper', {'open': visible})
    return (
      <div className={dropdownClass}>
        <DropDownToggle id="filter_menu">
          <img className='filter-funnel' src={Django.static(`images/appointpal/funnel.png`)} />
        </DropDownToggle>
        {
          visible &&
          <DropDownMenu id="filter_menu" {...this.props}>
            {this.props.children}
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderFilterMenu()}
      </div>
    );
  }
}

export { FilterMenu };