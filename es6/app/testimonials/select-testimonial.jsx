import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {FilterBar} from './filter-bar'
import {TestimonialItem} from './testimonial-item'

@branch({
  testimonial_list: ['testimonials', 'displayed_testimonials'],
  active_testimonial: ['testimonials', 'active_testimonial']
})
class SelectTestimonial extends Component {
  _renderSelectTestimonial() {
    const {testimonial_list, active_testimonial} = this.props;
    let TestimonialItems = [];
    for (var testimonial of testimonial_list) {
      let item = <TestimonialItem
          key={testimonial.session_id}
          testimonial={testimonial}
          active_testimonial={active_testimonial}
        />
      TestimonialItems.push(item);
    }
    return (
      <div className='left select-response'>
        <ul className='testimonial-list'>
          <FilterBar />
          {TestimonialItems}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSelectTestimonial()
    );
  }
}

export { SelectTestimonial };