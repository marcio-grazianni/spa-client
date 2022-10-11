import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({})
class Reply extends Component {
  _renderReply() {
    const {account_name} = this.props;
    const {body, timestamp} = this.props.reply;
    const reply_from = this.props.reply.from;
    return(
      <div className='testimonial-reply'>
        <div className='top-info'>
          <div className='reply-from'>
            <i className='fa fa-reply'></i> <b>{reply_from}</b> replied on {moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D, YYYY")}
          </div>
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
  _renderTestimonialItem() {
    const {sender, timestamp, comments, reply, posted_at} = this.props.testimonial;
    const sender_display = sender.split(" ")[0];
    const rating = this._calculateRating();
    return(
      <li>
        <div className='testimonial-item-wrapper'>
          <div className='testimonial-item'>
            <div className='rating'>
              {rating} <i className='fa fa-star'></i>
            </div>
            <div className='date'>
              Posted on {moment(posted_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D, YYYY")}
            </div>
            <div className='sender'>
              {sender_display}
              <div className='verified'>
                <i className='fa fa-check-circle'></i> Verified review
              </div>
            </div>
            <div className='comment'>
              <p>{comments}</p>
            </div>
            {
              (reply) &&
              <Reply reply={reply} />
            }
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
