import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TwoStepProgress} from '../UI/two-step-progress'

@branch({
  tutorial_complete: ['account', 'tutorial_complete']
})
class OnboardingHeader extends Component {
  render() {
    const {tutorial_complete} = this.props;
    const onboarding_step = tutorial_complete ? 2 : 1;
    const titles = [
      'Welcome',
      'Link Account',
    ];
    return (
      <div className="onboarding-header">
        <TwoStepProgress
          active_step={onboarding_step}
          titles={titles}
        />
      </div>
    );
  }
}

export { OnboardingHeader };