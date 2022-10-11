import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {completeOnboarding} from './actions'

@branch({
})
class ActivationStatus extends Component {
  _renderActivationStatus() {
    return (
      <div className="activation-status">
        <div className="activation-status-indicator">
          <img src={Django.static('images/appointpal/green-check.png')} height="240"/>
        </div>
        <div className="activation-status-label activation-status-success">
          Activate Payments
        </div>
        <div className="activation-status-message">
          Payments activation request sent.
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderActivationStatus();
  }
}

@branch({
})
class PaymentsActivated extends Component {
  _nextStep() {
    this.props.dispatch(
      completeOnboarding
    );
  }
  render() {
    const button_class = classnames('btn', 'btn-confirm', 'appointpal');
    return (
      <div className="onboarding-inner">
        <div className="logo appointpal">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </div>
        <ActivationStatus />
        <div className='button-wrapper'>
          <button
            type='button'
            className={button_class}
            onClick={::this._nextStep}
          >
            Let's Go!
          </button>
        </div>
      </div>
    );
  }
}

export { PaymentsActivated };