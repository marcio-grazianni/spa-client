import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {OnboardingHeader} from './onboarding-header'
import {startTutorial, completeTutorial} from './actions'

@branch({
  first_name: ['user', 'first_name'],
  vertical: ['account', 'vertical']
})
class Outro extends Component {
  _startTutorial() {
    this.props.dispatch(
      startTutorial,
    );
  }
  _skipTutorial() {
    this.props.dispatch(
      completeTutorial,
    );
  }
  render() {
    const {first_name, vertical} = this.props;
    return (
      <div className="onboarding-inner">
        <OnboardingHeader />
        <div className="logo appointpal">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </div>
        <div className='intro-prompt appointpal'>
           <h2>Great! Now that your bank account is linked, let’s take a quick product tour and finish activating payments.</h2>
          <div className='button-wrapper'>
            <button
              type='button'
              className='btn btn-confirm appointpal'
              onClick={::this._startTutorial}
            >
              Take a Tour
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export { Outro };