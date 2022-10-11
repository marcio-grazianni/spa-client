import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Alert} from '../UI/alert'
import {closeUpdateCreditCardPrompt} from './credit_card/actions'

@branch({
  account_id: ['account', 'account_id'],
  alert: ['alpha_alert'],
  info: ['appointpal', 'credit_card'],
})
class UpdateCreditCardPrompt extends Component {
  _closeUpdateCreditCardPrompt() {
    this.props.dispatch(
      closeUpdateCreditCardPrompt
    )
  }
  _renderUpdateCreditCardPrompt() {
    const {account_id, alert} = this.props;
    const {transaction_setup_id} = this.props.info;
    const transaction_setup_url = Django.hosted_payments_url + '?TransactionSetupID=' + transaction_setup_id;
    return (
      <div className="update-payment-wrapper">
      {
        (alert) &&
        <div className='alert-wrapper'>
          <Alert alert={alert} alpha={true} />
        </div>
      }
        <div className="update-payment-upper">
          <div className="update-payment-header">
            <h2>
              <i className="fa fa-credit-card"></i>
              Update Stored Card
            </h2>
          </div>
        </div>
        <div className="update-payment-body">
        {
          !transaction_setup_id &&
           <div className='loading'><i className='fa fa-spin fa-spinner' /></div>
        }
        {
          transaction_setup_id &&
          <iframe src={transaction_setup_url} frameBorder='0' />
        }
        </div>
        <div className="update-payment-lower">
          <button type='button' onClick={::this._closeUpdateCreditCardPrompt} className='btn btn-default'>
            Close
          </button>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUpdateCreditCardPrompt()
    );
  }
}

export { UpdateCreditCardPrompt };