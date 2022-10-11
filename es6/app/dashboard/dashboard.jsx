import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {DashboardHeader} from './dashboard-header'
import {PaymentsDashboard} from './payments-dashboard'
import {PXIDashboard} from './pxi-dashboard'
import {initialLoad} from './actions'


@branch({
  date_upgrade_prompt: ['dashboard', 'date_upgrade_prompt'],
  paid_account: ['account', 'paid_account'],
  selected: ['dashboard', 'selected_top_menu'],
  onboarding_complete: ['account', 'onboarding_complete']
})
class DashboardInner extends Component {
  _renderDashboardInner() {
    const {date_upgrade_prompt, loading, paid_account, selected, onboarding_complete} = this.props;
    let InnerSection;
    switch (selected) {
      case 'payments': {
        InnerSection = <PaymentsDashboard />
        break;
      }
      case 'pxi': {
        InnerSection = <PXIDashboard />
        break;
      }
    }
    return (
      <div>
        <div id="dashboardApp" className="newApp">
          <div className='dashboard-wrapper main-wrapper'>
            <DashboardHeader />
            {InnerSection}
          </div>
        </div>
        {
          onboarding_complete && (!paid_account) &&
          <UpgradeOverlay
            page_name="Dashboard"
          />
        }
        {
          (paid_account && date_upgrade_prompt) &&
          <UpgradeOverlay
            prompt="You need to upgrade your SubscriberVoice plan in order to gain full Dashboard access."
          />
        }
      </div>
    );
  }
  render() {
    return ::this._renderDashboardInner();
  }
}

@branch({
  loading: ['loading'],
  selected_account_id: ['account', 'selected_account_id'],
  selected_provider: ['account', 'selected_provider']
})
class Dashboard extends Component {
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
      this.props.dispatch(initialLoad);
    }
  }
  _renderDashboard() {
    const {loading} = this.props;
    return (
      <AppContainer section="dashboard">
        {
          !(loading) &&
          <DashboardInner />
        }
      </AppContainer>
    );
  }
  render() {
    return ::this._renderDashboard();
  }
}

export { Dashboard };