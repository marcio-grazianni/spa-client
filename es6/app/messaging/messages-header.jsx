import classnames from 'classnames'
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {changeSearchQuery, startEmptyInvoice} from './actions'
import {toggleAddClientPrompt} from '../appointpal/actions'
import {toggleUploadClientsPrompt, syncAllContacts} from '../appointpal/clients/actions'

@branch({
  search_query: ['messages', 'search_query'],
})
class SearchQuery extends Component {
  _changeSearchQuery(e) {
    this.props.dispatch(
      changeSearchQuery,
      e.target.value
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
  account_id: ['account', 'account_id'],
  nexhealth_integration_id: ['account', 'nexhealth_integration_id'],
  related_accounts: ['account', 'related_accounts'],
  selected: ['messages', 'selected_top_menu'],
  selected_account_id: ['account', 'selected_account_id'],
  sync_in_progress: ['appointpal', 'sync_in_progress']
})
class MessagesHeader extends Component {
  _syncAllContacts(e) {
    const {sync_in_progress} = this.props;
    if(sync_in_progress) {
      return false;
    }
    this.props.dispatch(
      syncAllContacts
    );
  }
  _startEmptyInvoice(e) {
    this.props.dispatch(
      startEmptyInvoice
    )
  }
  _toggleAddClientPrompt(e) {
    this.props.dispatch(
      toggleAddClientPrompt
    )
  }
  _toggleUploadClientsPrompt(e) {
    this.props.dispatch(
      toggleUploadClientsPrompt
    )
  }
  _renderMessagesHeader() {
    const {account_id, nexhealth_integration_id, related_accounts, selected, selected_account_id, sync_in_progress} = this.props;
    let selected_id = selected_account_id;
    if(!selected_id) {
      selected_id = account_id;
    }
    const hasRelatedAccounts = related_accounts && related_accounts.length > 1;
    const syncClassName = classnames('fa', 'fa-refresh', {'fa-spin': sync_in_progress});
    return (
      <SectionHeader
        id="messagess"
        icon="fa-users"
        title="Patients"
        datePickerEnabled={false}
      >
        <SearchQuery />
        {
          (!hasRelatedAccounts || selected_id != account_id) &&
          <div className="button-panel">
            <i className="fa fa-dollar" onClick={::this._startEmptyInvoice}></i>
            <i className="fa fa-upload" onClick={::this._toggleUploadClientsPrompt}></i>
            <i className="fa fa-user-plus" onClick={::this._toggleAddClientPrompt}></i>
          </div>
        }
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderMessagesHeader()
    );
  }
}

export { MessagesHeader };