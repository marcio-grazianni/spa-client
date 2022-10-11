import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import {branch} from 'baobab-react/higher-order'
import {onSearchInput, exportTable} from './actions'

@branch({
  query: ['activity', 'search_query'],
  selected: ['activity', 'selected_top_menu']
})
class SearchQuery extends Component {
  _changeSearchQuery(e) {
    const {table} = this.props;
    this.props.dispatch(
      onSearchInput,
      e.currentTarget.value,
      table,
    );
  }
  _exportTable(e) {
    const {table} = this.props;
    this.props.dispatch(
      exportTable,
      table,
    );
  }
  render() {
    const {query, selected} = this.props;
    return (
      <div className='search-query'>
        <label className='search-label'><i className='fa fa-search'></i></label>
        <input
          className='search-input'
          type='text'
          value={query}
          onChange={::this._changeSearchQuery}
        />
        {
          (selected != 'contacts' && selected != 'plans' && selected != 'subscriptions' && selected != 'appointments' && selected != 'appointment_requests') &&
          <label
            className='export-label'
            onClick={::this._exportTable}
          >
            <ReactTooltip id='export' multiline effect='solid' place='top'>
              <span>Export</span>
            </ReactTooltip>
            <i className='fa fa-download' data-tip data-for='export'></i>
          </label>
        }
      </div>
    );
  }
}

export { SearchQuery };
