import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {ActivityHeader} from './activity-header'
import {PaymentActivity} from './payments'
import {InvoiceActivity} from './invoices'
import {ReviewActivity} from './reviews'
import {ContactActivity} from './contacts'
import {PaymentPlanActivity} from './plans'
import {SubscriptionActivity} from './subscriptions'
import {AppointmentActivity} from './appointments'
import {AppointmentRequestActivity} from './appointment_requests'
import {cancelInvoice, deleteInvoice, refundPayment, resendInvoice, resendReceipt, cancelPlan, cancelAppointment} from './actions'


@branch({
})
class ContactCell extends Component {
  _goToPatient() {
    const {contact_id} = this.props;
    window.location.href = '/patients/?pid=' + contact_id;
  }
  _renderContactCell() {
    const {contact_name} = this.props;
    return(
      <div onClick={::this._goToPatient}>
        {contact_name}
      </div>
    );
  }
  render() {
    return (
      ::this._renderContactCell()
    );
  }
}

@branch({
  confirmation: ['confirmation'],
  selected: ['activity', 'selected_top_menu'],
})
class Activity extends Component {
  _confirm() {
    const {confirmation} = this.props;
    let confirmation_function = null;
    switch (confirmation) { //different functions based current confirmation shown
      case 'cancel':
        confirmation_function = cancelInvoice;
        break;
      case 'delete':
        confirmation_function = deleteInvoice;
        break;
      case 'refund':
        confirmation_function = refundPayment;
        break;
      case 'resend':
        confirmation_function = resendInvoice;
        break;
      case 'resendReceipt':
        confirmation_function = resendReceipt;
        break;
      case 'cancelPlan':
        confirmation_function = cancelPlan;
        break;
      case 'cancelAppointment':
        confirmation_function = cancelAppointment;
        break;
    }
    this.props.dispatch(
      confirmation_function
    )
  }
  render() {
    const {confirmation, selected} = this.props;
    let InnerSection;
    const ConfirmationInfo = {
      cancel: {
        icon: 'fa-trash',
        title: 'Cancel Invoice',
        confirm_text: 'Are you sure you want to cancel this sent invoice?',
        button_text: 'Cancel'
      },
      delete: {
        icon: 'fa-trash',
        title: 'Delete Invoice',
        confirm_text: 'Are you sure you want to delete this saved invoice?',
        button_text: 'Delete'
      },
      refund: {
        icon: 'fa-money',
        title: 'Refund Payment',
        confirm_text: 'Are you sure you want to refund this payment?',
        button_text: 'Refund'
      },
      resend: {
        icon: 'fa-send',
        title: 'Resend Invoice',
        confirm_text: 'Are you sure you want to send this invoice again?',
        button_text: 'Resend'
      },
      resendReceipt: {
        icon: 'fa-send',
        title: 'Resend Receipt',
        confirm_text: 'Are you sure you want to send another receipt for this transaction?',
        button_text: 'Resend'
      },
      cancelPlan: {
        icon: 'fa-ban',
        title: 'Cancel Payment Plan',
        confirm_text: 'Are you sure you want to cancel this payment plan?',
        button_text: 'Cancel'
      },
      cancelAppointment: {
        icon: 'fa-ban',
        title: 'Cancel Appointment',
        confirm_text: 'Are you sure you want to cancel this appointment?',
        button_text: 'Cancel'
      }
    }
    switch (selected) {
      case 'payments': {
        InnerSection = <PaymentActivity />
        break;
      }
      case 'invoices': {
        InnerSection = <InvoiceActivity />
        break;
      }
      case 'review_invites': {
        InnerSection = <ReviewActivity />
        break;
      }
      case 'contacts': {
        InnerSection = <ContactActivity />
        break;
      }
      case 'plans': {
        InnerSection = <PaymentPlanActivity />
        break;
      }
      case 'subscriptions': {
        InnerSection = <SubscriptionActivity />
        break;
      }
      case 'appointments': {
        InnerSection = <AppointmentActivity />
        break;
      }
      case 'appointment_requests': {
        InnerSection = <AppointmentRequestActivity />
        break;
      }
    }
    return (
      <AppContainer section="activity">
        <div className="activityPage">
          <div id="activityApp" className="newApp">
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
            <div className='activity-wrapper main-wrapper activityBody'>
              <ActivityHeader />
              {InnerSection}
            </div>
          </div>
        </div>
      </AppContainer>
    );
  }
}

export { Activity, ContactCell };