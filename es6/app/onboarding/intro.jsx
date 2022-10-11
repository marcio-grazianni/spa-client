import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {
  goToStep,
  firstNameChange,
  lastNameChange,
  usernameChange,
  passwordChange,
  confirmPasswordChange,
  accountInfoSubmit
} from './actions'
import {InputBox} from "../UI/input-box";

@branch({
})
class Intro extends Component {
  _nextStep() {
    this.props.dispatch(
      goToStep,
      1
    );
  }
  render() {
    return (
      <div className="onboarding-intro">
        <div className='left'>
          <div className='logo'>
            <img className='logo' src={Django.static('images/SV_Logo4.svg')}/>
          </div>
          <div className='intro-prompt'>
            <p>Get everything you need to generate reviews, increase ratings, boost traffic and drive revenue.</p>
          </div>
          <div className='button-wrapper'>
            <button
              type='button'
              className='btn btn-confirm'
              onClick={::this._nextStep}
            >
              Let's get started!
            </button>
          </div>
        </div>
        <div className='right'>
          <ul className='feature-list'>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/review-monitoring.svg')} />
              <label>Review Monitoring</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/review-generation.svg')} />
              <label>Review Generation</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/review-management.svg')} />
              <label>Review Management</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/reporting.svg')} />
              <label>Reporting</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/advocate-marketing.svg')} />
              <label>Advocate Marketing</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/voice-of-customer.svg')} />
              <label>Voice of Customer</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/mobile-invites.svg')} />
              <label>Mobile Invites</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/email-invites.svg')} />
              <label>Email Invites</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/testimonials.svg')} />
              <label>Testimonials</label>
            </li>
            <li className='feature'>
              <img src={Django.static('images/onboarding-icons/testimonial-widget.svg')} />
              <label>Testimonial Widget</label>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export { Intro };

@branch({
  account_slug: ['account', 'account_slug'],
  profile_id: ['user', 'profile_id'],
  account_info: ['onboarding', 'account_info'],
  needs_password: ['user', 'needs_password']
})
class APIntro extends Component {
  _nextStep(e) {
    const {needs_password} = this.props;
    const {is_valid} = this.props.account_info;
    if(needs_password) {
      e.preventDefault();
      if (is_valid) {
        this.props.dispatch(
            accountInfoSubmit,
            e
        );
      }
    } else {
      e.trigger('click');
    }
  }
  _changeValue(value, input_id) {
    let method = null;
    if('first_name' === input_id) {
      method = firstNameChange;
    } else if('last_name' === input_id) {
      method = lastNameChange;
    } else if('username' === input_id) {
      method = usernameChange;
    } else if('password' === input_id) {
      method = passwordChange;
    } else if('confirm_password' === input_id) {
      method = confirmPasswordChange;
    }

    if(method) {
      this.props.dispatch(
          method,
          value,
      );
    } else {
      alert('Unknown field name: ' + input_id);
    }
  }
  render() {
    const {account_slug, profile_id, needs_password} = this.props;
    const {first_name, last_name, username, password, confirm_password, is_valid} = this.props.account_info;
    const typeform_url = `https://appointpal.typeform.com/to/xTTNTO?typeform-medium=embed-snippet#apid=${account_slug}&pid=${profile_id}`
    const disableButton = needs_password && !is_valid;
    return (
      <div className="onboarding-inner">
        <div className="logo appointpal">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </div>
        <div className='intro-prompt appointpal'>
          <h2>Welcome to AppointPal</h2>
          <p>Let's complete setting up your account!</p>
        </div>
        {
          needs_password &&
          <form autoComplete="off">
            <InputBox
                id="first_name"
                placeholder="First Name"
                input_type="text"
                value={first_name.value}
                error={first_name.error}
                changeValue={::this._changeValue}
            />
            <InputBox
                id="last_name"
                placeholder="Last Name"
                input_type="text"
                value={last_name.value}
                error={last_name.error}
                changeValue={::this._changeValue}
            />
            <InputBox
                id="username"
                placeholder="Email"
                input_type="email"
                value={username.value}
                error={username.error}
                changeValue={::this._changeValue}
            />
            <InputBox
                id="password"
                placeholder="Password"
                input_type="password"
                autoComplete="new-password"
                value={password.value}
                error={password.error}
                changeValue={::this._changeValue}
            >
            </InputBox>
            <InputBox
                id="confirm_password"
                placeholder="Confirm Password"
                input_type="password"
                autoComplete="new-password"
                value={confirm_password.value}
                error={confirm_password.error}
                changeValue={::this._changeValue}
            />
          </form>
        }
        <div className='button-wrapper'>
          <button
            type='button'
            className='btn btn-confirm appointpal'
            disabled={disableButton}
          >
            <a
              className="typeform-share button"
              onMouseDown={::this._nextStep}
              href={typeform_url}
              data-mode="popup"
              data-size="100"
              data-submit-close-delay="10"
              target="_blank">
              Complete setup
            </a>
          </button>
        </div>
        <div className='onboarding-disclaimer'>
          By activating your account you agree to the provider <a href="https://www.appointpal.com/provider-terms-baa" target="_blank">terms</a>, business associate agreement, and privacy policy.
        </div>
      </div>
    );
  }
}

export { APIntro };