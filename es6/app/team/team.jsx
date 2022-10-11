import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {TeamHeader} from './team-header'
import {AddUser} from './add-user'
import {UserTable} from './user-table'
import {initialLoad} from './actions'

@branch({
  vertical: ['account', 'vertical'],
  team_lock: ['team', 'team_lock'],
  review_invite_lock: ['review_invite_lock'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id']
})
class Team extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id} = this.props;
    if(prevProps.selected_account_id != selected_account_id) {
      this.props.dispatch(initialLoad)
    }
  }
  render() {
    const {vertical, team_lock, review_invite_lock, onboarding_complete} = this.props;
    return (
      <AppContainer section="team">
        <div className="settingsPage">
          <div id="settingsApp" className="newApp">
            <div className='team-wrapper main-wrapper settingsBody'>
              <TeamHeader />
              <div className='settingsContent' id="people">
                <AddUser />
                <UserTable />
              </div>
            </div>
          </div>
        </div>
        {
          onboarding_complete && (team_lock || review_invite_lock) &&
          <UpgradeOverlay page_name="Team" />
        }
      </AppContainer>
    );
  }
}

export { Team }
