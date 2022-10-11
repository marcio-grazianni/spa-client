import React, {Component} from 'react'
import {CompanyLogo} from './company-logo'
import {TestimonialStats} from './testimonial-stats'
import {CompanyHeader} from './company-header'
import {TestimonialList} from './testimonial-list'

class TestimonialInfo extends Component {
  _renderTestimonialInfo() {
    return(
      <div className='validation-info'>
        <div className='container'>
          <div className='left'>
            <CompanyLogo />
            <TestimonialStats />
          </div>
          <div className='right'>
            <CompanyHeader />
            <TestimonialList />
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialInfo()
    );
  }
}

export { TestimonialInfo };
