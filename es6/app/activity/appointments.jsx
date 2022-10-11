import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchAppointments, onPageChange, onPageSizeChange, onSortedChange, confirmAppointment, cancelAppointmentConfirm} from './actions'

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
  _cancelAppointment(e) {
    const {appointment, table} = this.props;
    this.props.dispatch(
      cancelAppointmentConfirm,
      appointment.id,
      table.refReactTable.fireFetchData
    );
  }
  _confirmAppointment(e) {
    const {appointment, table} = this.props;
    this.props.dispatch(
      confirmAppointment,
      appointment.id,
      table.refReactTable.fireFetchData
    );
  }
  _renderMoreMenu() {
    const {appointment, index} = this.props;
    const confirmed = appointment.appointment_confirmed;
    const cancelled = appointment.cancelled;
    return (
      <div>
      {
      !cancelled &&
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
            !confirmed &&
            <MenuItem eventKey="1" onClick={::this._confirmAppointment}>Confirm</MenuItem>
          }
          {
            <MenuItem eventKey="2" onClick={::this._cancelAppointment}>Cancel</MenuItem>
          }
        </Dropdown.Menu>
      </Dropdown>
      }
      </div>
    )
  }
  render() {
    return (
      ::this._renderMoreMenu()
    );
  }
}

@branch({
  appointments: ['activity', 'appointments']
})
class AppointmentsTable extends Component {
  _onFetchAppointments(table) {
    this.props.dispatch(
      onFetchAppointments,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'appointments',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'appointments',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'appointments',
    );
  }
  render() {
    const {loading, appointment_list, pages, page, page_size, sorted, filtered} = this.props.appointments;
    const columns = [{
      id: 'updated_at',
      Header: 'Last Update',
      accessor: p => moment(p.updated_at).local().format("MMM D, YYYY, h:mm A")
    }, {
      id: 'start_time',
      Header: 'Appointment Date',
      accessor: p => moment(p.start_time).local().format("MMM D, YYYY, h:mm A")
    }, {
      Header: 'Patient',
      className: 'contact-col',
      Cell: props => <ContactCell contact_id={props.original.contact} contact_name={props.original.patient} />,
      sortable: false
    }, {
      Header: 'Provider',
      accessor: 'provider_name',
    }, {
      Header: 'Reminders Sent',
      accessor: 'reminders_sent',
      width: 150,
      sortable: false
    }, {
      Header: 'Status',
      accessor: 'effective_status',
      width: 100
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => <MoreMenu appointment={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={appointment_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchAppointments}
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
  stats: ['activity', 'appointments', 'summary_statistics'],
  selected_filter: ['activity', 'appointments', 'status_filter']
})
class AppointmentKPIS extends Component {
  _renderAppointmentKPIS() {
    const {selected_filter} = this.props;
    const {total_appointments, scheduled_appointments, confirmed_appointments, cancelled_appointments, missed_appointments, completed_appointments} = this.props.stats;
    const table = 'appointments';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Scheduled"
               value={scheduled_appointments}
               filter="Scheduled"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Confirmed"
               value={confirmed_appointments}
               filter="Confirmed"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Cancelled"
               value={cancelled_appointments}
               filter="Cancelled"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Missed"
               value={missed_appointments}
               filter="Missed"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Completed"
               value={completed_appointments}
               filter="Completed"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="All"
               value={total_appointments}
               filter="ALL"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentKPIS()
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class AppointmentActivity extends Component {
  _renderAppointmentActivity() {
    const {search_query} = this.props;
    const table = 'appointments';
    return (
      <div className="activityContent" id="appointment_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <AppointmentKPIS />
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
        <AppointmentsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentActivity()
    )
  }
}

export { AppointmentActivity };