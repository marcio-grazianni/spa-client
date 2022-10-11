import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {ReviewBreakdown} from './review-breakdown'
import {StarRating} from '../../UI/star-rating'

@branch({
  report: ['reports', 'current_report'],
})
class TopStats extends Component {
  _renderTopStats() {
    const {overall_rating, total_reviews, review_change} = this.props.report.data;
    let ReviewChangeComponent;
    if (review_change > 0) {
      ReviewChangeComponent = <span className='up'><i className='fa fa-level-up'></i> {review_change}</span>
    } else if (review_change < 0) {
      ReviewChangeComponent = <span className='down'><i className='fa fa-level-down'></i> {Math.abs(review_change)}</span>
    } else {
      ReviewChangeComponent = <span>No Change</span>
    }
    return(
      <div className='top-stats'>
        <div className='row'>
          <div className='col col-xs-4'>
            <div className='box'>
              <div className='rating-value'>
                {
                  (overall_rating > 0) &&
                  <div><span className='value'>{overall_rating}</span>/ 5</div>
                }
                {
                  (overall_rating <= 0) &&
                  <div><span className='value'>—</span></div>
                }
              </div>
              <label>Overall Rating</label>
              {
                (overall_rating > 0) &&
                <StarRating rating={overall_rating} />
              }
              {
                (overall_rating <= 0) &&
                <StarRating rating={0} />
              }
            </div>
          </div>
          <div className='col col-xs-4'>
            <div className='box'>
              <ReviewBreakdown />
            </div>
          </div>
          <div className='col col-xs-3'>
            <div className='box'>
              <div className='total-reviews'>
                <span className='value'>{total_reviews}</span>
              </div>
              <label>Total Reviews</label>
              <div className='trend'>
                {ReviewChangeComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return(
      ::this._renderTopStats()
    );
  }
}

export { TopStats }
