import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'
import {Table, Column, Cell} from 'fixed-data-table'
import {changeSearchQuery, handleSort, selectToggle, unselectAll, unsubscribeSelected, openBulkAdd, openBulkRemove} from './actions'

@branch({
  search_query: ['settings', 'subscribers', 'search_query'],
})
class SearchQuery extends Component {
  _changeSearchQuery(e) {
    this.props.dispatch(
      changeSearchQuery,
      e.currentTarget.value,
    );
  }
  render() {
    const {search_query} = this.props;
    return (
      <div className='search-query'>
        <label><i className='fa fa-search'></i></label>
        <input
          className='search-input'
          type='text'
          value={search_query}
          onChange={::this._changeSearchQuery}
        />
      </div>
    );
  }
}

@branch({
  selected_ids: ['settings', 'subscribers', 'selected_ids'],
})
class SelectOptions extends Component {
  _unsubscribeSelected() {
    this.props.dispatch(unsubscribeSelected);
  }
  _unselectAll() {
    this.props.dispatch(unselectAll);
  }
  render() {
    const {selected_ids} = this.props;
    return (
      <ul className='select-options'>
        <li className='selected'>
          {selected_ids.length} selected
        </li>
        <li className='unselect-all' onClick={::this._unselectAll}>
          Unselect All
        </li>
        <li className='unsubscribe' onClick={::this._unsubscribeSelected}>
          Unsubscribe
        </li>
      </ul>
    );
  }
}

@branch({
  sort: ['settings', 'subscribers', 'sort'],
  sort_direction: ['settings', 'subscribers', 'sort_direction'],
})
class HeaderCell extends Component {
  _handleSort() {
    const {field} = this.props;
    this.props.dispatch(
      handleSort,
      field,
    );
  }
  render() {
    const {title, field, sort, sort_direction} = this.props;
    const wrapper_class = classnames('header-wrapper', {'center-aligned': (field !== "email")});
    let sort_icon = null;
    if (sort === field) {
      sort_icon = <i className={`fa fa-caret-${sort_direction}`} />;
    }
    return (
      <Cell onClick={::this._handleSort}>
        <div className={wrapper_class}>
          <span className='header'>{title}{sort_icon}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  subscriber_list: ['settings', 'subscribers', 'displayed_list'],
})
class TextCell extends Component {
  _getSubscriber() {
    return this.props.subscriber_list[this.props.rowIndex];
  }
  _selectToggle() {
    const {id} = ::this._getSubscriber();
    this.props.dispatch(
      selectToggle,
      id,
    );
  }
  render() {
    const {active_rank, field, rowIndex} = this.props;
    const subscriber = ::this._getSubscriber();
    const {selected} = subscriber;
    let display_str;
    if (field === 'response_rate') {
      display_str = `${subscriber[field]}%`;
    } else {
      display_str = subscriber[field];
    }
    const wrapper_class = classnames('value-wrapper', {'center-aligned': (field !== "email"), 'active': selected});
    return (
      <Cell onClick={::this._selectToggle}>
        <div className={wrapper_class}>
          <span className='value'>{display_str}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  subscriber_list: ['settings', 'subscribers', 'displayed_list'],
})
class SubscriptionCell extends Component {
  _getSubscriber() {
    return this.props.subscriber_list[this.props.rowIndex];
  }
  _selectToggle() {
    const {id} = ::this._getSubscriber();
    this.props.dispatch(
      selectToggle,
      id,
    );
  }
  render() {
    const {active_rank, rowIndex} = this.props;
    const subscriber = ::this._getSubscriber();
    const {selected} = subscriber;
    const unsubscribed = subscriber['unsubscribed'];
    let display_str;
    if (unsubscribed) {
      display_str = `Unsubscribed at ${subscriber['unsubscribed_at']}`
    }
    else {
      display_str = 'Subscribed';
    }
    const wrapper_class = classnames('value-wrapper', 'center-aligned', {'active': selected});
    return (
      <Cell onClick={::this._selectToggle}>
        <div className={wrapper_class}>
          <span className='value'>{display_str}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  subscriber_list: ['settings', 'subscribers', 'displayed_list'],
})
class Subscribers extends Component {
  _openBulkAdd() {
    this.props.dispatch(openBulkAdd)
  }
  _openBulkRemove() {
    this.props.dispatch(openBulkRemove)
  }
  render() {
    const {subscriber_list} = this.props;
    return (
      <div className="settingsContent searchableTable" id="subscribers">
        <form className='form-horizontal'>
          <div className='sub-header'>
            <div className='info'>
              <h3>Subscribers</h3>
              <p>Monitor and manage individual subscribers added through the Accelerator feature.</p>
            </div>
            <div className='bulk-upload-remove'>
              <button type='button' className='btn btn-cta' onClick={::this._openBulkAdd}>Bulk Add</button>
              <button type='button' className='btn btn-cta' onClick={::this._openBulkRemove}>Bulk Remove</button>
            </div>
          </div>
          <SearchQuery />
          <SelectOptions />
          <div className="table subscriber-table">
            <MediaQuery minWidth={1420}>
              <Table
                rowsCount={subscriber_list.length}
                headerHeight={40}
                rowHeight={40}
                width={1040}
                height={500}
              >
                <Column
                  header={<HeaderCell title='Email' field='email' />}
                  cell={<TextCell field='email' />}
                  width={500}
                />
                <Column
                  header={<HeaderCell title='Sends' field='sends' />}
                  cell={<TextCell field='sends' />}
                  width={150}
                />
                <Column
                  header={<HeaderCell title='Response Rate' field='response_rate' />}
                  cell={<TextCell field='response_rate' />}
                  width={150}
                />
                <Column
                  header={<HeaderCell title='Subscription Status' field='subscription' />}
                  cell={<SubscriptionCell />}
                  width={240}
                />
              </Table>
            </MediaQuery>
            <MediaQuery minWidth={1200} maxWidth={1419}>           
              <Table
                rowsCount={subscriber_list.length}
                headerHeight={40}
                rowHeight={40}
                width={1080}
                height={500}
              >
                <Column
                  header={<HeaderCell field='Email' />}
                  cell={<TextCell field='email' />}
                  width={432}
                />
                <Column
                  header={<HeaderCell field='Sends' />}
                  cell={<TextCell field='sends' />}
                  width={144}
                />
                <Column
                  header={<HeaderCell field='Response Rate' />}
                  cell={<TextCell field='response_rate' />}
                  width={144}
                />
              </Table>
            </MediaQuery>
            <MediaQuery maxWidth={1199}>     
              <Table
                rowsCount={subscriber_list.length}
                headerHeight={40}
                rowHeight={40}
                width={1080}
                height={500}
              >
                <Column
                  header={<HeaderCell field='Email' />}
                  cell={<TextCell field='email' />}
                  width={432}
                />
                <Column
                  header={<HeaderCell field='Sends' />}
                  cell={<TextCell field='sends' />}
                  width={144}
                />
                <Column
                  header={<HeaderCell field='Response Rate' />}
                  cell={<TextCell field='response_rate' />}
                  width={144}
                />
              </Table>
            </MediaQuery>
          </div>
        </form>
      </div>
    );
  }
}

export { Subscribers };