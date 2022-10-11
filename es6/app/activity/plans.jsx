import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchPlans, onPageChange, onPageSizeChange, onSortedChange, openInvoiceEditor, cancelPlanConfirm} from './actions'

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
  plans: ['activity', 'plans']
})
class PaymentPlansTable extends Component {
  _onFetchPlans(table) {
    this.props.dispatch(
      onFetchPlans,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'plans',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'plans',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'plans',
    );
  }
  render() {
    const {loading, recurring_invoice_list, pages, page, page_size, sorted, filtered} = this.props.plans;
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
      Header: 'Description ID',
      accessor: 'invoice_number'
    }, {
      Header: 'Type',
      accessor: 'effective_type'
    }, {
      Header: 'Installments',
      accessor: 'num_installments'
    }, {
      id: 'start_date',
      Header: 'Start Date',
      accessor: i => moment(i.due_date).local().format("MM-DD-YYYY")
    }, {
      id: 'total_amount',
      Header: 'Total Amount',
      accessor: i => parseFloat(i.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }, {
      id: 'paid_amount',
      Header: 'Paid Amount',
      accessor: i => parseFloat(i.paid_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
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
        data={recurring_invoice_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchPlans}
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
  stats: ['activity', 'plans', 'summary_statistics'],
  selected_filter: ['activity', 'plans', 'status_filter']
})
class PaymentPlanKPIS extends Component {
  _renderInvoiceKPIS() {
    const {selected_filter} = this.props;
    const {total_dollars, active_dollars, completed_dollars, canceled_dollars} = this.props.stats;
    const table = 'plans';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Active"
               value={active_dollars}
               filter="Active"
               table={table}
               selected_filter={selected_filter} />
          <KPI label="Completed"
               value={completed_dollars}
               filter="Completed"
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
class PaymentPlanActivity extends Component {
  _renderPaymentPlanActivity() {
    const {search_query} = this.props;
    const table = 'plans';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <PaymentPlanKPIS />
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
        <PaymentPlansTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentPlanActivity()
    )
  }
}

export { PaymentPlanActivity };