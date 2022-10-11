import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {ReportsHeader} from './reports-header'
import {Grid} from './grid'
import {ExpandedReport} from './expanded-report/expanded-report'
import {initialLoad} from './actions'

@branch({
  expanded: ['reports', 'expanded'],
  paid_account: ['account', 'paid_account'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id'],
  selected_provider: ['account', 'selected_provider']
})
class Reports extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id, selected_provider} = this.props;
    let prevProviderId = null;
    const prevProvider = prevProps.selected_provider;
    if(prevProvider) {
      prevProviderId = prevProvider.id;
    }
    let selected_provider_id = null;
    if(selected_provider) {
      selected_provider_id = selected_provider.id;
    }
    if(prevProps.selected_account_id !== selected_account_id || prevProviderId !== selected_provider_id) {
      this.props.dispatch(initialLoad)
    }
  }
  render() {
    const {expanded, paid_account, onboarding_complete} = this.props;
    return (
      <AppContainer section="reports">
        <div id="reportsApp" className="newApp">
          <div className='reports-wrapper main-wrapper'>
            {
              (!expanded) &&
              <div>
                <ReportsHeader />
                <div className='reports main-container'>
                  <Grid />
                </div>
              </div>
            }
            {
              (expanded) &&
              <ExpandedReport />
            }
          </div>
        </div>
        {
          onboarding_complete && (!paid_account) &&
          <UpgradeOverlay
            page_name="Reports"
          />
        }
      </AppContainer>
    );
  }
}

export { Reports };