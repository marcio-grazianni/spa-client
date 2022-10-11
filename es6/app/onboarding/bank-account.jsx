import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {OnboardingHeader} from './onboarding-header'

@branch({
})
class BankAccount extends Component {
  render() {
    return (
      <div className="onboarding-inner">
          <OnboardingHeader />
      </div>
    );
  }
}

export { BankAccount };