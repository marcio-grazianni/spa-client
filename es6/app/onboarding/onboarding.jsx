import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AccountInfo} from './account-info'
import {APIntro} from './intro'
import {PaymentsActivated} from './payments-activated'
import {initialLoad} from './actions'

@branch({
  onboarding_step: ['onboarding', 'onboarding_step'],
  tutorial_complete: ['account', 'tutorial_complete']
})
class Onboarding extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  render() {
    const {onboarding_step, tutorial_complete} = this.props;
    return (
      <div className="onboarding-wrapper">
        {
          (onboarding_step === 0) &&
          <AccountInfo />
        }
        {
          (onboarding_step === 1) && !tutorial_complete &&
          <APIntro />
        }
        {
          (onboarding_step === 6) &&
          <PaymentsActivated/>
        }
      </div>
    );
  }
}

export { Onboarding };