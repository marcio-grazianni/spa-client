import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {StarRating} from '../UI/star-rating'
import {selectTestimonial} from './actions'

@branch({})
class TestimonialItem extends Component {
  _calculateRating() {
    // TODO: use actual rating field frome external reviews - will account for decimals
    const sxi = this.props.testimonial.sxi;
    let rating;
    if (sxi > 90) {
      return 5
    } else if (sxi > 70) {
      return 4
    } else if (sxi > 50) {
      return 3
    } else if (sxi > 30) {
      return 2
    } else {
      return 1
    }
  }
  _select () {
    this.props.dispatch(
      selectTestimonial,
      this.props.testimonial.session_id
    )
  }
  _renderTestimonialItem() {
    const {active_testimonial} = this.props;
    const {session_id, sender, timestamp, status, pin_status} = this.props.testimonial;

    const now = moment(); //current moment
    let timestamp_moment = moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    const rating = this._calculateRating();
    let {comments} = this.props.testimonial;
    if (comments.length > 30) {
      comments = `${comments.substring(0, 30)}...`;
    }
    const testimonial_class = classnames('testimonial', {'active': (session_id == active_testimonial)})
    let status_icon = '';
    switch (status) {
      case "open":
        status_icon = <i className='fa fa-circle'></i>
        break;
      case "replied":
        status_icon = <i className='fa fa-reply'></i>
        break;
    }

    return (
      <li className={testimonial_class} onClick={::this._select}>
        <div className='status'>
          {status_icon}
        </div>
        <div className='info'>
          <div className='top-data'>
            <div className='from'>
              <span className='sender'>{sender}</span>
              {
                (rating >= 0) &&
                <StarRating rating={rating} />
              }
              {
                pin_status &&
                <div className='pin-icon'>
                  <i className='fa fa-map-pin'></i>
                </div>
              }
            </div>
            <div className='timestamp'>
              {timestamp_moment.fromNow()}
            </div>
          </div>
          <div className='comments'>
            {comments}
          </div>
        </div>
      </li> 
    );
  }
  render() {
    return (
      ::this._renderTestimonialItem()
    );
  }
}

export { TestimonialItem };