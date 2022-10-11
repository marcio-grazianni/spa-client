import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import sourceConfig from '../../config/payment-sources'

class SiteCircle extends Component {
  _renderSiteCircle() {
    const {source} = this.props;
    const circle_class = classnames('site-circle', source);
    const config_info = sourceConfig[source];
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
    const {contact_id} = this.props.item;
    window.location.href = '/patients/?pid=' + contact_id;
  }
  _renderItemMeta() {
    const {effective_timestamp, payment_source, name} = this.props.item;

    // if timestamp is current day, display only the time else display full date/time
    const now = moment(); //current moment

    let source_key = payment_source;
    if (!source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];

    let timestamp_moment = moment(effective_timestamp, "X"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    const timestamp_formatted = timestamp_moment.fromNow();

    let display_str = name;
    return (
      <div className='feed-meta'>
        <div className='row'>
          <div className='col col-sm-6'>
            <div className='contact' onClick={::this._goToPatient}>
              <span>{display_str}</span>
            </div>
          </div>
          <div className='col col-sm-6'>
            <div className='timestamp'>
              {timestamp_formatted}
            </div>
          </div>
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
  _renderComments() {
    const {color, comments, status} = this.props;
    return (
      <div className='comments'>
        <div className='row'>
          <div className='col col-sm-6'>
            {comments}
          </div>
          <div className='col col-sm-6'>
            <div className='paymentStatus' style={{color: color, float: 'right'}}>
              <span>{status}</span>
            </div>
          </div>
        </div>
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
  related_accounts: ['account', 'related_accounts'],
  selected_account_id: ['account', 'selected_account_id']
})
class FeedItem extends Component {
  _renderFeedItem() {
    const {related_accounts, selected_account_id} = this.props;
    const {effective_amount, effective_status, payment_source, child_account_name} = this.props.item;
    const comments = parseFloat(effective_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const inner_class = classnames('session-inner', payment_source, 'message-seal');
    let location = null;
    if(related_accounts && related_accounts.length > 1 && !selected_account_id) {
      location = child_account_name;
    }
    let source_key = payment_source;
    if ('AMERICAN EXPRESS' == source_key) {
      source_key = 'Amex';
    }
    if ('Amex' != source_key && 'Discover' != source_key && 'Mastercard' != source_key && 'Visa' != source_key) {
      source_key = 'appointpal';
    }
    let color = '#5B138D';  // purple
    if('Refunded' === effective_status) {
      color = '#868686';  // grey
    } else if('Failed' === effective_status) {
      color = '#B6483C';  // red
    }
    return (
      <li className='feed-item'>
        <div className='left-node'>
          <SiteCircle source={source_key} />
          <div className='session-line'></div>
        </div>
        <div className='session-content'>
          <div className={inner_class}>
            <div className='brand-identifier' style={{background: color}}></div>
            <ItemMeta {...this.props} />
            {
              location &&
              <div className='location-info'>
                <span className='location-name'>{location}</span>
              </div>
            }
            <Comments color={color} comments={comments} status={effective_status} />
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