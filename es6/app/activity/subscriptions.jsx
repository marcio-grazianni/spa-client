import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchSubscriptions, onPageChange, onPageSizeChange, onSortedChange, openInvoiceEditor, cancelPlanConfirm} from './actions'

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    return (
      <a href="" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

@branch({
})
class MoreMenu extends Component {
  _showPlan(e) {
    const {recurring_invoice} = this.props;
    this.props.dispatch(
      openInvoiceEditor,
      recurring_invoice.id
    );
  }
  _confirmCancelPlan(e) {
    const {recurring_invoice, table} = this.props;
    this.props.dispatch(
      cancelPlanConfirm,
      recurring_invoice.id,
      table.refReactTable.fireFetchData
    );
  }
  _renderMoreMenu() {
    const {recurring_invoice, index} = this.props;
    const active = !recurring_invoice.completed && !recurring_invoice.canceled;
    return (
      <Dropdown
        id={`more-menu-${index}`}
        pullRight
      >
        <CustomToggle bsRole="toggle" pullRight>
          <div className="more-menu-toggle">
            <i className="fa fa-ellipsis-v"></i>
          </div>
        </CustomToggle>
        <Dropdown.Menu>
          {
            <MenuItem eventKey="1" onClick={::this._showPlan}>View</MenuItem>
          }
          {
            active &&
            <MenuItem eventKey="2" onClick={::this._confirmCancelPlan}>Cancel</MenuItem>
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
  render() {
    return (
      ::this._renderMoreMenu()
    );
  }
}

@branch({
  subscriptions: ['activity', 'subscriptions']
})
class SubscriptionsTable extends Component {
  _onFetchSubscriptions(table) {
    this.props.dispatch(
      onFetchSubscriptions,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'subscriptions',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'subscriptions',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'subscriptions',
    );
  }
  render() {
    const {loading, subscription_list, pages, page, page_size, sorted, filtered} = this.props.subscriptions;
    function toCurrency(numberString) {
        let number = parseFloat(numberString);
        return number.toLocaleString('USD');
    }
    const columns = [{
      Header: 'Name',
      accessor: 'name'
    }, {
      Header: 'Mobile',
      accessor: 'phone_number',
      sortable: false
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      Header: 'Subscription ID',
      accessor: 'invoice_number'
    }, {
      Header: 'Subscription Type',
      accessor: 'top_line_item',
      sortable: false
    }, {
      id: 'installment_amount',
      Header: 'Amount',
      accessor: i => parseFloat(i.installment_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }, {
      id: 'start_date',
      Header: 'Start Date',
      accessor: i => moment(i.due_date).local().format("MM-DD-YYYY")
    }, {
      Header: 'Status',
      accessor: 'effective_status',
      width: 100
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => <MoreMenu recurring_invoice={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={subscription_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchSubscriptions}
        onPageChange={::this._onPageChange}
        onPageSizeChange={::this._onPageSizeChange}
        onSortedChange={::this._onSortedChange}
        getTdProps={(state, rowInfo, column, instance) => {
          return {}
        }}
      />
    );
  }
}

@branch({
  stats: ['activity', 'subscriptions', 'summary_statistics'],
  selected_filter: ['activity', 'subscriptions', 'status_filter']
})
class SubscriptionKPIS extends Component {
  _renderInvoiceKPIS() {
    const {selected_filter} = this.props;
    const {total_dollars, active_dollars, completed_dollars, canceled_dollars} = this.props.stats;
    const table = 'subscriptions';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Active"
               value={active_dollars}
               filter="Active"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Canceled"
               value={canceled_dollars}
               filter="Canceled"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="All"
               value={total_dollars}
               filter="ALL"
               table={table}
               selected_filter={selected_filter} />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceKPIS()
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class SubscriptionActivity extends Component {
  _renderSubscriptionActivity() {
    const {search_query} = this.props;
    const table = 'subscriptions';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <SubscriptionKPIS />
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
        <SubscriptionsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderSubscriptionActivity()
    )
  }
}

export { SubscriptionActivity };