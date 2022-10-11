import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {DesktopHeader} from './header/header'
import {LeftNav} from './left-nav/left-nav'
import {UpgradePrompt} from './UI/upgrade-prompt'
import {ContactPrompt} from './UI/contact-prompt'
import {LocationPrompt} from './UI/location-prompt'
import {ReviewInvitePrompt} from './UI/review-invite-prompt'
import {ManageClientPrompt} from './appointpal/manage-client-prompt'
import {UploadClientsPrompt} from './appointpal/upload-clients-prompt'
import {UpdateCreditCardPrompt} from './appointpal/update-credit-card-prompt'
import {ActivatePaymentsPrompt} from './appointpal/activate-payments-prompt'
import {ActivateIntakePrompt} from './appointpal/activate-intake-prompt'
import {InvoiceStepper} from './appointpal/invoice-stepper'
import {InvoiceEditor} from './appointpal/invoice-editor'
import {Onboarding} from './onboarding/onboarding'
import {Payment} from './payment/payment'
import {closeBulkAddRemove, confirmationToggle, closeUpgradePrompt, closePaymentPrompt, closeContactPrompt, closeLocationPrompt, closeReviewInvitePrompt, reviewInviteLock} from './actions'
import {closeActivatePaymentsPrompt, closeActivateIntakePrompt, closeInvoiceStepperConfirm, closeInvoiceEditor} from './appointpal/actions'
import {closeManageClientPrompt, closeUploadClientsPrompt} from './appointpal/clients/actions'
import {closeUpdateCreditCardPrompt} from './appointpal/credit_card/actions'

@branch({
  confirmation: ['confirmation'],
  upgrade_prompt: ['upgrade_prompt'],
  payment_prompt: ['payment_prompt'],
  contact_prompt: ['contact_prompt'],
  location_prompt: ['location_prompt'],
  review_invite_prompt: ['review_invite_prompt'],
  manage_client_prompt: ['appointpal', 'manage_client_prompt'],
  upload_clients_prompt: ['appointpal', 'upload_clients_prompt'],
  activate_payments_prompt: ['appointpal', 'activate_payments_prompt'],
  activate_intake_prompt: ['appointpal', 'activate_intake_prompt'],
  update_credit_card_prompt: ['appointpal', 'update_credit_card_prompt'],
  invoice_step: ['appointpal', 'invoice_stepper', 'step'],
  invoice_editor: ['appointpal', 'invoice_editor', 'visible'],
  onboarding_complete: ['account', 'onboarding_complete'],
  onboarding_step: ['onboarding', 'onboarding_step'],
  onboarding_review_invite_lock: ['account', 'onboarding_review_invite_lock'],
  tutorial_active: ['account', 'tutorial_active'],
  loading: ['loading'],
  navigating: ['navigating'],
  settings_lock: ['account', 'settings_lock'],
  bulk_add: ['settings', 'subscribers', 'bulk_add'],
  bulk_remove: ['settings', 'subscribers', 'bulk_remove'],
  vertical: ['account', 'vertical'],
})
class AppContainer extends Component {
  _closeBulkAddRemove() {
    this.props.dispatch(closeBulkAddRemove)
  }
  _closeConfirmation() {
    this.props.dispatch(
      confirmationToggle,
      false
    );
  }
  _closeUpgradePrompt() {
    this.props.dispatch(closeUpgradePrompt)
  }
  _closePaymentPrompt() {
    this.props.dispatch(closePaymentPrompt)
  }
  _closeContactPrompt() {
    this.props.dispatch(closeContactPrompt)
  }
  _closeLocationPrompt() {
    this.props.dispatch(closeLocationPrompt)
  }
  _closeReviewInvitePrompt() {
    if (this.props.onboarding_review_invite_lock) {
      this.props.dispatch(
        reviewInviteLock,
      );
    } else {
      this.props.dispatch(closeReviewInvitePrompt);
    }
  }
  _closeManageClientPrompt() {
    this.props.dispatch(closeManageClientPrompt);
  }
  _closeUploadClientsPrompt() {
    this.props.dispatch(closeUploadClientsPrompt);
  }
  _closeUpdateCreditCardPrompt() {
    this.props.dispatch(closeUpdateCreditCardPrompt);
  }
  _closeActivatePaymentsPrompt() {
    //this.props.dispatch(closeActivatePaymentsPrompt);
    return;
  }
  _closeActivateIntakePrompt() {
    this.props.dispatch(closeActivateIntakePrompt);
  }
  _closeInvoiceStepper() {
    this.props.dispatch(closeInvoiceStepperConfirm);
  }
  _closeInvoiceEditor() {
    this.props.dispatch(closeInvoiceEditor);
  }
  _renderAppContainer() {
    const {section, confirmation, upgrade_prompt, payment_prompt, contact_prompt, location_prompt, review_invite_prompt, manage_client_prompt, upload_clients_prompt, update_credit_card_prompt, activate_payments_prompt, activate_intake_prompt, invoice_step, invoice_editor, onboarding_complete, onboarding_step, tutorial_active, settings_lock, loading, navigating, bulk_add, bulk_remove, vertical} = this.props;
    return (
      <div>
        <DesktopHeader />
        <LeftNav section={section} />
        <div className='content-wrapper newWrapper'>
          <div id='rightContent'>
            {
              (!navigating) &&
              <div className='rightChildContainer'>
                {this.props.children}
              </div>
            }
          </div>
        </div>
        {
          (bulk_add || bulk_remove) &&
          <div
            id="alphaOverlay"
            className="active"
            onClick={::this._closeBulkAddRemove}
          >
          </div>
        }
        { // if bulk_add/remove or confirmation show alpha screen (confirmation shown within app)
          (confirmation) &&
          <div
            id="alphaOverlay"
            className="active"
            onClick={::this._closeConfirmation}
          >
          </div>
        }
        { // if upgrade prompt show alpha screen and upgrade prompt
          upgrade_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeUpgradePrompt}
            >
            </div>
            <UpgradePrompt />
          </div>
        }
        { // if contact prompt show alpha screen and contact prompt
          contact_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeContactPrompt}
            >
            </div>
            <ContactPrompt />
          </div>
        }
        { // if location prompt show alpha screen and location prompt
          location_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeLocationPrompt}
            >
            </div>
            <LocationPrompt />
          </div>
        }
        { // if review invite prompt show alpha screen and upgrade prompt
          review_invite_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeReviewInvitePrompt}
            >
            </div>
            <ReviewInvitePrompt />
          </div>
        }
        {
          manage_client_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeManageClientPrompt}
            >
            </div>
            <ManageClientPrompt />
          </div>
        }
        {
          upload_clients_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeUploadClientsPrompt}
            >
            </div>
            <UploadClientsPrompt />
          </div>
        }
        {
          update_credit_card_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeUpdateCreditCardPrompt}
            >
            </div>
            <UpdateCreditCardPrompt />
          </div>
        }
        {
          activate_payments_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeActivatePaymentsPrompt}
            >
            </div>
            <ActivatePaymentsPrompt />
          </div>
        }
        {
          activate_intake_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeActivateIntakePrompt}
            >
            </div>
            <ActivateIntakePrompt />
          </div>
        }
        {
          invoice_step &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeInvoiceStepper}
            >
            </div>
            <InvoiceStepper />
          </div>
        }
        {
          invoice_editor &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closeInvoiceEditor}
            >
            </div>
            <InvoiceEditor />
          </div>
        }
        { // payment prompt
          payment_prompt &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
              onClick={::this._closePaymentPrompt}
            >
            </div>
            <Payment />
          </div>
        }
        { // if onboarding not yet complete show onboarding
          // unless tutorial is active
          // if settings lock is on then we dont show
          // means they are in the settings backdoor
          (!onboarding_complete && !settings_lock && !tutorial_active && onboarding_step !== 4) &&
          <div>
            <div
              id="alphaOverlay"
              className="active"
            >
            </div>
            <Onboarding />
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppContainer()
    );
  }
}

export { AppContainer };