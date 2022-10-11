import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {WidgetHeader} from './widget-header'
import {Code} from './code'
import {Edit} from './edit'
import {Preview} from './preview'
import {initialLoad} from './actions'

@branch({
  paid_account: ['account', 'paid_account'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id']
})
class Widget extends Component {
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
      <AppContainer section="widget">
        <div id="widgetApp" className="newApp">
          <div className='seals-wrapper main-wrapper'>
            <WidgetHeader />
            <div className='inner'>
              <div className='main-wrapper message-seal'>
                <div className='left'>
                  <ul className='edit-list'>
                    <Code />
                  </ul>
                </div>
                <div className='right'>
                  <Preview />
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          onboarding_complete && (!paid_account) &&
          <UpgradeOverlay
            page_name="Widget"
          />
        }
      </AppContainer>
    );
  }
}

export { Widget };