import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeField} from './actions'

@branch({
  active_field: ['locations', 'active_field'],
})
class MenuItem extends Component {
  _changeField() {
    this.props.dispatch(
      changeField,
      this.props.DataType.value
    )
  }
  render() {
    const {active_field} = this.props;
    const {value, label} = this.props.DataType;
    const menu_class = classnames('menu-item', {'active': (value === active_field)});
    return(
      <li className={menu_class}>
        <a onClick={::this._changeField}>
          {label}
        </a>
      </li>
    )
  }
}

class DataTypeMenu extends Component {
  _renderDataTypeMenu() {
    // TODO: pull all menu config from seperate file.
    const DataTypes = [{value: 'rating', label: 'Rating'}, {value: 'total_reviews', label: 'Total Reviews'}, {value: 'satisfaction', label: 'Satisfaction'}];
    let DataTypeComponents = DataTypes.map((DataType) => 
      <MenuItem DataType={DataType} key={DataType.value} />
    );
    return (
      <div className="data-type-menu top-menu">
        <ul className='top-menu'>
          {DataTypeComponents}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderDataTypeMenu()
    );
  }
}

export { DataTypeMenu };