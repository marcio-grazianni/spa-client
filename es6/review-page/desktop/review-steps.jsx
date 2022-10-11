import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {CompanyLogo} from "./company-logo";
import {StepOne} from "./step-one";
import {StepTwo} from "./step-two";
import {StepThree} from "./step-three";

@branch({
  review_step: ['review_step']
})
class ReviewSteps extends Component {
  _renderReviewSteps() {
    const {review_step} = this.props;
    return(
        <div className='validation-survey'>
          <CompanyLogo/>
          {
              (review_step === 1) &&
              <StepOne/>
          }
          {
              (review_step === 2) &&
              <StepTwo/>
          }
          {
              (review_step === 3) &&
              <StepThree/>
          }
        </div>
    );
  }
  render() {
    return (
      ::this._renderReviewSteps()
    );
  }
}

export {ReviewSteps}