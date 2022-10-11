import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
  testimonial: ['testimonials', 'current_testimonial']
})
class ContentBody extends Component {
  _renderContentBody() {
    const {comments} = this.props.testimonial;
    return (
      <div className='content-body'>
        <p>{comments}</p>
      </div>
    );
  }
  render() {
    return (
      ::this._renderContentBody()
    );
  }
}

export { ContentBody };