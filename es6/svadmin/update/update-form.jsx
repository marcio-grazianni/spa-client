import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import {InputBox} from '../UI/input-box'
import {InputDropdown} from '../UI/input-dropdown'
import {Alert} from '../UI/alert'
import {initialLoad, selectAccount, handleSubmit, changeValue, uploadSubAccountCSV} from './actions'

@branch({
  update_form: ['update', 'update_form'],
  select_account_options: ['update',  'select_account_options'],
  alert: ['alert'],
})
class UpdateForm extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  _selectAccount(value, input_id) {
    this.props.dispatch(
      selectAccount,
      value,
    )
  }
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
    const {update_form, select_account_options, alert} = this.props;
    return(
      <form onSubmit={::this._handleSubmit}>
        {
          alert &&
          <div className='alert-wrapper'>
            <Alert alert={alert} />
          </div>
        }
        <fieldset>
          <InputDropdown
            id="select_account"
            title="Select Account"
            disabled={false}
            value={update_form.select_account.value}
            error={update_form.select_account.error}
            Options={select_account_options}
            changeValue={::this._selectAccount}
          />
        </fieldset>
        <fieldset>
          <h3>Account Info</h3>
          <InputBox
            id="name"
            title="Name"
            disabled={false}
            input_type="text"
            value={update_form.name.value}
            error={update_form.name.error}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="slug"
            title="Slug"
            disabled={false}
            input_type="text"
            value={update_form.slug.value}
            error={update_form.slug.error}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="vertical"
            title="Vertical"
            disabled={false}
            value={update_form.vertical.value}
            error={update_form.vertical.error}
            Options={update_form.vertical_options}
            changeValue={::this._changeValue}
          />
          <InputBox
            id="url"
            title="URL"
            disabled={false}
            input_type="text"
            value={update_form.url.value}
            error={update_form.url.error}
            changeValue={::this._changeValue}
          />
          <InputDropdown
            id="payment"
            title="Payment Status"
            disabled={false}
            value={update_form.payment.value}
            error={update_form.payment.error}
            Options={update_form.payment_options}
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
        <button type='submit' className='btn btn-confirm'>Update Account</button>
      </form>
    );
  }
}


export { UpdateForm };
