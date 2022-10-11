import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import {CompanyLogo} from './company-logo'
import {StepOne} from './step-one'
import {StepTwo} from './step-two'
import {StepThree} from './step-three'

@branch({
  review_step: ['review_step']
})
class Review extends Component {
  _renderReview() {
    const {review_step} = this.props;
    return(
      <div className='validation-survey'>
        <CompanyLogo />
        {
          (review_step === 1) &&
          <StepOne />
        }
        {
          (review_step === 2) &&
          <StepTwo />
        }
        {
          (review_step === 3) &&
          <StepThree />
        }
        <div className='powered-by'>
          <span className='powered-by'>powered by</span>
          <img src={Django.static('images/appointpal/banner-logo-white.svg')}/>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReview()
    );
  }
}

export { Review };
