import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeMessageFilter} from './actions'
import {toggleEditClientPrompt} from '../actions'
import {confirmDeleteClient} from '../clients/actions'
import {DropDownToggle, DropDownMenu} from '../../UI/drop-down'

@branch({
  visible: ['drop_down', 'message_filter', 'visible'],
  active: ['drop_down', 'message_filter', 'active']
})
class FilterMenu extends Component {
  _renderFilterMenu() {
    const { visible } = this.props;
    const dropdownClass = classnames('dropdown-wrapper', {'open': visible})
    return (
      <div className={dropdownClass}>
        <DropDownToggle id="message_filter">
          <i className="fa fa-filter" />
        </DropDownToggle>
        {
          visible &&
          <DropDownMenu id="message_filter" {...this.props}>
            {this.props.children}
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderFilterMenu()}
      </div>
    );
  }
}

@branch({})
class FilterItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _changeFilter () {
    this.props.dispatch(
      changeMessageFilter,
      this.props.value
    )
  }
  _renderFilterItem() {
    const {display, value, selected_filter} = this.props;
    const filter_class = classnames({'active': (value == selected_filter)})
    return (
      <li
        className={filter_class}
        onClick={::this._changeFilter}
      >
        <label>
          {display}
        </label>
      </li>
    );
  }
  render() {
    return (
      ::this._renderFilterItem()
    )
  }
}

@branch({
  message_thread: ['messages', 'current_message_thread'],
  selected_filter: ['messages', 'message_thread', 'selected_filter'],
  mini_profile: ['messages', 'mini_profile'],
  account_id: ['account', 'account_id'],
  related_accounts: ['account', 'related_accounts'],
  selected_account_id: ['account', 'selected_account_id'],
  nexhealth_integration_id: ['account', 'nexhealth_integration_id'],
})
class Header extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _editContact() {
    const {mini_profile} = this.props;
    if(!mini_profile.active) {
      return false;
    }
    this.props.dispatch(
      toggleEditClientPrompt,
      mini_profile
    )
  }
  _deleteContact() {
    this.props.dispatch(
      confirmDeleteClient
    )
  }
  _renderHeader() {
    const {selected_filter, mini_profile, account_id, related_accounts, selected_account_id, nexhealth_integration_id} = this.props;
    let address_arr = [];
    let display_name = '';
    let guarantor_name = '';
    let display_phone = '';
    let display_email = '';
    let revenue = 0.0;
    let pending_dollars = 0.0;
    let overdue_dollars = 0.0;
    let paid_dollars = 0.0;
    let inactive = false;
    let external_id = '';
    let locked = false;
    if(mini_profile) {
      external_id = mini_profile.external_id;
      locked = nexhealth_integration_id && external_id ? true : false;
      revenue = parseFloat(mini_profile.revenue).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      pending_dollars = parseFloat(mini_profile.pending_dollars).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      overdue_dollars = parseFloat(mini_profile.overdue_dollars).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      paid_dollars = parseFloat(mini_profile.paid_dollars).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      if(mini_profile.active) {
        display_name = mini_profile.name;
        display_phone = mini_profile.formatted_phone;
        display_email = mini_profile.email;
        guarantor_name = mini_profile.guarantor_name;
        if(mini_profile.city) {
          address_arr.push(mini_profile.city);
        }
        if(mini_profile.state) {
          address_arr.push(mini_profile.state);
        }
        if(mini_profile.zip) {
          address_arr.push(mini_profile.zip);
        }
      } else {
         display_name = mini_profile.obfuscated_name;
         display_phone = mini_profile.obfuscated_phone;
         display_email = mini_profile.obfuscated_email;
         inactive = true;
      }
    }
    const city_state_zip = address_arr.join(', ');
    const long_name = display_name && display_name.length > 20;
    const contactNameClass = classnames('contact-name', {'long': long_name});
    const editButtonClass = classnames('fa', 'fa-pencil', {'inactive': inactive});
    return (
        <div className='messaging-tools-header'>
        {
          mini_profile &&
          <div>
            <span className='controls'>
              <div className="message-filter">
                <FilterMenu>
                  <FilterItem key={0} value="all" display="All" selected_filter={selected_filter} />
                  <FilterItem key={1} value="messages" display="Messages" selected_filter={selected_filter} />
                  <FilterItem key={2} value="appointments" display="Appointments" selected_filter={selected_filter} />
                  <FilterItem key={3} value="invoices" display="Invoices" selected_filter={selected_filter} />
                  <FilterItem key={4} value="invites" display="Review Invites" selected_filter={selected_filter} />
                  <FilterItem key={5} value="intakes" display="Intake Forms" selected_filter={selected_filter} />
                  <FilterItem key={6} value="notes" display="Notes" selected_filter={selected_filter} />
                </FilterMenu>
              </div>
              <i className={editButtonClass} onClick={::this._editContact} />
            </span>
            <div className='demographics'>
              <div className={contactNameClass}>{display_name}
              {
                locked &&
                <i className="fa fa-lock"></i>
              }
              </div>
              {
                guarantor_name &&
                <div className='contact-other'><i className="fa fa-child"></i>{guarantor_name}</div>
              }
              {
                display_phone &&
                <div className='contact-other'><i className="fa fa-phone"></i>{display_phone}</div>
              }
              {
                display_email &&
                <div className='contact-other'><i className="fa fa-envelope"></i>{display_email}</div>
              }
              {
                mini_profile.active && mini_profile.address &&
                <div className='contact-other'><i className="fa fa-map-marker"></i>{mini_profile.address}</div>
              }
              {
                mini_profile.active && city_state_zip &&
                <div className='contact-other'><i className="fa fa-map-marker"></i>{city_state_zip}</div>
              }
              <div className='contact-other'><i className="fa fa-dollar"></i>{revenue} in Total Revenue</div>
            </div>
            <div className='row payment-stats'>
              <div className='col-sm-1 payment-stats-icon'>
                <i className="fa fa-file-text-o"></i>
              </div>
              <div className='col-sm-4 payment-statistic'>
                <div className='value'>{pending_dollars}</div>
                <div className='title'>Pending</div>
              </div>
              <div className='col-sm-4 payment-statistic'>
                <div className='value'>{overdue_dollars}</div>
                <div className='title'>Overdue</div>
              </div>
              <div className='col-sm-3 payment-statistic'>
                <div className='value'>{paid_dollars}</div>
                <div className='title'>Paid</div>
              </div>
            </div>
           </div>
         }
        </div>
    );
  }
  render() {
    return (
      ::this._renderHeader()
    );
  }
}

export { Header };