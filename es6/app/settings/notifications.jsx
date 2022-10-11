import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {InputDropdown} from '../UI/input-dropdown'
import {changeValue, saveNotifications} from './actions'

@branch({
  weekly_digest: ['settings', 'inputs', 'weekly_digest'],
  email_notifications: ['settings', 'inputs', 'email_notifications']
})
class Notifications extends Component {
  _changeValue(value, input_id) {
    this.props.dispatch(
      changeValue,
      value,
      input_id
    )
  }
  _handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(saveNotifications)
  }
  _renderNotifications() {
    const {weekly_digest, email_notifications} = this.props;
    return (
      <div className="settingsContent" id="user">
        <form className="form-horizontal" id="user" onSubmit={::this._handleSubmit}>
          <h3>Notification Preferences</h3>
          <fieldset id="NotificationPreferences">
            <InputDropdown
              id="email_notifications"
              title="Message Notifications"
              tooltip="Enable email notifications for new patient messages and new patient appointment requests."
              disabled={false}
              value={email_notifications.value}
              Options={['Enabled', 'Disabled']}
              changeValue={::this._changeValue}
            />
            <InputDropdown
              id="weekly_digest"
              title="Weekly Digest"
              disabled={false}
              value={weekly_digest.value}
              Options={['Enabled', 'Disabled']}
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
      ::this._renderNotifications()
    );
  }
}

export { Notifications };