import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {InputBox} from '../UI/input-box'
import {changeValue, changePassword} from './actions'

@branch({
  password_validation: ['settings', 'password_validation'],
  current_password: ['settings', 'inputs', 'current_password'],
  new_password_1: ['settings', 'inputs', 'new_password_1'],
  new_password_2: ['settings', 'inputs', 'new_password_2'],
})
class Password extends Component {
  _changeValue(value, input_id) {
    this.props.dispatch(
      changeValue,
      value,
      input_id
    )
  }
  _handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(changePassword)
  }
  _renderPassword() {
    const {current_password, new_password_1, new_password_2} = this.props;
    const {verified, match} = this.props.password_validation;
    return (
      <div className="settingsContent" id="password">
        <form className="form-horizontal" id="password" onSubmit={::this._handleSubmit}>
          <h3>Change Password</h3>
          <fieldset id="ContactInfo">
            <InputBox
              id="current_password"
              title="Current Password"
              input_type="password"
              value={current_password.value}
              error={current_password.error}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="new_password_1"
              title="New Password"
              input_type="password"
              validation={verified}
              value={new_password_1.value}
              error={new_password_1.error}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="new_password_2"
              title="Confirm New Password"
              max_length={255}
              input_type="password"
              validation={match}
              value={new_password_2.value}
              error={new_password_2.error}
              changeValue={::this._changeValue}
            />
            <button type="submit" className='btn btn-confirm btn-save'>
              Save Changes
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPassword()
    );
  }
}

export { Password };