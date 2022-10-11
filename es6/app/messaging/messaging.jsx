import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {FixedHeightAppContainer} from '../app-container-fixed'
import {UpgradeOverlay, MessagingUpgradeOverlay} from '../UI/upgrade-overlay'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {MessagesHeader} from './messages-header'
import {SelectMessageThread} from './select-message-thread'
import {MessageThreadDisplay} from './message-thread-display'
import {AppointpalTools} from '../appointpal/tools/appointpal-tools'
import {initialLoad, reply, closeConfirmationDialog, deleteInvoice, confirmSendFromPrimary} from './actions'
import {deleteClient} from '../appointpal/clients/actions'


@branch({
  confirmation: ['confirmation'],
  messages_lock: ['messages', 'messages_lock'],
  review_invite_lock: ['review_invite_lock'],
  paid_account: ['account', 'paid_account'],
  vertical: ['account', 'vertical'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_account_id: ['account', 'selected_account_id']
})
class Messaging extends Component {
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
      case 'quota':
        confirmation_function = closeConfirmationDialog;
        break;
      case 'deleteClient':
        confirmation_function = deleteClient;
        break;
      case 'deleteInvoice':
        confirmation_function = deleteInvoice;
        break;
      case 'sendFromPrimary':
        confirmation_function = confirmSendFromPrimary;
        break;
    }
    this.props.dispatch(
      confirmation_function
    )
  }
  render() {
    const {confirmation, messages_lock, review_invite_lock, paid_account, vertical, onboarding_complete} = this.props;
    const ConfirmationInfo = {
      quota: {
        icon: 'fa-flag',
        title: 'Message quota limit reached',
        confirm_text: 'The patient message quota limit has been temporarily reached. Please <a href="mailto:contact@appointpal.com?subject=Optimize%match%connections" target="_blank">contact us</a> to learn about optimizing match connections.',
        button_text: 'Okay'
      },
      deleteClient: {
        icon: 'fa-trash',
        title: 'Delete Patient',
        confirm_text: 'Are you sure you want to delete this patient record?',
        button_text: 'Delete'
      },
      deleteInvoice: {
        icon: 'fa-trash',
        title: 'Delete Invoice',
        confirm_text: 'Are you sure you want to delete this invoice?',
        button_text: 'Delete'
      },
      sendFromPrimary: {
        icon: 'fa-user',
        title: "Can't Message Dependent",
        confirm_text: 'Contact is a dependent.  Switch to primary contact?',
        button_text: 'Switch'
      }
    }
    return (
      <FixedHeightAppContainer section="messaging">
        <div id="messagingApp" className="newApp">
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
          {
            onboarding_complete && (!paid_account) &&
            <UpgradeOverlay
              page_name="Messaging"
            />
          }
          {
            (messages_lock || review_invite_lock) &&
            <MessagingUpgradeOverlay
              prompt="You need to upgrade your AppointPal plan in order to access this feature."
            />
          }
          <div className='messaging-wrapper main-wrapper'>
            <MessagesHeader />
            <div className='messaging-content-wrapper'>
              <SelectMessageThread />
              <MessageThreadDisplay />
              <AppointpalTools />
            </div>
          </div>
        </div>
      </FixedHeightAppContainer>
    );
  }
}

export { Messaging };