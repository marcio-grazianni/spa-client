import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {initialLoad} from '../actions'
import {Header} from './header'
import {ReviewComplete} from './review-complete'
import {ReviewSteps} from "../desktop/review-steps";

@branch({
  review_completed: ['review_completed'],
  loading_testimonials: ['loading_testimonials'],
})
class ReviewMobile extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  _renderTestimonialMobile() {
    const {review_completed, loading_testimonials} = this.props;
    return(
      <div id="validationApp" className="newApp">
        <div className="validation-wrapper main-wrapper">
          {
              (!loading_testimonials) &&
              <div>
                {
                    (!review_completed) &&
                    <div>
                      <Header/>
                      <ReviewSteps/>
                    </div>
                }
                {
                    (review_completed) &&
                    <ReviewComplete />
                }
              </div>
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialMobile()
    );
  }
}

export { ReviewMobile };
