import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Textfit} from 'react-textfit'
import moment from 'moment'

@branch({
  account_name: ['account_name'],
  parent_name: ['parent_name'],
  active_date: ['active_date'],
  location: ['location'],
  review_ct: ['review_ct'],
  testimonial_ct: ['testimonial_count'],
})
class CompanyHeader extends Component {
  _renderCompanyHeader() {
    const {account_name, parent_name, active_date, location, review_ct, testimonial_ct} = this.props;
    return(
      <div className='company-header-wrapper'>
        <div className='company-info'>
          <div className='company-name'>
            <h1>
              <Textfit mode="single" max={32}>
                {account_name}
              </Textfit>
            </h1>
          </div>
          <div className='location-info'>
            {parent_name} in {location}
          </div>
        </div>
        <div className='review-info'>
          <div className='testimonials'>
            <i className='fa fa-comments'></i>
            <span className='testimonial_ct'>{testimonial_ct} reviews</span>
          </div>
          <div className='active-date'>
            <i className='fa fa-clock-o'></i>
            <span className='active_date'>Joined {moment(active_date).format("MMM d, YYYY")}</span>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderCompanyHeader()
    );
  }
}

export { CompanyHeader };
