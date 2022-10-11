import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {InputBox} from '../UI/input-box'
import {InputDropdown} from '../UI/input-dropdown'
import {changeValue, saveUserInfo} from './actions'

@branch({
  username: ['settings', 'inputs', 'username'],
  first_name: ['settings', 'inputs', 'first_name'],
  last_name: ['settings', 'inputs', 'last_name'],
  phone_number: ['settings', 'inputs', 'phone_number'],
  weekly_digest: ['settings', 'inputs', 'weekly_digest']
})
class UserInfo extends Component {
  _changeValue(value, input_id) {
    this.props.dispatch(
      changeValue,
      value,
      input_id
    )
  }
  _handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(saveUserInfo)
  }
  _renderUserInfo() {
    const {username, first_name, last_name, phone_number} = this.props;
    return (
      <div className="settingsContent" id="user">
        <form className="form-horizontal" id="user" onSubmit={::this._handleSubmit}>
          <h3>User Info</h3>
          <fieldset id="CompanyInfo">
            <InputBox
              id="username"
              title="Username (email)"
              disabled={true}
              input_type="text"
              value={username.value}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="first_name"
              title="First Name"
              max_length={30}
              disabled={false}
              input_type="text"
              value={first_name.value}
              error={first_name.error}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="last_name"
              title="Last Name"
              max_length={30}
              disabled={false}
              input_type="text"
              value={last_name.value}
              error={last_name.error}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="phone_number"
              title="Phone Number"
              max_length={30}
              disabled={false}
              input_type="text"
              value={phone_number.value}
              error={phone_number.error}
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
      ::this._renderUserInfo()
    );
  }
}

export { UserInfo };