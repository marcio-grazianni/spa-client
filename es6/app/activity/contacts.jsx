import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import moment from 'moment'
import React, {Component} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import ReactTable from 'react-table'
import {ContactCell} from './activity'
import {KPI} from './kpi'
import {SearchQuery} from './search_query'
import {onFetchContacts, onPageChange, onPageSizeChange, onSortedChange, toggleEditContactPrompt, archiveContact, restoreContact} from './actions'

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
  _editContact(e) {
    const {contact} = this.props;
    this.props.dispatch(
      toggleEditContactPrompt,
      contact
    );
  }
  _archiveContact(e) {
    const {contact} = this.props;
    this.props.dispatch(
      archiveContact,
      contact
    );

  }
  _restoreContact(e) {
    const {contact} = this.props;
    this.props.dispatch(
      restoreContact,
      contact
    );
  }
  _renderMoreMenu() {
    const {contact, index} = this.props;
    const pending = 1 === contact.status;
    const active = 2 === contact.status;
    const archived = 3 === contact.status;
    const editable = pending || active;
    return (
      <div>
      {
      editable &&
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
            editable &&
            <MenuItem eventKey="1" onClick={::this._editContact}>Edit</MenuItem>
          }
          {
            editable &&
            <MenuItem eventKey="2" onClick={::this._archiveContact}>Archive</MenuItem>
          }
          {
            !editable &&
            <MenuItem eventKey="3" onClick={::this._restoreContact}>Restore</MenuItem>
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
  contacts: ['activity', 'contacts']
})
class ContactsTable extends Component {
  _onFetchContacts(table) {
    this.props.dispatch(
      onFetchContacts,
      table
    );
  }
  _onPageChange(page) {
    this.props.dispatch(
      onPageChange,
      page,
      'contacts',
    );
  }
  _onPageSizeChange(page_size, page) {
    this.props.dispatch(
      onPageSizeChange,
      page_size,
      page,
      'contacts',
    );
  }
  _onSortedChange(new_sorted, column, shift_key) {
    this.props.dispatch(
      onSortedChange,
      new_sorted,
      column,
      shift_key,
      'contacts',
    );
  }
  render() {
    const {loading, contact_list, pages, page, page_size, sorted, filtered} = this.props.contacts;
    function toCurrency(numberString) {
        let number = parseFloat(numberString);
        return number.toLocaleString('USD');
    }
    const columns = [{
      id: 'display_name',
      Header: 'Name',
      className: 'contact-col',
      Cell: props => <ContactCell contact_id={props.original.id} contact_name={props.original.display_name} />
    }, {
      Header: 'Mobile',
      accessor: 'formatted_phone_number',
      sortable: false
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      Header: 'City',
      accessor: 'city'
    }, {
      Header: 'State',
      accessor: 'state',
    }, {
      Header: 'Zip Code',
      accessor: 'zip_code'
    }, {
      Header: 'Guarantor',
      className: 'contact-col',
      Cell: props => <ContactCell contact_id={props.original.guarantor} contact_name={props.original.guarantor_name} />,
      sortable: false
    }, {
      id: 'total_revenue',
      Header: 'Total Revenue',
      accessor: p => parseFloat(p.total_revenue).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    }, {
      Header: 'Status',
      accessor: 'effective_status',
      width: 100
    }, {
      id: 'more',
      Header: 'More',
      width: 60,
      className: 'invoice-more-col',
      Cell: props => <MoreMenu contact={props.original} index={props.index} table={this} />
    }];
    return (
      <ReactTable
        ref={(refReactTable) => {this.refReactTable = refReactTable;}}
        columns={columns}
        data={contact_list}
        page={page}
        pageSize={page_size}
        pages={pages}
        loading={loading}
        filtered={filtered}
        manual
        onFetchData={::this._onFetchContacts}
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
  stats: ['activity', 'contacts', 'summary_statistics'],
  selected_filter: ['activity', 'contacts', 'status_filter']
})
class ContactKPIS extends Component {
  _renderContactKPIS() {
    const {selected_filter} = this.props;
    const {total_contacts, pending_contacts, active_contacts, archived_contacts} = this.props.stats;
    const table = 'contacts';
    return (
      <div className="overall-stats">
        <div className="row">
          <KPI label="Pending"
               value={pending_contacts}
               filter="Pending"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Active"
               value={active_contacts}
               filter="Active"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="Archived"
               value={archived_contacts}
               filter="Archived"
               table={table}
               no_truncate={true}
               selected_filter={selected_filter} />
          <KPI label="All"
               value={total_contacts}
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
      ::this._renderContactKPIS()
    );
  }
}

@branch({
  search_query: ['activity', 'search_query'],
})
class ContactActivity extends Component {
  _renderContactActivity() {
    const {search_query} = this.props;
    const table = 'contacts';
    return (
      <div className="activityContent" id="client_activity">
        <div className='sub-heading'>
          <div className="row">
            <div className="col-sm-8">
              <ContactKPIS />
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
        <ContactsTable />
      </div>
    );
  }
  render() {
    return (
      ::this._renderContactActivity()
    )
  }
}

export { ContactActivity };