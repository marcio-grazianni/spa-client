import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {activatePayments} from './actions'

@branch({
})
class ActivatePayments extends Component {
  _nextStep() {
    this.props.dispatch(
      activatePayments
    );
  }
  render() {
    const button_class = classnames('btn', 'btn-confirm', 'appointpal');
    return (
      <div className="onboarding-inner">
        <div className="logo appointpal">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </div>
        <h2>Activate payments</h2>
        <p>Now you're ready to accept payments!  Click the button below to activate.</p>
        <div className='button-wrapper'>
          <button
            type='button'
            className={button_class}
            onClick={::this._nextStep}
          >
            Activate
          </button>
        </div>
      </div>
    );
  }
}

export { ActivatePayments };