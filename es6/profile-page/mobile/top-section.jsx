import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleReview} from '../actions'
import {BookAppointmentButton} from './book-appointment-button'

@branch({
  account_name: ['account_name'],
  active_date: ['active_date'],
  account_url: ['account_url'],
  account_logo: ['account_logo'],
  account_rating: ['account_rating'],
  location: ['abbrev_location'],
  review_ct: ['review_ct'],
  testimonial_ct: ['testimonial_count'],
  testimonial_rating: ['testimonial_rating'],
})
class TopSection extends Component {
  _toggleReview() {
    this.props.dispatch(toggleReview)
  }
  render() {
    const {account_name, active_date, account_url, account_logo, account_rating, review_ct, testimonial_ct, testimonial_rating} = this.props;
    let location;
    if (this.props.location) {
      location = this.props.location;
    } else {
      location = "United States";
    }

    let url = "";
    if (account_url) {
      url = account_url.replace(/^https?:\/\//,'').replace(/\/$/, "")
    }

    // Round to nearest half
    const rating_half_round = Math.round(testimonial_rating*2)/2;
    let half_star = false;
    if (rating_half_round % 1 !== 0) {
      half_star = true
    }

    
    return(
      <div className='top-section'>
        {
          (account_logo !== Django.media_url) &&
          <div className='company-logo-wrapper'>
            <div className='logo-wrapper'>
              <div className='logo'>
                <img className="logo" src={account_logo} />
              </div>
            </div>
          </div>
        }
        <div className='info-wrapper'>
          <div className='info'>
            <div className='account-name'>
              {account_name}
            </div>
            <div className='rating'>
              {testimonial_rating}
              <span className='rating'>
                <span className='stars bg'>
                  {
                    Array(Math.floor(5)).fill().map((_,i) =>
                      <span className='star' key={i}>
                        <i className='fa fa-star'></i>
                      </span>
                    )
                  }
                </span>

                <span className='stars'>
                  {
                    Array(Math.floor(rating_half_round)).fill().map((_,i) =>
                      <span className='star' key={i}>
                        <i className='fa fa-star'></i>
                      </span>
                    )
                  }
                  {
                    (half_star) &&
                    <span className='star'>
                      <i className='fa fa-star-half'></i>
                    </span>
                  }
                </span>
              </span>
            </div>
            <div className='num-ratings'>
              <i className='fa fa-comments'></i>
              {testimonial_ct} reviews
            </div>
            <div className='location'>
              {location}
            </div>
            <div>
              <span className='write-review'>
                <a onClick={::this._toggleReview}>Write a review <i className='fa fa-chevron-circle-right'></i></a>
              </span>
              <span className='book-appointment-button-wrapper'>
                <BookAppointmentButton />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { TopSection };
