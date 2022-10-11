import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {closePaymentPrompt} from './actions'
import classnames from 'classnames'

@branch({
  first_name: ['user', 'first_name'],
  set_password_url: ['onboarding', 'set_password_url']
})
class Outro extends Component {
  _closePaymentPrompt() {
    const {set_password_url} = this.props;
    this.props.dispatch(closePaymentPrompt);
    window.location.href=set_password_url;
  }
  render() {
    const {first_name} = this.props;
    let mainClass = classnames('onboarding-outro', 'payment-outro', 'appointpal');
    let congratulated = '';
    if (first_name) {
      congratulated = ', ' + first_name
    }
    return (
      <div className={mainClass}>
        <div className='logo'>
          <img className='logo' src={Django.static('images/appointpal/banner-logo.svg')}/>
        </div>
        <div className='intro-prompt'>
          <h2>Congrats{congratulated}!</h2>
          <p>You've successfully upgraded your AppointPal plan.</p>
        </div>
        <div className='button-wrapper'>
          <button
            type='button'
            className='btn btn-confirm'
            onClick={::this._closePaymentPrompt}
          >
            Set your password and get started!
          </button>
        </div>
      </div>
    );
  }
}

export { Outro };