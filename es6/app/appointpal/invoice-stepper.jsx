import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Alert} from '../UI/alert'
import {Confirmation, ConfirmationButtons} from './common/confirmation'
import {BuildInvoiceStep} from './stepper/build-invoice-step'
import {PaymentMethodStep} from './stepper/payment-method-step'
import {PaymentStatusStep} from './stepper/payment-status-step'
import {previousStep, closeInvoiceStepper, confirmationDismiss} from './actions'
import {saveAsDraft} from './stepper/actions'
import classnames from 'classnames'

@branch({
  alert: ['alpha_alert']
})
class InvoiceStepperHeader extends Component {
  _renderInvoiceStepperHeader() {
    const {alert} = this.props;
    return (
      <div className='invoice-stepper-header'>
        <div className="row">
          <div className="col-sm-2">
            <h2>
              <i className="fa fa-dollar"></i>
              Payment
            </h2>
          </div>
          <div className="col-sm-10">
          {
            (alert) &&
            <div className='alert-wrapper'>
             <Alert alert={alert} alpha={true} />
            </div>
          }
          </div>
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderInvoiceStepperHeader();
  }
}

@branch({
  account_id: ['account', 'account_id'],
  step: ['appointpal', 'invoice_stepper', 'step'],
  invoice: ['appointpal', 'invoice'],
  confirmation: ['appointpal', 'confirmation'],
})
class InvoiceStepper extends Component {
  _goBack() {
    this.props.dispatch(
       previousStep
    )
  }
  _confirmationDismiss() {
    this.props.dispatch (
      confirmationDismiss
    )
  }
  _cancelAndClose() {
    let cancel = true;
    this.props.dispatch(
      closeInvoiceStepper,
      cancel
    )
  }
  _saveBeforeClosing() {
    this.props.dispatch(
      saveAsDraft,
      closeInvoiceStepper
    );
  }
  _renderInvoiceStepper() {
    const {account_id, step, invoice, confirmation} = this.props;
    let status = 0;
    if(invoice) {
      status = invoice.status
    }
    const noBack = (3 == status) || (4 == status) || (5 == status);
    let innerClassName = classnames('invoice-stepper-inner', step == 1 || step == 3 && noBack ? 'full' : 'partial');
    let ConfirmationInfo = {
      icon: 'fa-save',
      title: 'Save Before Closing?',
      confirm_text: 'Do you want to save your invoice as a draft?',
      default_button_label: 'Close',
      default_button_handler: ::this._cancelAndClose,
      other_button_label: 'Save',
      other_button_handler: ::this._saveBeforeClosing,
    }
    return (
      <div className="invoice-stepper-wrapper">
      {
        confirmation &&
        <Confirmation
          icon={ConfirmationInfo.icon}
          title={ConfirmationInfo.title}
          confirm_text={ConfirmationInfo.confirm_text}
        >
          <ConfirmationButtons>
            <button
              type='button'
              className='btn btn-default'
              onClick={ConfirmationInfo.default_button_handler}
            >
              {ConfirmationInfo.default_button_label}
            </button>
            {
              ConfirmationInfo.other_button_label &&
              <button
                type='button'
                className='btn btn-confirm'
                onClick={ConfirmationInfo.other_button_handler}
              >
                {ConfirmationInfo.other_button_label}
              </button>
            }
          </ConfirmationButtons>
        </Confirmation>
      }
        <div className="invoice-stepper-content">
          <InvoiceStepperHeader />
          <div className={innerClassName}>
          {
            (1 === step) &&
            <BuildInvoiceStep />
          }
          {
            (2 == step) &&
            <PaymentMethodStep />
          }
          {
            (3 == step) &&
            <PaymentStatusStep />
          }
          </div>
          {
            (2 == step || 3 == step && !noBack) &&
            <div className="invoice-stepper-controls">
              <div className="right-controls" onClick={::this._goBack}>
                Back
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceStepper()
    );
  }
}

export { InvoiceStepper };