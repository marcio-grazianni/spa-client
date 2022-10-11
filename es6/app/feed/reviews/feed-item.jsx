import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {StarRating} from '../../UI/star-rating'
import sourceConfig from '../../config/review-sources'
import {expandComment, toggleFeatureLock} from './actions'

class SiteCircle extends Component {
  _renderSiteCircle() {
    const {source} = this.props;
    const circle_class = classnames('site-circle', source);
    let source_key = source.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {icon, color} = config_info;
    return (
      <div
        className={circle_class}
        style={{background: color}}
      >
        {icon}
      </div>
    );
  }
  render() {
    return (
      ::this._renderSiteCircle()
    );
  }
}

class ItemMeta extends Component {
  _goToPatient() {
    const {contact_id} = this.props.session;
    window.location.href = '/patients/?pid=' + contact_id;
  }
  _calculateRating() {
    // TODO: use actual rating field frome external reviews - will account for decimals
    const sxi = this.props.session.sxi;
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
  _renderItemMeta() {
    const {name, email, username, timestamp, comments, source} = this.props.session;

    // if timestamp is current day, display only the time else display full date/time
    const now = moment(); //current moment

    let source_key = source.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];

    let timestamp_moment = moment(timestamp, "X"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    // old format
    // let timestamp_format = '';
    // if (now.isSame(timestamp_moment, 'day')) {
    //   timestamp_format = 'h:mm a';
    // }
    // else {
    //   timestamp_format = 'MMM D YYYY, h:mm a';
    // }
    // const timestamp_formatted = timestamp_moment.format(timestamp_format);
    const timestamp_formatted = timestamp_moment.fromNow();

    // Calculate rating from sxi
    const rating = ::this._calculateRating();

    let display_str;
    if (name) {
      display_str = name;
    } else if (email) {
      display_str = email;
    } else if (username && !(username.startsWith('permalink')) && !(source === 'google_customer')) {
      display_str = username;
    } else {
      if (source === 'google_customer') {
        display_str = 'A Google Customer Review';
      } else {
        let source_name = config_info['name'];
        let regex = /^[AaEeIiOoUu]/;
        let article = source_name.match(regex) ? 'An' : 'A';
        display_str = `${article} ${source_name} User`;
      }
    }
    return (
      <div className='feed-meta'>
        <div className='contact' onClick={::this._goToPatient}>
          <span>{display_str}</span>
        </div>
        {
          (rating >= 0) &&
          <StarRating rating={rating} />
        }
        <div className='timestamp'>
          {timestamp_formatted}
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderItemMeta()
    );
  }
}

@branch({})
class Comments extends Component {
  _expandComment() {
    this.props.dispatch(
      expandComment,
      this.props.session_id,
      true,
    );
  }
  _unExpandComment() {
    this.props.dispatch(
      expandComment,
      this.props.session_id,
      false,
    );
  }
  _renderComments() {
    const {comments, expanded} = this.props;

    let comments_limited;
    let limited = false;
    if (comments.length > 320) {
      limited = true;
      comments_limited = comments.substring(0, 320) + '...'
    }
    else {
      comments_limited = comments;
    }

    return (
      <div className='comments'>
        {
          (!expanded) &&
          <div>
            {comments_limited}
            {
              (limited) &&
              <span className='show-more' onClick={::this._expandComment}>more <i className='fa fa-angle-double-right'></i></span>
            }
          </div>
        }
        {
          (expanded) &&
          <div>
            {comments}
            <span className='show-more' onClick={::this._unExpandComment}><i className='fa fa-angle-double-left'></i> less</span>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderComments()
    );
  }
}

@branch({
  feed_lock: ['feed', 'feed_lock'],
})
class FeedItem extends Component {

  _toggleFeatureLock() {
    this.props.dispatch(toggleFeatureLock);
    return false;
  }

  _renderFeedItem() {
    const {feed_lock} = this.props;
    const {session_id, comments, source, reply_url, expanded, location, address} = this.props.session;
    const seal_class = 'message-seal';
    const inner_class = classnames('session-inner', source, seal_class, {'no-comments': (!comments)});
    let source_key = source.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {color} = config_info;
    return (
      <li className='feed-item'>
        <div className='left-node'>
          <SiteCircle source={source} />
          <div className='session-line'></div>
        </div>
        <div className='session-content'>
          <div className={inner_class}>
            <div className='brand-identifier' style={{background: color}}></div>
            <ItemMeta {...this.props} />
            {
              (location || address) &&
              <div className='location-info'>
                <span className='location-name'>{location}</span>
                <span className='location-address'>{address}</span>
              </div>
            }
            {
              (comments) &&
              <Comments comments={comments} expanded={expanded} session_id={session_id} />
            }
            {
              (comments && feed_lock) &&
              <a className='reply-link' href='#' onClick={::this._toggleFeatureLock}><i className='fa fa-reply'></i> Reply</a>
            }
            {
              (comments && !feed_lock && reply_url) &&
              <a className='reply-link' target='_blank' href={reply_url}><i className='fa fa-reply'></i> Reply</a>
            }
          </div>
        </div>
      </li>
    );
  }
  render() {
    return (
      ::this._renderFeedItem()
    );
  }
}

export { FeedItem };