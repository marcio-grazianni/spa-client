import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Waypoint from 'react-waypoint'
import {toggleUpgradePrompt} from '../actions'
import {showFeedLock} from './actions'

@branch({
  feed_lock_prompt: ['feed', 'feed_lock_prompt'],
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
  paid_account: ['account', 'paid_account'],
})
class FeedLock extends Component {
  _enterViewPort() {
    this.props.dispatch(showFeedLock);
  }
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  render() {
    const {pricing_model, paid_account} = this.props;
    const {visible} = this.props.feed_lock_prompt;
    let cta = 'Request Demo';
    if (pricing_model !== 'subscriber' && (!paid_account)) {
      cta = 'Upgrade to Preferred';
    }
    return (
      <div className='feed-lock-overlay-wrapper'>
        <ReactCSSTransitionGroup
          transitionName="fade-in"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={0}
        >
          {
            (visible) &&
            <div key='upgrade-overlay' className='upgrade-overlay'></div>
          }
        </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionName="fade-in"
            transitionEnterTimeout={2000}
            transitionLeaveTimeout={0}
          >
            {
              (visible) &&
              <div className='feed-lock-wrapper'>
                <div key='feed-lock' className='feed-lock'>
                  <div className='big-icon'>
                    <img src={Django.static('images/SV_EnvelopeNew3.svg')} />
                  </div>
                  <div className='description'>
                    <p>Get the Full Power of SubscriberVoice.</p>
                  </div>
                  <div className='button-wrapper'>
                    <button
                      type='button'
                      className='btn btn-upgrade'
                      onClick={::this._toggleUpgradePrompt}
                    >
                      {cta}
                    </button>
                  </div>
                </div>
              </div>

            }
          </ReactCSSTransitionGroup>
        <div className='feed-lock-waypoint'>
          <Waypoint
            onEnter={::this._enterViewPort}
          />
        </div>
      </div>
    );
  }
}

export { FeedLock };