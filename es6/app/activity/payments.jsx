import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchPayments, onPageChange, onPageSizeChange, onSortedChange, refundPaymentConfirm, resendReceiptConfirm} from './actions'

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
  _viewReceipt(e) {
    const {transaction} = this.props;
    const receipt_url = '/api/transactions/' + transaction.id + '/view-receipt/';
    window.open(receipt_url);
  }
  _confirmResendReceipt(e) {
    const {transaction} = this.props;
    this.props.dispatch(
      resendReceiptConfirm,
      transaction.id
    );
  }
  _confirmRefundPayment(e) {
    const {table, transaction} = this.props;
    this.props.dispatch(
      refundPaymentConfirm,
      transaction,
      table.refReactTable.fireFetchData
    );
  }
  _renderMoreMenu() {
    const {transaction, index} = this.props;
    const refundable = 'Completed' === transaction.status;
    const sendable = transaction.email || transaction.phone;
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
          <MenuItem eventKey="1" onClick={::this._viewReceipt}>View Receipt</MenuItem>
          {
            sendable &&
            <MenuItem eventKey="2" onClick={::this._confirmResendReceipt}>Send Receipt</MenuItem>
          }
          {
            refundable &&
            <MenuItem eventKey="3" onClick={::this._confirmRefundPayment}>Refund</MenuItem>
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
  payments: ['activity', 'payments']
})
class PaymentsTable extends Component {
  _onFetchPayments(table) {
    this.props.dispatch(
      onFetchPayments,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'payments',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'payments',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'payments',
    );
  }
  render() {
    const {loading, payment_list, pages, page, page_size, sorted, filtered} = this.props.payments;
    function toCurrency(numberString) {
        let number = parseFloat(numberString);
        return number.toLocaleString('USD');
    }
    const columns = [{
      id: 'name',
      Header: 'Name',
      className: 'contact-col',
      Cell: props => <ContactCell contact_id={props.original.contact_id} contact_name={props.original.name} />
    }, {
      Header: 'Mobile',
      accessor: 'phone_number',
      sortable: false
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      id: 'attempted_amount',
      Header: 'Amount',
      accessor: p => parseFloat(p.attempted_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    }, {
      id: 'updated_at',
      Header: 'Date',
      accessor: p => moment(p.updated_at).local().format("MMM D, YYYY, h:mm A")
    }, {
      Header: 'Provider',
      accessor: 'provider_name',
    }, {
      Header: 'Invoice Number',
      accessor: 'description',
    }, {
      Header: 'Reference Number',
      accessor: 'reference_number',
    }, {
      Header: 'Status',
      accessor: 'effective_status',
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => 'Failed' === props.original.effective_status ? '' : <MoreMenu transaction={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={payment_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchPayments}
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
  stats: ['activity', 'payments', 'summary_statistics'],
  selected_filter: ['activity', 'payments', 'status_filter']
})
class PaymentKPIS extends Component {
  _renderPaymentKPIS() {
    const {selected_filter} = this.props;
    const {total_dollars, total_dollars_attempted, succeeded_dollars, failed_dollars, refunded_dollars} = this.props.stats;
    const table = 'payments';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Succeeded"
               value={total_dollars}
               filter="Succeeded"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Refunded"
               value={refunded_dollars}
               filter="Refunded"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Failed"
               value={failed_dollars}
               filter="Failed"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="All"
               value={total_dollars_attempted}
               filter="ALL"
               table={table}
               selected_filter={selected_filter} />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentKPIS()
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class PaymentActivity extends Component {
  _renderPaymentActivity() {
    const {search_query} = this.props;
    const table = 'payments';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <PaymentKPIS />
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
        <PaymentsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentActivity()
    )
  }
}

export { PaymentActivity };