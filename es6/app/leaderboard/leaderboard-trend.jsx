import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import {LineGraph} from '../UI/graphs/line-graph'
import {changeMouseOver} from './actions'

@branch({
  rank: ['leaderboard', 'rank'],
  data: ['leaderboard', 'current_user', 'series'],
  max: ['leaderboard', 'current_user', 'max'],
  previous_node: ['leaderboard', 'current_user', 'previous_node'],
  field: ['leaderboard', 'active_field'],
})
class LeaderboardTrend extends Component {
  _changeMouseOver(index, hover_state) {
    this.props.dispatch(
      changeMouseOver,
      this.props.rank,
      index,
      hover_state
    )
  }
  _renderLeaderboardTrend() {
    const {data, max, field} = this.props;
    return (
      <div className='review-trend'>
        {
          (data) &&
          <div>
            <MediaQuery minWidth={1420}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                {...this.props}
                max={max[field]}
                dollars={true}
              />
            </MediaQuery>
            <MediaQuery minWidth={1200} maxWidth={1419}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                width={855}
                {...this.props}
                max={max[field]}
                dollars={true}
              />
            </MediaQuery>
            <MediaQuery maxWidth={1199}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                width={735}
                {...this.props}
                max={max[field]}
                dollars={true}
              />
            </MediaQuery>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderLeaderboardTrend()
    );
  }
}

export { LeaderboardTrend }
