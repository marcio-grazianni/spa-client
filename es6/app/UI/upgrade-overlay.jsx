import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {Alert} from '../UI/alert'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {toggleUpgradePrompt, requestAppointpalIntroductions} from '../actions'

@branch({
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
  paid_account: ['account', 'paid_account'],
  alert: ['alpha_alert'],
  pending: ['upgrade_request_pending'],
  vertical: ['account', 'vertical'],
  request_sent: ['request_introductions_sent']
})
class UpgradeOverlay extends Component {
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  _requestAppointpalIntroductions() {
    this.props.dispatch(requestAppointpalIntroductions);
  }
  _renderUpgradeOverlay() {
    const {prompt, page_name, pricing_model, paid_account, alert, pending, request_sent} = this.props;
    const buttonClass = classnames('btn', 'btn-upgrade', {'disabled': pending});
    let description = 'Get introduced to your appointment matches now.';
    if(request_sent) {
      description = 'Request sent!  Your AppointPal Advisor will be in touch.';
    } else if(prompt) {
      description = prompt;
    }
    let cta = 'Request Demo'
    if (pricing_model !== 'subscriber' && (!paid_account)) {
      cta = 'Request introductions';
    }

    return (
      <div className='ap-upgrade-overlay'>
      {
        (!paid_account) &&
        <div>
          <div className='big-icon'>
            <img src={Django.static('images/appointpal/circle-logo-thin-p.png')} />
          </div>
          <div className='description'>
            <p>{description}</p>
          </div>
          {
            (!request_sent) &&
            <div className='button-wrapper'>
              <button
                type='button'
                className={buttonClass}
                onClick={::this._requestAppointpalIntroductions}
              >
                {cta}
              </button>
            </div>
          }
        </div>
      }
      </div>
    );
  }
  render() {
    return (
      ::this._renderUpgradeOverlay()
    );
  }
}

@branch({
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
  paid_account: ['account', 'paid_account'],
  alert: ['alpha_alert'],
  pending: ['upgrade_request_pending'],
  vertical: ['account', 'vertical'],
  request_sent: ['request_introductions_sent']
})
class MessagingUpgradeOverlay extends Component {
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  _requestAppointpalIntroductions() {
    this.props.dispatch(requestAppointpalIntroductions);
  }
  _renderUpgradeOverlay() {
    const {prompt, page_name, pricing_model, paid_account, alert, pending, request_sent} = this.props;
    const buttonClass = classnames('btn', 'btn-upgrade', {'disabled': pending});
    let description = 'Get introduced to your appointment matches now.';
    if(request_sent) {
      description = 'Request sent!  Your AppointPal Advisor will be in touch.';
    } else if(prompt) {
      description = prompt;
    }
    let cta = 'Learn More';
    if (pricing_model !== 'subscriber' && (!paid_account)) {
      cta = 'Request introductions';
    }
    return (
      <div className='ap-upgrade-overlay'>
        <div>
          <div className='big-icon'>
            <img src={Django.static('images/appointpal/circle-logo-thin-p.png')} />
          </div>
          <div className='description'>
            <p>{description}</p>
          </div>
          {
            (!request_sent) &&
            <div className='button-wrapper'>
              <button
                type='button'
                className={buttonClass}
                onClick={::this._requestAppointpalIntroductions}
              >
                {cta}
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUpgradeOverlay()
    );
  }
}

export { UpgradeOverlay, MessagingUpgradeOverlay };
