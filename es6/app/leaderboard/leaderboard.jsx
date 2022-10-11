import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {LeaderboardHeader} from './leaderboard-header'
import {SubHeader} from './sub-header'
import {LeaderboardTrend} from './leaderboard-trend'
import {LeaderboardTable} from './leaderboard-table'
import {initialLoad} from './actions'

@branch({
  paid_account: ['account', 'paid_account'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id']
})
class Leaderboard extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id} = this.props;
    if(prevProps.selected_account_id != selected_account_id) {
      this.props.dispatch(initialLoad)
    }
  }
  render() {
    const {paid_account, onboarding_complete} = this.props;
    return (
      <AppContainer section="leaderboard">
        <div id="leaderboardApp" className="newApp">
          <div className='leaderboard-wrapper main-wrapper'>
            <LeaderboardHeader />
            <div className='review-invites'>
              <SubHeader />
              <LeaderboardTrend />
              <LeaderboardTable />
            </div>
          </div>
        </div>
        {
          onboarding_complete && (!paid_account) &&
          <UpgradeOverlay page_name='Leaderboard' />
        }
      </AppContainer>
    );
  }
}

export { Leaderboard };