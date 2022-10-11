import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import {StarRating} from '../UI/star-rating'

@branch({
  account_name: ['account_name']
})
class Reply extends Component {
  _renderReply() {
    const {account_name} = this.props;
    const {body, timestamp} = this.props.reply;
    const reply_from = this.props.reply.from;
    return(
      <div className='testimonial-reply'>
        <div className='top-info'>
          <div className='reply-from'>
            <i className='fa fa-reply'></i> {reply_from} at {account_name}
          </div>
          <div className='published'>Posted {moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D, YYYY")}</div>
        </div>
        <div className='comment'>
          <p>{body}</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReply()
    );
  }
}

@branch({
  account_name: ['account_name']
})
class TestimonialItem extends Component {
    _calculateRating() {
    // TODO: use actual rating field from external reviews - will account for decimals
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
  _renderTestimonialItem() {
    const {account_name} = this.props;
    const {sender, timestamp, comments, reply, posted_at} = this.props.testimonial;
    const sender_display = sender.split(" ")[0];
    const rating = this._calculateRating();
    return(
      <li>
        <div className='testimonial-item-wrapper'>
          <div className='testimonial-item' itemProp='review' itemScope itemType='http://schema.org/Review'>
            <span className='hidden' itemProp='publisher' itemScope itemType='http://schema.org/Organization'>
              <span className='hidden' itemProp='name'>SubscriberVoice</span>
              <span className='hidden' itemProp='url'>https://www.subscribervoice.com</span>
            </span>
            <meta itemProp='itemReviewed' content={account_name} />
            <div className='sender-wrapper'>
              <div className='sender' itemProp='author'>
                {sender_display}
              </div>
              <div className='verified'>
                <i className='fa fa-check-circle'></i> Verified review
              </div>
            </div>
            <div className='body-wrapper'>
              <div className='testimonial-body'>
                <div className='top-info'>
                  <StarRating rating={rating} />
                  <div className='published' itemProp='dateCreated'>
                    Posted {moment(posted_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D, YYYY")}
                  </div>
                </div>
                <div className='comment' itemProp='reviewBody'>
                  <p>{comments}</p>
                </div>
                {
                  (reply) &&
                  <Reply reply={reply} />
                }
              </div>
            </div> 
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
