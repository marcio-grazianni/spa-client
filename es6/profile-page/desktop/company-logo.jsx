import React, {Component} from 'react'
import {Textfit} from 'react-textfit'
import {branch} from 'baobab-react/higher-order'
import {BookAppointmentButton} from './book-appointment-button.jsx'

@branch({
  account_url: ['account_url'],
  account_logo: ['account_logo'],
  location: ['location'],
  full_location: ['full_location'],
  media_url: ['media_url'],
  vertical: ['vertical']
})
class CompanyLogo extends Component {
  _renderCompanyLogo() {
    const {account_url, account_logo, media_url, vertical} = this.props;

    let location, full_location;
    if (this.props.location) {
      location = this.props.location;
      full_location = this.props.full_location
    } else {
      location = "United States";
      full_location = "United States";
    }

    let url = "";
    if (account_url) {
      url = account_url.replace(/^https?:\/\//,'').replace(/\/$/, "");
    }
    return(
      <div className='company-logo-wrapper'>
        {
          (account_logo !== media_url) &&
          <div>
            <div className='logo-wrapper'>
              <div className='logo'>
                <img className="logo" src={account_logo} />
              </div>
            </div>
            <div className='divider'>
            </div>
          </div>
        }
          <div className='info'>
            <Textfit
              max={12}
              mode="single"
            >
              <span className='url' itemProp='url'><i className='fa fa-globe'></i> <a href={account_url} target='_blank'>{url}</a></span>
            </Textfit>
          </div>
          {
            (vertical !== 'e-comm' && vertical !== 'hospitality' && vertical !== 'restaurant' && vertical !== 'retail') &&
            <div className='book-appointment-button-wrapper'>
              <BookAppointmentButton />
            </div>
          }
      </div>
    );
  }
  render() {
    return (
      ::this._renderCompanyLogo()
    );
  }
}

export { CompanyLogo };
