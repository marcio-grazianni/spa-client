import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {NoDataOverlay} from '../no-data-overlay'
import {StarRating} from '../../UI/star-rating'
import sourceConfig from '../../config/review-sources'

class FeedItem extends Component {
  _goToPatient() {
    const {contact_id} = this.props.session;
    window.location.href = '/patients/?pid=' + contact_id;
  }
  _limitComment() {
    const {comments} = this.props.session;
    if (!comments) {
      return "";
    }
    if (comments.length > 110) {
      return comments.substring(0, 110) + '...'
    }
    else {
      return comments
    }
  }
  _calculateRating() {
    // TODO: use actual rating field frome external reviews - will account for decimals
    const sxi = this.props.session.sxi;
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
  _renderFeedItem() {
    const seal_class = 'message-seal';
    const {name, email, username, timestamp, source} = this.props.session;

    const now = moment(); //current moment
    let timestamp_moment = moment(timestamp, "X"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }

    let source_key = source.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {icon, color} = config_info;

    const inner_class = classnames('session-inner-small', seal_class);
    const node_class = classnames(source, seal_class);
    const comments_limited = ::this._limitComment();
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
        display_str = `A ${config_info['name']} User`;
      }
    }
    return(
      <li className='feed-item feed-item-small'>
        <div className='session-content session-content-small'>
          <div className='top-info'>
            <div className='sxi'>
              <span
                className={node_class}
                style={{background: color}}
              >
                {icon}
              </span>
            </div>
            <div className='email' onClick={::this._goToPatient}>
              <span>{display_str}</span>
            </div>
            {
              (rating >= 0) &&
              <StarRating rating={rating} />
            }
            <div className='timestamp'>
              {timestamp_moment.fromNow()}
            </div>
          </div>
          <div className={inner_class}>
            <div className='comments'>
              {comments_limited}
            </div>
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

class Data extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderData() {
    const {sessions} = this.props;
    let FeedItems = [];
    for (var session of sessions) {
      let item = <FeedItem
          session={session}
          key={session.session_id}
        />
      FeedItems.push(item);
    }
    return(
      <div>
        <ul className='mini-feed-inner'>
          {FeedItems}
          {
            (FeedItems.length ===  0) &&
            <div className='no-feedback none'>
              <i className='fa fa-comments'></i>
              <h4>No recent feedback to show</h4>
            </div>
          }
          {
            (FeedItems.length > 0 && FeedItems.length <= 6) &&
            <div className='no-feedback'>
              <i className='fa fa-comments'></i>
              <h4>No more recent feedback to show</h4>
            </div>
          }
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderData()
    );
  }
}

@branch({
  is_loading: ['dashboard', 'pxi_is_loading'],
  sessions: ['dashboard', 'sessions'],
})
class MiniFeed extends Component {
  _renderMiniFeed() {
    const {is_loading, sessions} = this.props;
    return (
      <div className='mini-feed-wrapper testimonials'>
        <div className='header'>
          <h3>Recent Feedback</h3>
        </div>
        <div className='bottom-data-container mini-feed-container'>
          {
            (is_loading) ? <LoadingOverlay /> : <Data {...this.props} />
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderMiniFeed()
    );
  }
}

export { MiniFeed };