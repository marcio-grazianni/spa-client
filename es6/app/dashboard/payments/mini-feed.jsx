import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {NoDataOverlay} from '../no-data-overlay'
import sourceConfig from '../../config/payment-sources'

class FeedItem extends Component {
  _goToPatient() {
    const {contact_id} = this.props.payment;
    window.location.href = '/patients/?pid=' + contact_id;
  }
  _renderFeedItem() {
    const seal_class = 'message-seal';
    const {name, effective_timestamp, effective_amount, effective_status, payment_source} = this.props.payment;

    const now = moment(); //current moment
    let timestamp_moment = moment(effective_timestamp, "X"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    let source_key = payment_source;
    if ('AMERICAN EXPRESS' == source_key) {
      source_key = 'Amex';
    }
    if ('Amex' != source_key && 'Discover' != source_key && 'Mastercard' != source_key && 'Visa' != source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {icon, color} = config_info;

    const inner_class = classnames('session-inner-small', seal_class);
    const node_class = classnames(payment_source, seal_class);
    const status_class = classnames('status', `${effective_status}-status`);
    const comments = parseFloat(effective_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    let display_str = name;
    return(
      <li className='feed-item feed-item-small'>
        <div className='session-content session-content-small'>
          <div className='top-info'>
            <div className='row'>
              <div className='col-sm-1 card-logo'>
                <span
                  className={node_class}
                  style={{background: color}}
                >
                  {icon}
                </span>
              </div>
              <div className='col-sm-5'>
                <div className='client-name' onClick={::this._goToPatient}>
                  <span>{display_str}</span>
                </div>
              </div>
              <div className='col-sm-5'>
                <div className='timestamp'>
                  {timestamp_moment.fromNow()}
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-1 card-logo'>
                &nbsp;
              </div>
              <div className='col-sm-5'>
                <div className='comments'>
                  {comments}
                </div>
              </div>
              <div className='col-sm-5'>
                <div className={status_class}>
                  <span>{effective_status}</span>
                </div>
              </div>
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
    const {payments} = this.props;
    let FeedItems = [];
    for (var payment of payments) {
      let item = <FeedItem
          payment={payment}
          key={payment.id}
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
              <h4>No recent payments to show</h4>
            </div>
          }
          {
            (FeedItems.length > 0 && FeedItems.length <= 6) &&
            <div className='no-feedback'>
              <i className='fa fa-comments'></i>
              <h4>No more recent payments to show</h4>
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
  is_loading: ['dashboard', 'payments_is_loading'],
  payments: ['dashboard', 'payments'],
})
class MiniFeed extends Component {
  _renderMiniFeed() {
    const {is_loading, payments} = this.props;
    return (
      <div className='mini-feed-wrapper payments'>
        <div className='header'>
          <h3>Recent Payments</h3>
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