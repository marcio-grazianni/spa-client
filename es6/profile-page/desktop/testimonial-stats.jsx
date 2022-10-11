import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import {toggleReview} from '../actions'
import {AggregateStarRating} from '../UI/aggregate-star-rating'
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"
import {LocationsMap} from './testimonials-map'

@branch({
  account_rating: ['account_rating'],
  active_date: ['active_date'],
  review_ct: ['review_ct'],
  vertical: ['vertical'],
  full_location: ['full_location'],
  testimonial_ct: ['testimonial_count'],
  testimonial_rating: ['testimonial_rating'],
})
class TestimonialStats extends Component {
  _toggleReview() {
    this.props.dispatch(toggleReview)
  }
  _renderTestimonialStats() {
    const {account_rating, active_date, review_ct, vertical, full_location, testimonial_ct, testimonial_rating} = this.props;
    let is_rated = testimonial_rating && testimonial_rating > 0;
    let FeatureList = ['Ratings', 'Experience Monitoring', 'Reviews', 'Search Engine Optimization', 'Online Booking', 'And much more!'];
    let HealthCareVerticals = ['cosmetic-surgery', 'dentistry', 'healthcare', 'healthcare-lite'];
    if (HealthCareVerticals.includes(vertical)) {
      FeatureList = ['Ratings', 'Patient Experience', 'Reviews', 'Online Booking', 'Testimonials', 'Search Engine Optimization'];
    }
    let FeatureComponents = FeatureList.map((value) => {
      return (
        <li className='feature' key={value}>
          <i className='fa fa-check'></i> {value}
        </li>
      )
    });
    return(
      <div className='validation-stats-wrapper'>
        <div className='validation-stats'>
          <div className='validation-ratings stats-wrapper'>
            <div className='header'>
              <h2>
                <i className='fa fa-star'></i>
                Ratings & Reviews
              </h2>
            </div>
            <div className='validation-inner'>
              <div className='rating-wrapper'>
              {
                is_rated &&
                <div className='rating' itemProp='aggregateRating' itemScope itemType='http://schema.org/AggregateRating'>
                  <meta itemProp='ratingCount' content={testimonial_ct} />
                  <span className='rating-text'>{testimonial_rating}</span> out of 5
                  <AggregateStarRating rating={testimonial_rating} />
                </div>
              }
              { !is_rated &&
                <div className='rating'>
                  <meta itemProp='ratingCount' content={0} />
                  Be the first to rate
                  <AggregateStarRating rating={0} />
                </div>
              }
              </div>
              <div className='review-prompt-wrapper prompt-wrapper'>
                <div className='review-prompt prompt'>
                  <p className='prompt'>Tell us about your experience.</p>
                  <a className='answer' onClick={::this._toggleReview}>Write a review <i className='fa fa-chevron-circle-right'></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className='validation-map stats-wrapper'>
            <div className='header'>
              <h2>
                <i className='fa fa-map-marker'></i>
                Location
              </h2>
            </div>
            <div className='map-wrapper'>
              <div className='info'>
                <span className='location' itemProp='address'>
                  <i className='fa fa-map-marker'></i> {full_location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialStats()
    );
  }
}

export { TestimonialStats };
