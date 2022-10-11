import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {confirmationToggle} from '../actions' //app actions
import {replyToggle, testimonialLock} from './actions' //testimonial actions

@branch({
  testimonial_confirm_enabled: ['user', 'testimonial_confirm_enabled'],
  paid_account: ['account', 'paid_account'],
})
class TestimonialOptions extends Component {
  _unPost () {
    if (this.props.testimonial_confirm_enabled) {
      this.props.dispatch(
        confirmationToggle,
        'unpost'
      )
    }
  }
  _flag () {
    if (this.props.testimonial_confirm_enabled && this.props.paid_account) {
      this.props.dispatch(
        confirmationToggle,
        'flag'
      )
    } else if (!this.props.paid_account) {
      this.props.dispatch(testimonialLock);
    }
  }
  _unFlag() {
    if (this.props.testimonial_confirm_enabled) {
      this.props.dispatch(
        confirmationToggle,
        'unflag'
      )
    }
  }
  _post() {
    if (this.props.testimonial_confirm_enabled && this.props.paid_account) {
      this.props.dispatch(
        confirmationToggle,
        'post'
      )
    } else if (!this.props.paid_account) {
      this.props.dispatch(testimonialLock);
    }
  }
  _renderTestimonialOptions() {
    const {posted_status} = this.props;
    let TestimonialOptionComponents = [];
    switch (posted_status) { //Different options based on selected type
      case 'posted':
        TestimonialOptionComponents.push(
          <li key={0}>
            <button
              className='btn btn-post no-shadow active'
              type='button'
              onClick={::this._unPost}
            >
              <img src={Django.static('images/post-icon-active.svg')} />
            </button>
          </li>
        );
        break;
      case 'pending':
        TestimonialOptionComponents.push(
          <li key={0}>
            <button
              className='btn btn-flag no-shadow'
              type='button'
              onClick={::this._flag}
            >
              <i className='fa fa-flag'></i>
            </button>
          </li>
        );
        TestimonialOptionComponents.push(
          <li key={1}>
            <button
              className='btn btn-post no-shadow'
              type='button'
              onClick={::this._post}
            >
              <img src={Django.static('images/post-icon.svg')} />
            </button>
          </li>
        );
        break;
      case 'flagged':
        TestimonialOptionComponents.push(
          <li key={0}>
            <button
              className='btn btn-flag no-shadow active'
              type='button'
              onClick={::this._unFlag}
            >
              <i className='fa fa-flag'></i>
            </button>
          </li>
        );
        break;
    }
    return (
      <ul className='testimonial-options'>
        {TestimonialOptionComponents}
      </ul>
    );
  }
  render() {
    return (
      ::this._renderTestimonialOptions()
    );
  }
}

@branch({
  testimonial_confirm_enabled: ['user', 'testimonial_confirm_enabled'],
  paid_account: ['account', 'paid_account'],
})
class ReplyStatus extends Component {
  _reply () {
    if (this.props.testimonial_confirm_enabled && this.props.paid_account) {
      this.props.dispatch(replyToggle);
    } else if (!this.props.paid_account) {
      this.props.dispatch(testimonialLock);
    }
  }
  _renderReplyStatus() {
    const {reply, reply_active} = this.props;
    const reply_class = classnames('reply', {'active': reply_active});
    if (reply) {
      return (
        <button
          type='button'
          className='reply replied'
        >
          <i className='fa fa-reply'></i>
          <span>Replied on {moment(reply.timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</span>
        </button>
      );
    }
    else {
      return (
        <button
          type='button'
          className={reply_class}
          onClick={::this._reply}
        >
          <i className='fa fa-reply'></i>
          <span>Reply to this testimonial</span>
        </button>
      );
    }
  }
  render () {
    return (
      ::this._renderReplyStatus()
    )
  }
}

@branch({
  testimonial: ['testimonials', 'current_testimonial'],
  reply_active: ['testimonials', 'reply_active']
})
class ContentFooter extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderContentFooter() {
    const {reply_active} = this.props;
    const {posted_status, reply} = this.props.testimonial;
    return (
      <div className='content-reply'>
        {
          (posted_status != 'flagged') &&
          <div className='reply-button-wrapper'>
            <ReplyStatus reply={reply} reply_active={reply_active} />
          </div>
        }
        <TestimonialOptions posted_status={posted_status} />
      </div>
    );
  }
  render() {
    return (
      ::this._renderContentFooter()
    );
  }
}

export { ContentFooter };