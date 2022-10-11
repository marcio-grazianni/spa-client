import React, {Component} from 'react'
import {ContentHeader} from './content-header'
import {ContentBody} from './content-body'
import {ContentFooter} from './content-footer'

class TestimonialContent extends Component {
  _renderTestimonialContent() {
    return (
      <div className='content-wrapper'>
        <div className='content'>
          <ContentHeader />
          <ContentBody />
          <ContentFooter />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialContent()
    );
  }
}

export { TestimonialContent };