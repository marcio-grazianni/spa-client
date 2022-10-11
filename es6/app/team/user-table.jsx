import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'
import {Table, Column, Cell} from 'fixed-data-table'
import {adminChange, removeUser, saveChanges, toggleTeamLock} from './actions'

class HeaderCell extends Component {
  render() {
    const {field} = this.props;
    const wrapper_class = classnames('header-wrapper', {'center-aligned': (field !== 'Email')});
    return(
      <Cell>
        <div className={wrapper_class}>
          <span className='header'>{field}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  user_list: ['team', 'sorted_user_list'],
})
class TextCell extends Component {
  _getUser() {
    return this.props.user_list[this.props.rowIndex];
  }
  render() {
    const {user_list, field, rowIndex} = this.props;
    const user = ::this._getUser();
    const data = user[field];
    const wrapper_class = classnames('value-wrapper', { 'center-aligned': (field !== 'email')});
    return(
      <Cell>
        <div className={wrapper_class}>
          <span className='value'>{data}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  user_list: ['team', 'sorted_user_list'],
})
class StatusCell extends Component {
  _getUser() {
    return this.props.user_list[this.props.rowIndex];
  }
  render() {
    const {user_list, field, rowIndex} = this.props;
    const user = ::this._getUser();
    const data = user[field];
    let active_str;
    if (data) {
      active_str = "Active";
    } else {
      active_str = "Pending";
    }
    const wrapper_class = classnames('value-wrapper', 'center-aligned');
    return(
      <Cell>
        <div className={wrapper_class}>
          <span className='value'>{active_str}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  admin: ['user', 'admin'],
  user_list: ['team', 'sorted_user_list'],
})
class CheckBoxCell extends Component {
  _adminChange(e) {
    const user = ::this._getUser();
    this.props.dispatch(
      adminChange,
      user.id,
      e.currentTarget.checked,
    );
  }
  _getUser() {
    return this.props.user_list[this.props.rowIndex];
  }
  render() {
    const {admin, user_list, field, rowIndex} = this.props;
    const user = ::this._getUser();
    const data = user[field];
    const wrapper_class = classnames('value-wrapper', 'center-aligned');
    let disabled = false;
    if (!admin) {
      disabled = true;
    } else if (user.primary_contact) {
      disabled = true;
    } else if (!user.active) {
      disabled = true;
    }
    return(
      <Cell>
        <div className={wrapper_class}>
          <input
            type='checkbox'
            checked={data}
            disabled={disabled}
            onChange={::this._adminChange}
          />
        </div>
      </Cell>
    );
  }
}

@branch({
  admin: ['user', 'admin'],
  user_list: ['team', 'sorted_user_list'],
})
class RemoveCell extends Component {
  _getUser() {
    return this.props.user_list[this.props.rowIndex];
  }
  _removeUser() {
    const user = ::this._getUser();
    this.props.dispatch(
      removeUser,
      user.id,
    );
  }
  render() {
    const {admin} = this.props;
    const user = ::this._getUser();
    let RemoveComponent;
    if (!admin) {
      RemoveComponent = <i className='fa fa-times disabled' />
    } else if (user.primary_contact) {
      RemoveComponent = <i className='fa fa-times disabled' />
    } else {
      RemoveComponent = <i className='fa fa-times' onClick={::this._removeUser} />
    }
    const wrapper_class = classnames('value-wrapper', 'center-aligned');
    return(
      <Cell>
        <div className={wrapper_class}>
          {RemoveComponent}
        </div>
      </Cell>
    );
  }
}

@branch({
  user_list: ['team', 'sorted_user_list'],
  vertical: ['account', 'vertical'],
})
class UserTable extends Component {
  _saveChanges(e) {
    e.preventDefault();
    const {vertical} = this.props;
    if ((vertical === 'real-estate') || (vertical === 'mortgage') || (vertical === 'insurance') || (vertical === 'law') || (vertical === 'financial-services')) {
      this.props.dispatch(toggleTeamLock);
      return false
    }
    this.props.dispatch(saveChanges);
  }
   _renderUserTable() {
    const {user_list} = this.props;
    return(
      <form
        className="form-horizontal"
        id="updateUsers"
        onSubmit={::this._saveChanges}
      >
        <h3>Active Users</h3>
        <div className='table review-table'>
          <MediaQuery minWidth={1420}>
            <Table
              rowsCount={user_list.length}
              headerHeight={40}
              rowHeight={40}
              width={1036}
              height={(40 * ((user_list.length) + 1)) + 2}
            >
              <Column
                header={<HeaderCell field='Email' />}
                cell={<TextCell field='email' />}
                width={388}
              />
              <Column
                header={<HeaderCell field='Status' />}
                cell={<StatusCell field='active' />}
                width={216}
              />
              <Column
                header={<HeaderCell field='Admin' />}
                cell={<CheckBoxCell field='admin' />}
                width={216}
              />
              <Column
                header={<HeaderCell field='Remove' />}
                cell={<RemoveCell />}
                width={216}
              />
            </Table>
          </MediaQuery>
          <MediaQuery minWidth={1200} maxWidth={1419}>
            <Table
              rowsCount={user_list.length}
              headerHeight={40}
              rowHeight={40}
              width={775}
              height={(40 * ((user_list.length) + 1)) + 2}
            >
              <Column
                header={<HeaderCell field='Email' />}
                cell={<TextCell field='email' />}
                width={355}
              />
              <Column
                header={<HeaderCell field='Status' />}
                cell={<StatusCell field='active' />}
                width={140}
              />
              <Column
                header={<HeaderCell field='Admin' />}
                cell={<CheckBoxCell field='admin' />}
                width={140}
              />
              <Column
                header={<HeaderCell field='Remove' />}
                cell={<RemoveCell />}
                width={140}
              />
            </Table>
          </MediaQuery>
          <MediaQuery maxWidth={1199}>
            <Table
              rowsCount={user_list.length}
              headerHeight={40}
              rowHeight={40}
              width={695}
              height={(40 * ((user_list.length) + 1)) + 2}
            >
              <Column
                header={<HeaderCell field='Email' />}
                cell={<TextCell field='email' />}
                width={335}
              />
              <Column
                header={<HeaderCell field='Status' />}
                cell={<StatusCell field='active' />}
                width={120}
              />
              <Column
                header={<HeaderCell field='Admin' />}
                cell={<CheckBoxCell field='admin' />}
                width={120}
              />
              <Column
                header={<HeaderCell field='Remove' />}
                cell={<RemoveCell />}
                width={120}
              />
            </Table>
          </MediaQuery>
        </div>
        <button type="submit" className="btn btn-confirm save-changes">
          Save Changes
        </button>
      </form>
    );
  }
  render() {
    return (
      ::this._renderUserTable()
    );
  }
}

export { UserTable }
