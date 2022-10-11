import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Table, Column, Cell} from 'fixed-data-table'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchReviewInvites, onPageChange, onPageSizeChange, onSortedChange} from './actions'

@branch({
  stats: ['activity', 'review_invites', 'summary_statistics']
})
class ReviewKPIS extends Component {
   _renderReviewKPIS() {
    const {total_sent, total_opened, total_responded, avg_rating} = this.props.stats;
    return (
      <div className="overall-stats">
        <div className="row">
          <div className="col-sm-2">
            <div className="value">{total_sent}</div>
            <div className="statistic">Sent</div>
          </div>
          <div className="col-sm-2">
            <div className="value">{total_responded}</div>
            <div className="statistic">Responded</div>
          </div>
          <div className="col-sm-2">
            <div className="value">{avg_rating}</div>
            <div className="statistic">Average Rating</div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewKPIS()
    );
  }
}

@branch({
  review_invites: ['activity', 'review_invites'],
})
class ReviewsTable extends Component {
  _onFetchReviewInvites(table) {
    this.props.dispatch(
      onFetchReviewInvites,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key
    );
  }
  render() {
    const {loading, invite_list, pages, page, page_size, sorted, filtered} = this.props.review_invites;
    const columns = [{
      id: 'contact_name',
      Header: 'Name',
      className: 'contact-col',
      Cell: props => <ContactCell contact_id={props.original.contact_id} contact_name={props.original.contact_name} />
    }, {
      Header: 'Mobile',
      accessor: 'phone_number',
      sortable: false
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      Header: 'Date/Time',
      accessor: 'queued_at'
    }, {
      Header: 'Provider',
      accessor: 'provider_name'
    }, {
      Header: 'Status',
      accessor: 'overall_status'
    }];
    return (
      <ReactTable
        columns={columns}
        data={invite_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchReviewInvites}
        onPageChange={::this._onPageChange}
        onPageSizeChange={::this._onPageSizeChange}
        onSortedChange={::this._onSortedChange}
      />
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class ReviewActivity extends Component {
  _renderReviewActivity() {
    const {search_query} = this.props;
    const table = 'review_invites';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <ReviewKPIS />
            </div>
            <div className="col-sm-4">
              <SearchQuery
                table={table}
                query={search_query}
              >
              </SearchQuery>
            </div>
          </div>
        </div>
        <ReviewsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewActivity()
    )
  }
}

export { ReviewActivity };
