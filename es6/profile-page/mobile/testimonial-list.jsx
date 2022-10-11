import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TestimonialItem} from './testimonial-item'

@branch({
  testimonial_list: ['testimonial_list'],
})
class TestimonialList extends Component {
  _renderTestimonialList() {
    const {testimonial_list} = this.props;
    let TestimonialItemComponents = testimonial_list.map((testimonial) => {
      return (
        <TestimonialItem
          testimonial={testimonial}
          key={testimonial.session_id}
        />
      )
    });

    return(
      <div className='testimonial-list-wrapper'>
        <ul className='testimonial-list'>
          {TestimonialItemComponents}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialList()
    );
  }
}

export { TestimonialList };
