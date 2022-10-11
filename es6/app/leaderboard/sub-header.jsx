import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {DataTypeMenu} from './data-type-menu'

@branch({
  rank: ['leaderboard', 'rank'],
  user_list: ['leaderboard', 'user_list'],
  user: ['leaderboard', 'current_user'],
})
class SubHeader extends Component {
  _renderSubHeader() {
    const {rank, user_list, user} = this.props;
    return (
      <div className='review-invite-header'>
        {
          (user) &&
          <div className='header-info'>
            <div className='name'>{user.name}</div>
            <div className='rank'><b>Ranked</b> {rank} out of {user_list.length}</div>
          </div>
        }
        <DataTypeMenu />
      </div>
    );
  }
  render() {
    return (
      ::this._renderSubHeader()
    );
  }
}

export { SubHeader };