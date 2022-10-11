import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {SettingsHeader} from './settings-header'
import {CompanyInfo} from './company-info'
import {UserInfo} from './user-info'
import {Password} from './password'
import {Notifications} from './notifications'
import {Subscribers} from './subscribers'
import {BulkAddRemove} from './bulk-add-remove'
import {initialLoad, unsubscribeConfirm, addConfirm, removeConfirm} from './actions'

@branch({
  confirmation: ['confirmation'],
  selected: ['settings', 'selected_top_menu'],
  review_site_lock: ['settings', 'review_site_lock'],
  unsubscribe_ids: ['settings', 'subscribers', 'unsubscribe_ids'],
  bulk_add: ['settings', 'subscribers', 'bulk_add'],
  bulk_remove: ['settings', 'subscribers', 'bulk_remove'],
  subscriber_add_count: ['settings', 'subscribers', 'subscriber_add_count'],
  subscriber_remove_count: ['settings', 'subscribers', 'subscriber_remove_count'],
  review_invite_lock: ['review_invite_lock'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id']

})
class Settings extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id} = this.props;
    if(prevProps.selected_account_id != selected_account_id) {
      this.props.dispatch(initialLoad)
    }
  }
  _confirm() {
    const {confirmation} = this.props;
    let confirmation_function = null;
    switch (confirmation) { //different functions based current confirmation shown
      case 'unsubscribe':
        confirmation_function = unsubscribeConfirm;
        break;
      case 'add':
        confirmation_function = addConfirm;
        break;
      case 'remove':
        confirmation_function = removeConfirm;
        break;
    }
    this.props.dispatch(
      confirmation_function
    )
  }
  render() {
    const {confirmation, selected, review_site_lock, unsubscribe_ids, bulk_add, bulk_remove, subscriber_add_count, subscriber_remove_count, review_invite_lock, onboarding_complete} = this.props;
    let InnerSection;
    let unsubscribe_selected_str = 'subscriber';
    if (unsubscribe_ids.length > 1) {
      unsubscribe_selected_str = `${unsubscribe_ids.length} subscribers`;
    }
    let subscriber_add_count_str = 'this subscriber';
    let subscriber_remove_count_str = 'this subscriber';
    if (subscriber_add_count > 1) {
      subscriber_add_count_str = `these ${subscriber_add_count} subscribers`;
    }
    if (subscriber_remove_count > 1) {
      subscriber_remove_count_str = `these ${subscriber_remove_count} subscribers`;
    }
    const ConfirmationInfo = {
      unsubscribe: {
        icon: 'fa-user-times',
        title: 'Unsubscribe',
        confirm_text: `Are you sure you want to unsubscribe the ${unsubscribe_selected_str} you have selected?`,
        button_text: 'Unsubscribe'
      },
      add: {
        icon: 'fa-list',
        title: 'Add Subscribers',
        confirm_text: `Are you sure you want to add ${subscriber_add_count_str} to your Accelerator Campaign?`,
        button_text: 'Add Subscribers'
      },
      remove: {
        icon: 'fa-list',
        title: 'Remove Subscribers',
        confirm_text: `Are you sure you want to remove ${subscriber_remove_count_str} from your Accelerator Campaign?`,
        button_text: 'Remove Subscribers'
      }
    }
    switch (selected) {
      case 'company_info': {
        InnerSection = <CompanyInfo />
        break;
      }
      case 'user_info': {
        InnerSection = <UserInfo />
        break;
      }
      case 'password': {
        InnerSection = <Password />
        break;
      }
      case 'notifications': {
        InnerSection = <Notifications />
        break;
      }
      case 'subscribers': {
        InnerSection = <Subscribers />
        break;
      }
      case 'invites': {
        InnerSection = <ReviewInvites />
        break;
      }
    }
    return (
      <AppContainer section="settings">
        <div className="settingsPage">
          <div id="settingsApp" className="newApp">
            {
              bulk_add &&
              <div className='subscribers-alpha-wrapper'>
                <div className='subscribers-alpha bulk-add'>
                  <BulkAddRemove bulk_type='add' />
                </div>
              </div>
            }
            {
              bulk_remove &&
              <div className='subscribers-alpha-wrapper'>
                <div className='subscribers-alpha bulk-add'>
                  <BulkAddRemove bulk_type='remove' />
                </div>
              </div>
            }
            {
              confirmation &&
              <Confirmation
                icon={ConfirmationInfo[confirmation].icon}
                title={ConfirmationInfo[confirmation].title}
                confirm_text={ConfirmationInfo[confirmation].confirm_text}
              >
                <ConfirmationButtons>
                  <button
                    type='button'
                    className='btn btn-confirm'
                    onClick={::this._confirm}
                  >
                    {ConfirmationInfo[confirmation].button_text}
                  </button>
                </ConfirmationButtons>
              </Confirmation>
            }
            <div className='settings-wrapper main-wrapper settingsBody'>
              <SettingsHeader />
              {InnerSection}
            </div>
          </div>
        </div>
        {
          onboarding_complete && (review_site_lock || review_invite_lock) &&
          <UpgradeOverlay
            prompt="You need to upgrade your SubscriberVoice plan in order to gain access to review sources."
          />
        }
      </AppContainer>
    );
  }
}

export { Settings };