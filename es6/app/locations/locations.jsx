import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {LocationsHeader} from './locations-header'
import {SubHeader} from './sub-header'
import {LocationsTrend} from './locations-trend'
import {LocationsTable} from './locations-table'
import {LocationsMap} from './locations-map'
import {initialLoad} from './actions'

@branch({
  selected: ['locations', 'selected_top_menu'],
  paid_account: ['account', 'paid_account'],
  selected_account_id: ['account', 'selected_account_id']
})
class Locations extends Component {
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
    const {selected, paid_account} = this.props;
    return (
      <AppContainer section="locations">
        <div id="locationsApp" className="newApp">
          <div className='locations-wrapper main-wrapper'>
            <LocationsHeader />
            {
              (selected === 'leaderboard') &&
              <div className='review-invites'>
                <SubHeader />
                <LocationsTrend />
                <LocationsTable />
              </div>
            }
            {
              (selected === 'map') &&
              <LocationsMap />
            }
          </div>
        </div>

        {
          (!paid_account) &&
          <UpgradeOverlay page_name='Locations' />
        }
      </AppContainer>
    );
  }
}

export { Locations };