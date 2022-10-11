import classnames from 'classnames'
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import PhoneInput from 'react-phone-number-input'
import {Alert} from '../UI/alert'
import {UploadClients} from './clients/upload-clients'

import {closeUploadClientsPrompt, handleUpload} from './clients/actions'

@branch({
  account_id: ['account', 'account_id'],
  alert: ['alpha_alert'],
  upload_form: ['appointpal', 'upload_form']
})
class UploadClientsPrompt extends Component {
  _closeUploadClientsPrompt() {
    this.props.dispatch(
      closeUploadClientsPrompt
    )
  }
  _uploadClients() {
    this.props.dispatch(
      handleUpload
    );
  }
  _renderUploadClientsPrompt() {
    const {account_id, alert} = this.props;
    const {client_list, uploading} = this.props.upload_form;
    const allowImport = client_list && client_list.length > 0 && !uploading;
    return (
      <div className="upload-clients-wrapper">
      {
        (alert) &&
        <div className='alert-wrapper'>
          <Alert alert={alert} alpha={true} />
        </div>
      }
        <div className="upload-clients-upper">
          <div className="upload-clients-header">
            <h2>
              <i className="fa fa-users"></i>
              Import Patients
            </h2>
          </div>
        </div>
        <UploadClients />
        <div className="upload-clients-lower">
          <button type='button' onClick={::this._closeUploadClientsPrompt} className='btn btn-default'>
            Cancel
          </button>
          <button type='button' disabled={!allowImport} onClick={::this._uploadClients} className='btn btn-confirm'>
            Import
          </button>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUploadClientsPrompt()
    );
  }
}

export { UploadClientsPrompt };