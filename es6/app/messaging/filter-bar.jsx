import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import * as actions from './actions'
import {FilterMenu} from './filter-menu'


@branch({})
class FilterItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _scrollToActiveThread() {
    const activeEles = document.getElementsByClassName('message-thread active');
    if(activeEles && activeEles.length > 0) {
      const ele = activeEles[0];
      ele.scrollIntoView({'block': 'center'});
    }
  }
  _changeFilter () {
    this.props.dispatch(
      actions.changeFilter,
      this.props.value
    )
    let callback = () => ::this._scrollToActiveThread();
    setTimeout(callback, 0);
  }
  _renderFilterItem() {
    const {value, selected_filter} = this.props;
    const type_class = classnames('message-thread-filter', {'active': (value == selected_filter)})
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

@branch({})
class SubfilterItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _changeSubfilter () {
    this.props.dispatch(
      actions.changeSubfilter,
      this.props.value
    )
  }
  _renderSubfilterItem() {
    const {display, value, selected_subfilter} = this.props;
    const subfilter_class = classnames({'active': (value == selected_subfilter)})
    return (
      <li
        className={subfilter_class}
        onClick={::this._changeSubfilter}
      >
        <label>
          {display}
        </label>
      </li>
    );
  }
  render() {
    return (
      ::this._renderSubfilterItem()
    )
  }
}

@branch({
  selected: ['messages', 'selected_top_menu'],
  selected_filter: ['messages', 'selected_filter'],
  selected_subfilter: ['messages', 'selected_type']
})
class FilterBar extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _showFilters() {
    this.props.dispatch(
      actions.showFilters
    )
  }
  _renderFilterBar() {
    const {selected, selected_filter, selected_subfilter} = this.props;
    let AvailableFilters = ['all', 'open', 'closed'];
    let FilterComponents = [];
    for (let [index, value] of AvailableFilters.entries()) {
      let item = <FilterItem key={index} value={value} selected_filter={selected_filter} />
      FilterComponents.push(item);
    }
    return (
      <div className='filter-bar'>
        <ul className='message-thread-filters'>
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