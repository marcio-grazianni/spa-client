import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import * as actions from './actions'

@branch({})
class FilterItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _changeFilter () {
    this.props.dispatch(
      actions.changeFilter,
      this.props.value
    )
  }
  _renderFilterItem() {
    const {value, selected_filter} = this.props;
    const type_class = classnames('testimonial-filter', {'active': (value == selected_filter)})
    return (
      <li
        className={type_class}
        onClick={::this._changeFilter}
      >
        <label>
          {value}
        </label>
      </li>
    );
  }
  render() {
    return (
      ::this._renderFilterItem()
    )
  }
}

@branch({
  selected: ['testimonials', 'selected_top_menu'],
  selected_filter: ['testimonials', 'selected_filter']
})
class FilterBar extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderFilterBar() {
    const {selected} = this.props;
    let {selected_filter} = this.props; //will change selected_filter to 'all' if other filters not available
    let AvailableFilters = [];
    if (selected == 'posted') {
      AvailableFilters = ['all', 'open', 'replied'];
    }
    else {
      AvailableFilters = ['all'];
      selected_filter = 'all'; //only available filter
    }
    let FilterComponents = [];
    for (let [index, value] of AvailableFilters.entries()) {
      let item = <FilterItem key={index} value={value} selected_filter={selected_filter} />
      FilterComponents.push(item);
    }
    return (
      <div className='filter-bar'>
        <ul className='testimonial-filters'>
          {FilterComponents}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderFilterBar()
    );
  }
}

export { FilterBar };