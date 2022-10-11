import classnames from 'classnames'
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {closeActivateIntakePrompt, activateIntake} from './actions'

const ActivateIntakeStatusInfo = {
  success: {
    label: 'Request Sent',
    message: 'Activation request sent. You’ll be receiving an email to complete activation shortly.'
  },
  error: {
    label: 'Intake Not Activated',
    message: 'Click below to send an activation request.'
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
        <div className='activation-status-message'>
          {statusMessage}
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderActivationStatus();
  }
}

@branch({
  activate_intake : ['appointpal', 'activate_intake']
})
class ActivateIntakePrompt extends Component {
  _closeActivateIntakePrompt() {
    this.props.dispatch(
      closeActivateIntakePrompt
    )
  }
  _activateIntake() {
    this.props.dispatch(
      activateIntake
    );
  }
  _renderActivateIntakePrompt() {
    const {pending, requested} = this.props.activate_intake;
    const statusInfo = ActivateIntakeStatusInfo;
    const statusLabel = requested ? statusInfo.success.label : statusInfo.error.label;
    let statusMessage = requested ? statusInfo.success.message : statusInfo.error.message;
    return (
      <div className="activate-payments-wrapper">
        <div className="activate-payments-upper">
          <div className="activate-payments-header">
            <h2>
              <i className="fa fa-clipboard"></i>
              Activate Intake
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
            <button type='button' onClick={::this._closeActivateIntakePrompt} className='btn btn-default' disabled={pending}>
              Cancel
            </button>
            <button type='button' onClick={::this._activateIntake} className='btn btn-confirm' disabled={pending}>
              Activate
            </button>
          </div>
        }
        {
          requested &&
          <div className="activate-payments-lower">
            <button type='button' onClick={::this._closeActivateIntakePrompt} className='btn btn-default'>
              Close
            </button>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderActivateIntakePrompt()
    );
  }
}

export { ActivateIntakePrompt };