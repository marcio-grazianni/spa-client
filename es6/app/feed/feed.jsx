import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {FeedHeader} from './feed-header'
import {FeedLock} from './feed-lock'
import {PaymentsFeed} from './payments-feed'
import {ReviewsFeed} from './reviews-feed'

@branch({
  feature_lock: ['feed', 'feature_lock'],
  feed_lock: ['feed', 'feed_lock'],
  paid_account: ['account', 'paid_account'],
  selected: ['feed', 'selected_top_menu'],
  onboarding_complete: ['account', 'onboarding_complete']
})
class Feed extends Component {
  render() {
    const {feature_lock, feed_lock, paid_account, selected, onboarding_complete} = this.props;
    let InnerSection;
    switch (selected) {
      case 'payments': {
        InnerSection = <PaymentsFeed />
        break;
      }
      case 'reviews': {
        InnerSection = <ReviewsFeed />
        break;
      }
    }
    return (
      <AppContainer section="feed">
        <div id="engagementApp" className="newApp">
          <div className='engagement-wrapper main-wrapper'>
            <FeedHeader />
            {InnerSection}
          </div>
        </div>
        {
          onboarding_complete && (!paid_account) &&
          <UpgradeOverlay
            page_name="Feed"
          />
        }
        {
          (paid_account && feed_lock && !feature_lock) &&
          <FeedLock />
        }
      </AppContainer>
    );
  }
}

export { Feed };