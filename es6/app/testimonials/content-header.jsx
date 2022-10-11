import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {StarRating} from '../UI/star-rating'
import {confirmationToggle} from '../actions'

@branch({
  testimonial_confirm_enabled: ['user', 'testimonial_confirm_enabled']
})
class PinButton extends Component {
  _pin () {
    let action = '';
    if (this.props.pin_status) {
      action = 'unpin';
    }
    else {
      action = 'pin';
    }
    if (this.props.testimonial_confirm_enabled) {
      this.props.dispatch(
        confirmationToggle,
        action
      )
    }
  }
  _renderPinButton() {
    const {pin_status} = this.props;
    const pin_class = classnames('pin', {'active': pin_status});
    return (
      <div className={pin_class}>
        <button
          className='btn btn-pin no-shadow'
          type='button'
          onClick={::this._pin}
        >
          <i className='fa fa-map-pin'></i>
        </button>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPinButton()
    );
  }
}

@branch({
  testimonial: ['testimonials', 'current_testimonial']
})
class ContentHeader extends Component {
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
  _renderContentHeader() {
    const {status, sender, posted_status, pin_status, timestamp} = this.props.testimonial;
    
    const now = moment(); //current moment
    let timestamp_moment = moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    const lock_status_class = classnames('lock-status', {'active': (status == 'open')});
    const rating = this._calculateRating();
    return (
      <div className='content-header'>
        <div className='sender'>
          <h4>{sender}</h4>
        </div>
        {
          (rating >= 0) &&
          <StarRating rating={rating} />
        }
        {
          (posted_status == 'posted') &&
          <PinButton pin_status={pin_status} />
        }
        <div className='meta'>
          <div className='timestamp'>
            {timestamp_moment.fromNow()}
          </div>
          <div className={lock_status_class}>
            <button
              type='button'
              className='btn btn-lock no-shadow'
            >
              <i className='fa fa-lock'></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderContentHeader()
    );
  }
}

export { ContentHeader };