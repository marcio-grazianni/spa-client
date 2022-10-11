import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {Alert} from '../UI/alert'
import {InputBox} from '../UI/input-box'
import {accountInfoChange, accountInfoSubmit} from './actions'

@branch({
  account_info: ['onboarding', 'account_info'],
  alert: ['alpha_alert'],
  vertical: ['account', 'vertical']
})
class AccountInfo extends Component {
  _nextStep() {
    this.props.dispatch(
      accountInfoSubmit
    );
  }
  _changeValue(value, input_id) {
    this.props.dispatch(
      accountInfoChange,
      value,
      input_id,
    )
  }
  render() {
    const {alert, vertical} = this.props;
    const {first_name, last_name, username, password, confirm_password, account_name, phone_number, disable_fields} = this.props.account_info;
    let button_class = classnames('btn', 'btn-confirm', 'appointpal');
    return (
      <div className="onboarding-account">
        <div className="logo appointpal">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </div>
        <h2>Enter account info.</h2>
        <p>This allows you to access your appointment requests.</p>
        <form autoComplete="off">
          {
            (alert) &&
            <div className='alert-wrapper'>
              <Alert alert={alert} alpha={true} />
            </div>
          }
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
            {
              (false) &&
              <span className='password-prompt'>
                Your password must be >=8 characters and contain at least 1 letter and 1 number.
              </span>
            }
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
          <InputBox
            id="phone_number"
            placeholder="Phone Number"
            input_type="text"
            value={phone_number.value}
            error={phone_number.error}
            changeValue={::this._changeValue}
          />
        </form>
        <div className='button-wrapper'>
          <button
            type='button'
            className={button_class}
            onClick={::this._nextStep}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export { AccountInfo };