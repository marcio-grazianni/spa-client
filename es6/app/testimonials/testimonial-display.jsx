import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TestimonialContent} from './testimonial-content'
import {TestimonialReply} from './testimonial-reply'
import {ReplyDisplay} from './reply-display'

@branch({
  testimonial: ['testimonials', 'current_testimonial'],
  reply_active: ['testimonials', 'reply_active'],
})
class TestimonialDisplay extends Component {
  _renderTestimonialDisplay() {
    const {testimonial, reply_active} = this.props;
    let ReplySection = null;
    if (testimonial) { // if there is a selected testimonial.. add reply section if necessary
      if (reply_active) {
        ReplySection = <TestimonialReply />
      }
      else if (testimonial.reply) {
        ReplySection = <ReplyDisplay reply={testimonial.reply} />
      }
    }
    return (
      <div className='right respond'>
        {
          testimonial &&
          <div className='testimonial-wrapper'>
            <TestimonialContent />
            {ReplySection}
          </div>
        }
        {//no selected testimonial
          !(testimonial) &&
          <div className='no-testimonials'>
            <i className='fa fa-inbox'></i>
            <h4>No testimonials to show</h4>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialDisplay()
    );
  }
}

export { TestimonialDisplay };