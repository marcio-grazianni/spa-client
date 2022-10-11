import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {changeRange} from './actions'

@branch({
  start_date: ['leaderboard', 'start_date'],
  end_date: ['leaderboard', 'end_date']
})
class LeaderboardHeader extends Component {
  _onDateChange(picker) {
    const {startDate, endDate} = picker;
    this.props.dispatch(
      changeRange,
      startDate,
      endDate
    )
  }
  _renderLeaderboardHeader() {
    const {start_date, end_date} = this.props
    return (
      <SectionHeader
        id="leaderboard"
        icon="fa-bar-chart"
        title="Leaderboard"
        datePickerEnabled={true}
        startDate={start_date}
        endDate={end_date}
        onDateChange={::this._onDateChange}
      />
    );
  }
  render() {
    return (
      ::this._renderLeaderboardHeader()
    );
  }
}

export { LeaderboardHeader };