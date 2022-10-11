import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Header} from './header'
import {TopSection} from './top-section'
import {TestimonialList} from './testimonial-list'
import {Review} from './review/review'
import {ReviewComplete} from './review-complete'

@branch({
  review: ['review'],
  review_complete: ['review_complete'],
})
class TestimonialMain extends Component {
  _renderTestimonialMain() {
    const {review, review_complete} = this.props;
    return(
      <div className='mobile-testimonial'>
        <Header />
        {
          (!review_complete && !review) &&
          <div>
            <TopSection />
            <TestimonialList />
          </div>
        }
        {
          (!review_complete && review) &&
          <Review />
        }
        {
          (review_complete) &&
          <ReviewComplete />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialMain()
    );
  }
}

export { TestimonialMain };
