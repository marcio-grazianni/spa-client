import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'
import {Table, Column, Cell} from 'fixed-data-table'
import {setActive} from './actions'
import {StarRating} from '../UI/star-rating'

class HeaderCell extends Component {
  render() {
    const {field} = this.props;
    const wrapper_class = classnames('header-wrapper', {'center-aligned': (field !== 'Name')});
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
  user_list: ['leaderboard', 'user_list'],
  active_rank: ['leaderboard', 'rank'],
})
class TextCell extends Component {
  _getUser() {
    return this.props.user_list[this.props.rowIndex];
  }
  _setActive() {
    this.props.dispatch(
      setActive,
      this._getUser().rank
    )
  }
  render() {
    const {user_list, active_rank, field, rowIndex} = this.props;
    const user = ::this._getUser();
    const data = user[field];
    const wrapper_class = classnames('value-wrapper', {active: (active_rank === user.rank), 'center-aligned': (field !== 'name')});
    return(
      <Cell>
        <div className={wrapper_class} onClick={::this._setActive}>
          <span className='value'>{data}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  user_list: ['leaderboard', 'user_list'],
})
class LeaderboardTable extends Component {
  _renderLeaderboardTable() {
    const {user_list} = this.props;
    return(
      <div className='table review-table'>
        {
          (user_list.length > 0) &&
          <div>
            <MediaQuery minWidth={1420}>
              <Table
                rowsCount={user_list.length}
                headerHeight={40}
                rowHeight={40}
                width={1080}
                height={(40 * ((user_list.length) + 1)) + 2}
              >
                <Column
                  header={<HeaderCell field='Rank' />}
                  cell={<TextCell field='rank' />}
                  width={216}
                />
                <Column
                  header={<HeaderCell field='Name' />}
                  cell={<TextCell field='name' />}
                  width={216}
                />
                <Column
                  header={<HeaderCell field='Total sales' />}
                  cell={<TextCell field='payments_succeeded' />}
                  width={216}
                />
                <Column
                  header={<HeaderCell field='Paid invoices' />}
                  cell={<TextCell field='invoices_paid' />}
                  width={216}
                />
                <Column
                  header={<HeaderCell field='Pending invoices' />}
                  cell={<TextCell field='invoices_pending' />}
                  width={216}
                />
              </Table>
            </MediaQuery>
            <MediaQuery minWidth={1200} maxWidth={1419}>
              <Table
                rowsCount={user_list.length}
                headerHeight={40}
                rowHeight={40}
                width={810}
                height={(40 * ((user_list.length) + 1)) + 2}
              >
                <Column
                  header={<HeaderCell field='Rank' />}
                  cell={<TextCell field='rank' />}
                  width={162}
                />
                <Column
                  header={<HeaderCell field='Name' />}
                  cell={<TextCell field='name' />}
                  width={162}
                />
                <Column
                  header={<HeaderCell field='Total sales' />}
                  cell={<TextCell field='payments_succeeded' />}
                  width={162}
                />
                <Column
                  header={<HeaderCell field='Paid invoices' />}
                  cell={<TextCell field='invoices_paid' />}
                  width={162}
                />
                <Column
                  header={<HeaderCell field='Pending invoices' />}
                  cell={<TextCell field='invoices_pending' />}
                  width={162}
                />
              </Table>
            </MediaQuery>
            <MediaQuery maxWidth={1199}>
              <Table
                rowsCount={user_list.length}
                headerHeight={40}
                rowHeight={40}
                width={760}
                height={(40 * ((user_list.length) + 1)) + 2}
              >
                <Column
                  header={<HeaderCell field='Rank' />}
                  cell={<TextCell field='rank' />}
                  width={152}
                />
                <Column
                  header={<HeaderCell field='Name' />}
                  cell={<TextCell field='name' />}
                  width={152}
                />
                <Column
                  header={<HeaderCell field='Total sales' />}
                  cell={<TextCell field='payments_succeeded' />}
                  width={152}
                />
                <Column
                  header={<HeaderCell field='Paid invoices' />}
                  cell={<TextCell field='invoices_paid' />}
                  width={152}
                />
                <Column
                  header={<HeaderCell field='Pending invoices' />}
                  cell={<TextCell field='invoices_pending' />}
                  width={152}
                />
              </Table>
            </MediaQuery>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderLeaderboardTable()
    );
  }
}

export { LeaderboardTable }
