import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import {branch} from 'baobab-react/higher-order'
import PhoneInput from 'react-phone-number-input'
import SelectUSState from 'react-select-us-states'
import {Alert} from '../UI/alert'
import {Confirmation, ConfirmationButtons} from './common/confirmation'
import {confirmationDismiss} from './actions'
import {handleClientInputChange, handleClientPhoneInputChange, createClient, updateClient, closeManageClientPrompt, syncClient} from './clients/actions'


@branch({
  client_form: ['appointpal', 'client_form'],
})

class ClientForm extends Component {
  _closeManageClientPrompt() {
    this.props.dispatch(
      closeManageClientPrompt
    )
  }
  _handleClientInputChange(e) {
    this.props.dispatch(
      handleClientInputChange,
      e.target.name,
      e.target.value
    )
  }
  _handleClientPhoneInputChange(value) {
    this.props.dispatch(
      handleClientPhoneInputChange, value
    )
  }
  _changeTypeToDate(e) {
    e.target.type = 'date';
  }
  _updateClient(e) {
    e.preventDefault();
    this.props.dispatch(
      updateClient
    )
  }
  _syncClient(e) {
    e.preventDefault();
    this.props.dispatch(
      syncClient
    )
  }
  _renderClientForm() {
    const {editing, first_name, last_name, mobile, email, dob, address, city, state, zip, external_id, sync_in_progress} = this.props.client_form;
    let title = editing ? 'Edit Patient' : 'Add Patient';
    let disabled = false;
    let on_submit = ::this._updateClient;
    let submit_text = 'Save';
    if(external_id) {
      title = 'Sync Patient';
      disabled = true;
      on_submit = ::this._syncClient;
      submit_text = 'Sync';
    }
    return(
      <form onSubmit={on_submit}>
        <div className="manage-client-upper">
          <div className='manage-client-header'>
            <h2>
              <i className="fa fa-users"></i>
              {title}
            </h2>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className='add-patient-instructions'>
                Patient name and either mobile or email are required. All other fields optional.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='first_name'
                  placeholder='First'
                  value={first_name.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  first_name.error &&
                  <div className='errorHolder'>
                    <span className='error'>{first_name.error}</span>
                  </div>
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='last_name'
                  placeholder='Last'
                  value={last_name.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  last_name.error &&
                  <div className='errorHolder'>
                    <span className='error'>{last_name.error}</span>
                  </div>
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <PhoneInput
                  country="US"
                  name='mobile'
                  placeholder='Mobile'
                  value={mobile.value}
                  onChange={::this._handleClientPhoneInputChange}
                  disabled={disabled}
                />
                {
                  mobile.error &&
                  <div className='errorHolder'>
                    <span className='error'>{mobile.error}</span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-8">
              <div className='input-wrapper'>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={email.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  email.error &&
                  <div className='errorHolder'>
                    <span className='error'>{email.error}</span>
                  </div>
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type="text"
                  name="dob"
                  placeholder="DOB"
                  value={dob.value}
                  onFocus={::this._changeTypeToDate}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  dob.error &&
                  <div className='errorHolder'>
                    <span className='error'>{dob.error}</span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='address'
                  placeholder='Street Address'
                  value={address.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  address.error &&
                  <div className='errorHolder'>
                    <span className='error'>{address.error}</span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='city'
                  placeholder='City'
                  value={city.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  city.error &&
                  <div className='errorHolder'>
                    <span className='error'>{city.error}</span>
                  </div>
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='state'
                  placeholder='State'
                  value={state.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  state.error &&
                  <div className='errorHolder'>
                    <span className='error'>{state.error}</span>
                  </div>
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='zip'
                  placeholder='Zip Code'
                  value={zip.value}
                  onChange={::this._handleClientInputChange}
                  onBlur={::this._handleClientInputChange}
                  disabled={disabled}
                />
                {
                  zip.error &&
                  <div className='errorHolder'>
                    <span className='error'>{zip.error}</span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className='add-patient-instructions'></div>
            </div>
          </div>
        </div>
        <div className='manage-client-lower'>
          <div className="row">
            <div className="col-sm-6 col-right-justify">
              <button type='button' onClick={::this._closeManageClientPrompt} className='btn btn-default'>
                Cancel
              </button>
            </div>
            <div className="col-sm-6 col-left-justify">
              <button type='submit' className='btn btn-confirm' disabled={sync_in_progress}>
                {submit_text}
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
  render() {
    return(
       ::this._renderClientForm()
     );
  }
}

@branch({
  alert: ['alpha_alert'],
  confirmation: ['appointpal', 'confirmation'],
  client_form: ['appointpal', 'client_form'],
})
class ManageClientPrompt extends Component {
  _renderManageClientPrompt() {
    const {alert, confirmation} = this.props;
    const {editing} = this.props.client_form;
    return (
      <div className="manage-client-wrapper">
      {
        (alert) &&
        <div className='alert-wrapper'>
          <Alert alert={alert} alpha={true} />
        </div>
      }
        <ClientForm />
      </div>
    );
  }
  render() {
    return (
      ::this._renderManageClientPrompt()
    );
  }
}

export { ManageClientPrompt };