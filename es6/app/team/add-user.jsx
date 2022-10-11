import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {addUser, addUserInputChange, toggleTeamLock} from './actions';

@branch({
  add_user_input: ['team', 'add_user_input'],
  request_pending: ['team', 'request_pending'],
  vertical: ['account', 'vertical'],
})
class AddUser extends Component {
  _addUser(e) {
    e.preventDefault();
    const {vertical} = this.props;
    if ((vertical === 'real-estate') || (vertical === 'mortgage') || (vertical === 'insurance') || (vertical === 'law') || (vertical === 'financial-services')) {
      this.props.dispatch(toggleTeamLock);
      return false
    }
    this.props.dispatch(addUser);
  }
  _onInputChange(e) {
    this.props.dispatch(
      addUserInputChange,
      e.currentTarget.value,
    );
  }
  _renderAddUser() {
    const {add_user_input, request_pending} = this.props;
    return(
      <form className="form-horizontal" id="addUser" onSubmit={::this._addUser}>
        <h3>Add User</h3>
        <fieldset id="ContactInfo">
          <div className="control-group">
            <div className="controls">
              <input
                id="inviteEmail"
                type="text"
                placeholder="Email Address"
                value={add_user_input}
                onChange={::this._onInputChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-confirm invites" disabled={request_pending}>Send Invite</button>
        </fieldset>
      </form>
    );
  }
  render() {
    return(
      ::this._renderAddUser()
    );
  }
}

export { AddUser }
