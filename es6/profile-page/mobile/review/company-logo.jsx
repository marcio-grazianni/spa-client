import React, {Component} from 'react'
import {Textfit} from 'react-textfit'
import {branch} from 'baobab-react/higher-order'

@branch({
  account_name: ['account_name'],
  account_url: ['account_url'],
  account_logo: ['account_logo'],
  location: ['location'],
})
class CompanyLogo extends Component {
  _renderCompanyLogo() {
    const {account_name, account_url, account_logo} = this.props;
    let location;
    if (this.props.location) {
      location = this.props.location;
    } else {
      location = "United States";
    }

    let url = "";
    if (account_url) {
      url = account_url.replace(/^https?:\/\//,'').replace(/\/$/, "");
    }
    return(
      <div className='company-logo-wrapper'>
        {
          (account_logo !== Django.media_url) &&

          <div className='logo-wrapper'>
            <div className='logo'>
              <img className="logo" src={account_logo} />
            </div>
          </div>
        }
        {
          (account_logo === Django.media_url) &&
          <h3>{account_name}</h3>
        }
        <div className='info'>
          <Textfit
              max={12}
              mode="single"
            >
            <span className='location'>
              <i className='fa fa-map-marker'></i> {location}
            </span> / <span className='url'>{url}</span>
          </Textfit>
        </div>
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
