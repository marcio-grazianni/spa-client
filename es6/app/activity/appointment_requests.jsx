import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchAppointmentRequests, onPageChange, onPageSizeChange, onSortedChange, closeAppointmentRequest, openAppointmentRequest} from './actions'

@branch({
})
class ContactCell extends Component {
  _goToPatient() {
    const {request_id} = this.props;
    window.location.href = '/patients/?rid=' + request_id;
  }
  _renderContactCell() {
    const {name} = this.props;
    return(
      <div onClick={::this._goToPatient}>
        {name}
      </div>
    );
  }
  render() {
    return (
      ::this._renderContactCell()
    );
  }
}

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
  _closeAppointmentRequest(e) {
    const {appointment_request} = this.props;
    this.props.dispatch(
      closeAppointmentRequest,
      appointment_request
    );

  }
  _openAppointmentRequest(e) {
    const {appointment_request} = this.props;
    this.props.dispatch(
      openAppointmentRequest,
      appointment_request
    );
  }
  _renderMoreMenu() {
    const {appointment_request, index} = this.props;
    const open = 'Open' === appointment_request.effective_status;
    const closed = 'Closed' === appointment_request.effective_status;
    return (
      <div>
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
                open &&
                <MenuItem eventKey="1" onClick={::this._closeAppointmentRequest}>Close</MenuItem>
              }
              {
                closed &&
                <MenuItem eventKey="2" onClick={::this._openAppointmentRequest}>Open</MenuItem>
              }
            </Dropdown.Menu>
          </Dropdown>
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
  appointment_requests: ['activity', 'appointment_requests']
})
class AppointmentRequestsTable extends Component {
  _onFetchAppointmentRequests(table) {
    this.props.dispatch(
      onFetchAppointmentRequests,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'appointment_requests',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'appointment_requests',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'appointment_requests',
    );
  }
  render() {
    const {loading, appointment_request_list, pages, page, page_size, sorted, filtered} = this.props.appointment_requests;
    const columns = [{
      id: 'created_at',
      Header: 'Date',
      accessor: p => moment(p.created_at).local().format("MMM D, YYYY, h:mm A")
    }, {
      id: 'name',
      Header: 'Patient',
      className: 'contact-col',
      Cell: props => <ContactCell request_id={props.original.id} name={props.original.name} />
    }, {
      id: 'phone_number',
      Header: 'Mobile',
      accessor: 'formatted_phone'
    }, {
      id: 'email',
      Header: 'Email',
      accessor: 'email'
    }, {
      id: 'appointment_type',
      Header: 'Preferred Time',
      accessor: 'appointment_type'
    }, {
      Header: 'Status',
      accessor: 'effective_status',
      width: 100
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => <MoreMenu appointment_request={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={appointment_request_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchAppointmentRequests}
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
  stats: ['activity', 'appointment_requests', 'summary_statistics'],
  selected_filter: ['activity', 'appointment_requests', 'status_filter']
})
class AppointmentRequestKPIS extends Component {
  _renderAppointmentRequestKPIS() {
    const {selected_filter} = this.props;
    const {total_requests, open_requests, closed_requests} = this.props.stats;
    const table = 'appointment_requests';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Open"
               value={open_requests}
               filter="Open"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Closed"
               value={closed_requests}
               filter="Closed"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="All"
               value={total_requests}
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
      ::this._renderAppointmentRequestKPIS()
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class AppointmentRequestActivity extends Component {
  _renderAppointmentRequestActivity() {
    const {search_query} = this.props;
    const table = 'appointment_requests';
    return (
      <div className="activityContent" id="appointment_request_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <AppointmentRequestKPIS />
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
        <AppointmentRequestsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentRequestActivity()
    )
  }
}

export { AppointmentRequestActivity };