import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import {InputBox} from '../UI/input-box'
import {InputDropdown} from '../UI/input-dropdown'
import {Alert} from '../UI/alert'
import {handleSubmit, changeValue, uploadSubAccountCSV} from './actions'

@branch({
  create_form: ['creation', 'create_form'],
  alert: ['alert'],
})
class CreateForm extends Component {
  _onCSVDrop(files) {
    this.props.dispatch(
      uploadSubAccountCSV,
      files
    )
  }
  _uploadCSV() {
    this.refs.dropzone.open()
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(handleSubmit);
  }
  _changeValue(value, input_id) {
    this.props.dispatch(
      changeValue,
      value,
      input_id
    )
  }
  render() {
    const {create_form, alert} = this.props;
    return(
      <form onSubmit={::this._handleSubmit}>
        {
          alert &&
          <div className='alert-wrapper'>
            <Alert alert={alert} />
          </div>
        }
        <fieldset>
          <h3>Account Info</h3>
          <InputBox
            id="name"
            title="Name"
            disabled={false}
            input_type="text"
            value={create_form.name.value}
            error={create_form.name.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="slug"
            title="Slug"
            disabled={false}
            input_type="text"
            value={create_form.slug.value}
            error={create_form.slug.error}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="vertical"
            title="Vertical"
            disabled={false}
            value={create_form.vertical.value}
            error={create_form.vertical.error}
            Options={create_form.vertical_options}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="url"
            title="URL"
            disabled={false}
            input_type="text"
            value={create_form.url.value}
            error={create_form.url.error}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="payment"
            title="Payment Status"
            disabled={false}
            value={create_form.payment.value}
            error={create_form.payment.error}
            Options={create_form.payment_options}
            changeValue={::this._changeValue}
          />
          <div className='control-group'>
            <label>Sub Accounts:</label>
            <div className='controls'>
              <Dropzone onDrop={::this._onCSVDrop} ref="dropzone" style={{}}>
              </Dropzone>
              <button className='btn' type="button" onClick={::this._uploadCSV}>
                  Upload CSV
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <h3>Location Info</h3>
          <InputBox
            id="location_name"
            title="Location Name"
            disabled={false}
            input_type="text"
            value={create_form.location_name.value}
            error={create_form.location_name.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="location_address"
            title="Location Address"
            disabled={false}
            input_type="text"
            value={create_form.location_address.value}
            error={create_form.location_address.error}
            changeValue={::this._changeValue}
          />
        </fieldset>
        <fieldset>
          <h3>Primary Contact</h3>
          <InputBox
            id="username"
            title="Username"
            disabled={false}
            input_type="email"
            value={create_form.username.value}
            error={create_form.username.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="first_name"
            title="First Name"
            disabled={false}
            input_type="text"
            value={create_form.first_name.value}
            error={create_form.first_name.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="last_name"
            title="Last Name"
            disabled={false}
            input_type="text"
            value={create_form.last_name.value}
            error={create_form.last_name.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="phone"
            title="Phone"
            disabled={false}
            input_type="text"
            value={create_form.phone.value}
            error={create_form.phone.error}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="onboarding_step"
            title="Onboarding Step"
            disabled={false}
            value={create_form.onboarding_step.value}
            error={create_form.onboarding_step.error}
            Options={create_form.onboarding_step_options}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="hubspot_contact"
            title="Create Hubspot Contact"
            disabled={false}
            value={create_form.hubspot_contact.value}
            error={create_form.hubspot_contact.error}
            Options={[[true, 'Yes'], [false, 'No']]}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="owner"
            title="Hubspot Owner"
            disabled={false}
            value={create_form.owner.value}
            error={create_form.owner.error}
            Options={create_form.owner_options}
            changeValue={::this._changeValue}
          />
        </fieldset>
        <button type='submit' className='btn btn-confirm'>Submit</button>
      </form>
    );
  }
}


export { CreateForm };
