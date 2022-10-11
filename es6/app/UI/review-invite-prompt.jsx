import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Link} from 'react-router-component'
import sourceConfig from '../config/review-sources'
import {Alert} from './alert'
import {changeReviewInviteLocation, changeReviewInviteValue, submitReviewInvite, changeAcceleratorInvitesValue, submitAcceleratorInvites, changeTopMenuSection, reviewInviteLock, toggleMiniAccelerator} from '../actions'

@branch({
  account_id: ['account', 'account_id'],
  vertical: ['account', 'vertical'],
  contact: ['review_invite', 'contact'],
  first_name: ['review_invite', 'first_name'],
  selected_location: ['account', 'selected_account_id'],
  selected_location_dropdown: ['review_invite', 'selected_account_id'],
  invites_remaining: ['account', 'invites_remaining'],
  email_invites_remaining: ['account', 'email_invites_remaining'],
  sms_invites_remaining: ['account', 'sms_invites_remaining'],
  generators: ['generators'],
  current_sources: ['settings', 'review_sites', 'current_sources'],
  alert: ['alpha_alert'],
  locations_list: ['account', 'related_accounts'],
  onboarding_review_invite_lock: ['account', 'onboarding_review_invite_lock'],
  mini_accelerator: ['mini_accelerator'],
  accelerator_contacts: ['accelerator_invites', 'contacts']
})
class ReviewInvitePrompt extends Component {
  _toggleMiniAccelerator(e) {
    this.props.dispatch(toggleMiniAccelerator);
  }
  _changeSelectedLocation(e) {
    this.props.dispatch(
      changeReviewInviteLocation,
      e.currentTarget.value,
    )
  }
  _changeReviewInviteValue(e) {
    this.props.dispatch(
      changeReviewInviteValue,
      e.currentTarget.name,
      e.currentTarget.value
    )
  }
  _submitReviewInvite(e) {
    e.preventDefault();
    if (this.props.onboarding_review_invite_lock) {
      this.props.dispatch(
        reviewInviteLock,
      );
    } else {
      this.props.dispatch(
        submitReviewInvite,
      );
    }
  }
  _changeAcceleratorInvitesValue(e) {
    this.props.dispatch(
      changeAcceleratorInvitesValue,
      e.currentTarget.name,
      e.currentTarget.value
    )
  }
  _submitAcceleratorInvites(e) {
    e.preventDefault();
    if (this.props.onboarding_review_invite_lock) {
      this.props.dispatch(
        reviewInviteLock,
      );
    } else {
      this.props.dispatch(
        submitAcceleratorInvites,
      );
    }
  }
  _openReviewSites() {
    this.props.dispatch(changeTopMenuSection,
      'settings',
      'review_sites'
    )
  }
  _renderReviewInvitePrompt() {
    const {account_id, vertical, contact, first_name, selected_location, selected_location_dropdown, invites_remaining, email_invites_remaining, sms_invites_remaining, generators, current_sources, alert, locations_list, mini_accelerator, accelerator_contacts} = this.props;
    let SiteComponents = [];
    let invites_remaining_str;
    if (generators.length > 0) {
      if (invites_remaining) {
        invites_remaining_str = `${invites_remaining} invites:`;
      } else {
        invites_remaining_str = null;
      }
      SiteComponents = current_sources.map((obj) => {
        const config_info = sourceConfig[obj.slug.replace(/-/g, "")];

        const {icon, color} = config_info;
        if (obj.url !== "" && obj.active) {
          return (
            <span
              key={obj.slug}
              className={`icon ${obj.slug}`}
              style={{background: color}}
            >
              {icon}
            </span>
          );
        }
        else {
          return false;
        }
      });
      SiteComponents = SiteComponents.slice(0,4);
      const sv_config = sourceConfig['subscribervoice'];
      let SVComponent =
        <Link key="subscribervoice" href='/settings/'>
          <span
            data-tip
            data-for="review-generators"
            data-place="top"
            data-effect="solid"
            className='icon subscribervoice'
            style={{background: sv_config.color}}
          >
            {sv_config.icon}
          </span>
        </Link>
      SiteComponents.push(SVComponent);
    } else {
      if (invites_remaining) {
        invites_remaining_str = `${invites_remaining} invites remaining`;
      } else {
        invites_remaining_str = null;
      }
    }
    let LocationOptions = [];
    if (locations_list.length > 0) {
      LocationOptions = locations_list.map((location) => {
        if (location.id === account_id) { // if main top level account - dont show option.
          return null;
        }
        return (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        );
      })
    }

    let invitesDisabled = '';
    if(email_invites_remaining <= 0 && sms_invites_remaining <= 0) {
      invitesDisabled = 'disabled';
    }
    return (
      <div className="invite-wrapper">
      {
        (alert) &&
        <div className='alert-wrapper'>
          <Alert alert={alert} alpha={true} />
        </div>
      }
        <form onSubmit={mini_accelerator && ::this._submitAcceleratorInvites || ::this._submitReviewInvite}>
          {
            (!mini_accelerator) &&
            <div className="invite-wrapper-upper">
              <div className='logo'>
                <img src={Django.static('images/SV_EnvelopeNew3.svg')} />
              </div>
              <p className='prompt'>
                Enter a mobile number or email address to send a review invite.
              </p>
              <div className='input-wrapper'>
                <input
                  type='text'
                  name='contact'
                  placeholder='Mobile or Email'
                  value={contact.value}
                  disabled={invitesDisabled}
                  onChange={::this._changeReviewInviteValue}
                />
                {
                  contact.error &&
                  <div className='errorHolder'>
                    <span className='error'>{contact.error}</span>
                  </div>
                }
              </div>
            </div>
          }
          {
            mini_accelerator &&
            <div className='invite-wrapper-upper mini-accelerator'>
              <p className='prompt'>
                Add some people below
              </p>
              <p className='sub-prompt'>
                Enter valid email address or phone number, 1 per line (up to 50).
              </p>
              <div className='input-wrapper'>
                <textarea
                  name='contacts'
                  placeholder='Mobile or Email (one per line)'
                  value={accelerator_contacts.value}
                  disabled={invitesDisabled}
                  onChange={::this._changeAcceleratorInvitesValue}
                />
              {
                accelerator_contacts.error &&
                <div className='errorHolder'>
                  <span className='error'>{accelerator_contacts.error}</span>
                </div>
              }
              </div>
            </div>
          }
          <button type='submit' disabled={invitesDisabled} className='btn btn-confirm'>
            Send Invite{mini_accelerator && 's'}
          </button>
        </form>
        <div className='invites-left'>
          <span className='invites-left'>
            <span><i className="fa fa-envelope-open fa-med"></i> {email_invites_remaining} </span>
            <span><i className="fa fa-mobile fa-lg"></i> {sms_invites_remaining} </span>
          </span>
        </div>
        {
          (!mini_accelerator) &&
          <div className='invites-right' onClick={::this._toggleMiniAccelerator}>
            <i className="fa fa-user-plus fa-lg"></i>
          </div>
        }
        {
          mini_accelerator &&
          <div className='invites-right' onClick={::this._toggleMiniAccelerator}>
            <i className="fa fa-long-arrow-left"></i> Back
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewInvitePrompt()
    );
  }
}

export { ReviewInvitePrompt };