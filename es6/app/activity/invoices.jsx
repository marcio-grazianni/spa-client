import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchInvoices, onPageChange, onPageSizeChange, onSortedChange, openInvoiceEditor, cancelInvoiceConfirm, deleteInvoiceConfirm, refundInvoiceConfirm, resendInvoiceConfirm} from './actions'

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
  _showInvoice(e) {
    const {invoice} = this.props;
    const invoice_url = '/payments/pay-invoice/' + invoice.id + '/';
    window.open(invoice_url);
  }
  _confirmCancelInvoice(e) {
    const {invoice, table} = this.props;
    this.props.dispatch(
      cancelInvoiceConfirm,
      invoice.id,
      table.refReactTable.fireFetchData
    );
  }
  _confirmDeleteInvoice(e) {
    const {invoice, table} = this.props;
    this.props.dispatch(
      deleteInvoiceConfirm,
      invoice.id,
      table.refReactTable.fireFetchData
    );
  }
  _confirmRefundInvoice(e) {
    const {invoice, table} = this.props;
    this.props.dispatch(
      refundInvoiceConfirm,
      invoice.id,
      table.refReactTable.fireFetchData
    );
  }
  _confirmResendInvoice(e) {
    const {invoice} = this.props;
    this.props.dispatch(
      resendInvoiceConfirm,
      invoice.id
    );
  }
  _openInvoiceEditor(e) {
    const {invoice, index, table} = this.props;
    Django.close_invoice_stepper_callback = table.refReactTable.fireFetchData;
    this.props.dispatch(
      openInvoiceEditor,
      invoice.id,
    );
  }
  _renderMoreMenu() {
    const {invoice, index} = this.props;
    const created = 1 === invoice.status;
    const saved = 2 === invoice.status;
    const pending = 3 === invoice.status;
    const paid = 4 === invoice.status;
    const canceled = 5 === invoice.status;
    const editable = created || saved;
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
            !editable &&
            <MenuItem eventKey="1" onClick={::this._showInvoice}>View</MenuItem>
          }
          {
            pending &&
            <MenuItem eventKey="2" onClick={::this._confirmResendInvoice}>Resend</MenuItem>
          }
          {
            pending &&
            <MenuItem eventKey="5" onClick={::this._confirmCancelInvoice}>Cancel</MenuItem>
          }
          {
            paid &&
            <MenuItem eventKey="4" onClick={::this._confirmRefundInvoice}>Refund</MenuItem>
          }
          {
            editable &&
            <MenuItem eventKey="5" onClick={::this._openInvoiceEditor}>Edit</MenuItem>
          }
          {
            editable &&
            <MenuItem eventKey="6" onClick={::this._confirmDeleteInvoice}>Delete</MenuItem>
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
  invoices: ['activity', 'invoices']
})
class InvoicesTable extends Component {
  _openInvoiceEditor(invoice_id) {
    this.props.dispatch(
      openInvoiceEditor,
      invoice_id
    );
  }
  _onFetchInvoices(table) {
    this.props.dispatch(
      onFetchInvoices,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'invoices',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'invoices',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'invoices',
    );
  }
  render() {
    const {loading, invoice_list, pages, page, page_size, sorted, filtered} = this.props.invoices;
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
      id: 'total_amount',
      Header: 'Amount',
      accessor: i => parseFloat(i.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }, {
      Header: 'Description ID',
      accessor: 'invoice_number'
    }, {
      id: 'due_date',
      Header: 'Due Date',
      accessor: i => moment(i.due_date).local().format("MM-DD-YYYY")
    }, {
      Header: 'Provider',
      accessor: 'provider_name'
    }, {
      Header: 'Status',
      accessor: 'effective_status',
      width: 100
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => <MoreMenu invoice={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={invoice_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchInvoices}
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
  stats: ['activity', 'invoices', 'summary_statistics'],
  selected_filter: ['activity', 'invoices', 'status_filter']
})
class InvoiceKPIS extends Component {
  _renderInvoiceKPIS() {
    const {selected_filter} = this.props;
    const {total_dollars, draft_dollars, pending_dollars, overdue_dollars, paid_dollars} = this.props.stats;
    const table = 'invoices';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Draft"
               value={draft_dollars}
               filter="Draft"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Pending"
               value={pending_dollars}
               filter="Pending"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Overdue"
               value={overdue_dollars}
               filter="Overdue"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Paid"
               value={paid_dollars}
               filter="Paid"
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
class InvoiceActivity extends Component {
  _renderInvoiceActivity() {
    const {search_query} = this.props;
    const table = 'invoices';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <InvoiceKPIS />
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
        <InvoicesTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceActivity()
    )
  }
}

export { InvoiceActivity };