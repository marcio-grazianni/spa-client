import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TestimonialMain} from './testimonial-main'
import {initialLoad} from '../actions'
import {BookAppointment} from './book-appointment/book-appointment'

@branch({
  testimonial_list: ['testimonial_list'],
  loading_testimonials: ['loading_testimonials'],
  booking_step: ['booking', 'booking_step']
})
class TestimonialMobile extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  _renderTestimonialMobile() {
    const {testimonial_list, loading_testimonials, booking_step} = this.props;
    return(
      <div id="validationApp" className="newApp">
        {
        (booking_step == 0) &&
          <div className="validation-wrapper main-wrapper">
            <TestimonialMain />
          </div>
        }
        {
          (booking_step > 0) &&
          <div>
            <BookAppointment />
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialMobile()
    );
  }
}

export { TestimonialMobile };
