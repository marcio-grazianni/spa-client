import classnames from 'classnames'
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {closeActivatePaymentsPrompt, activatePayments} from './actions'
import {completeOnboarding} from '../onboarding/actions'

const ActivatePaymentsStatusInfo = {
  success: {
    label: 'Request Sent',
    message: 'Activate payments request sent.'
  },
  error: {
    label: 'Payments Not Activated',
    message: ''
  }
}

@branch({
})
class ActivationStatus extends Component {
  _renderActivationStatus() {
    const {success, amount, statusLabel, statusMessage} = this.props;
    let statusImage = success ? 'green-check' : 'ap-pink-x';
    let labelClassname = classnames('activation-status-label', success ? 'activation-status-success' : 'activation-status-error');
    return (
      <div className='activation-status'>
        <div className='activation-status-indicator'>
          <img src={Django.static(`images/appointpal/${statusImage}.png`)} height="240"/>
        </div>
        <div className={labelClassname}>
          {statusLabel}
        </div>
        {
          statusMessage &&
          <div className='activation-status-message'>
            {statusMessage}
          </div>
        }
      </div>
    );
  }
  render() {
    return ::this._renderActivationStatus();
  }
}

@branch({
  activate_payments : ['appointpal', 'activate_payments']
})
class ActivatePaymentsPrompt extends Component {
  _closeActivatePaymentsPrompt() {
    this.props.dispatch(
      closeActivatePaymentsPrompt
    )
  }
  _closeAndCompleteOnboarding() {
    this.props.dispatch(
      closeActivatePaymentsPrompt
    );
    this.props.dispatch(
      completeOnboarding
    );
  }
  _activatePayments() {
    this.props.dispatch(
      activatePayments
    );
  }
  _renderActivatePaymentsPrompt() {
    const {pending, requested} = this.props.activate_payments;
    const statusInfo = ActivatePaymentsStatusInfo;
    const statusLabel = requested ? statusInfo.success.label : statusInfo.error.label;
    let statusMessage = requested ? statusInfo.success.message : statusInfo.error.message;
    return (
      <div className="activate-payments-wrapper">
        <div className="activate-payments-upper">
          <div className="activate-payments-header">
            <h2>
              <i className="fa fa-dollar"></i>
              Activate Payments
            </h2>
          </div>
        </div>
        <div className="activate-payments-body">
          <ActivationStatus
            success={requested}
            statusLabel={statusLabel}
            statusMessage={statusMessage}
          >
          </ActivationStatus>
        </div>
        {
          (!requested) &&
          <div className="activate-payments-lower">
            <button type='button' onClick={::this._activatePayments} className='btn btn-confirm' disabled={pending}>
              Activate
            </button>
          </div>
        }
        {
          requested &&
          <div className="activate-payments-lower">
            <button type='button' onClick={::this._closeAndCompleteOnboarding} className='btn btn-default'>
              Close
            </button>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderActivatePaymentsPrompt()
    );
  }
}

export { ActivatePaymentsPrompt };