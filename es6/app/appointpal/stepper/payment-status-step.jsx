import React, {Component} from 'react'
import numeral from 'numeral'
import {branch} from 'baobab-react/higher-order'
import {paymentMethodSelected} from './actions'
import classnames from 'classnames'

const StoredCardStatusInfo = {
  success: {
    label: 'Payment Completed',
    message: 'A receipt will be sent via email and text.'
  },
  error: {
    label: 'Payment Failed',
    message: 'Please update card information.'
  }
}

const PaymentPlanStatusInfo = {
  success: {
    label: 'Payment Plan Created',
    message: 'Card on file will be charged monthly.'
  },
  error: {
    label: 'Payment Plan Failed',
    message: 'Please update card information.'
  }
}

const SubscriptionStatusInfo = {
  success: {
    label: 'Subscription Created',
    message: 'Card on file will be charged monthly.'
  },
  error: {
    label: 'Subscription Failed',
    message: 'Please update card information.'
  }
}

const SendInvoiceStatusInfo = {
  success: {
    label: 'Invoice Sent',
    message: 'An invoice will be sent via email and SMS.'
  },
  error: {
    label: 'Send Invoice Failed',
    message: 'Please select a different payment method.'
  }
}

const SwipeInsertStatusInfo = {
  success: {
    label: 'Payment Activated',
    message: 'Please complete payment on device.'
  },
  error: {
    label: 'Card Reader Unavailable',
    message: 'Please select a different payment method.'
  }
}

@branch({
  invoice: ['appointpal', 'invoice']
})
class PaymentStatus extends Component {
  _printReceipt() {
    const {paid_transaction} = this.props.invoice;
    const receipt_url = '/api/transactions/' + paid_transaction + '/print-receipt/';
    window.open(receipt_url);
  }
  _renderPaymentStatus() {
    const {success, amount, statusLabel, statusMessage} = this.props;
    const {paid_transaction} = this.props.invoice;
    const dollar_amount = numeral(amount).format('$0,0.00');
    let statusImage = success ? 'green-check' : 'red-x';
    let labelClassname = classnames('payment-status-label', success ? 'payment-status-success' : 'payment-status-error');
    return (
      <div className='payment-status-step'>
        <div className='payment-status-indicator'>
          <img src={Django.static(`images/appointpal/${statusImage}.png`)} height="360"/>
        </div>
        <div className={labelClassname}>
          {statusLabel}
          {
            success && paid_transaction &&
            <span className='printReceipt'><i className='fa fa-print' onClick={::this._printReceipt} /></span>
          }
        </div>
        <div className='payment-status-amount'>
          {dollar_amount}
        </div>
        <div className='payment-status-message'>
          {statusMessage}
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderPaymentStatus();
  }
}

@branch({
})
class PaymentPendingStatus extends Component {
  _renderPaymentStatus() {
    const {success, amount, statusLabel, statusMessage} = this.props;
    const dollar_amount = numeral(amount).format('$0,0.00');
    let statusImage = success ? 'pink-check' : 'red-x';
    let labelClassname = classnames('payment-status-label', success ? 'payment-status-pending' : 'payment-status-error');
    return (
      <div className='payment-status-step'>
        <div className='payment-status-indicator'>
          <img src={Django.static(`images/appointpal/${statusImage}.png`)} height="360"/>
        </div>
        <div className={labelClassname}>
          {statusLabel}
        </div>
        <div className='payment-status-amount'>
          {dollar_amount}
        </div>
        <div className='payment-status-message'>
          {statusMessage}
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderPaymentStatus();
  }
}

@branch({
  stepper: ['appointpal', 'invoice_stepper'],
  builder: ['appointpal', 'invoice_builder'],
  invoice: ['appointpal', 'invoice']
})
class PaymentStatusStep extends Component {
  _renderPaymentStatusStep() {
    const {payment_method, sent_to_terminal} = this.props.stepper;
    const {total_amount} = this.props.builder;
    const {status, payment_term} = this.props.invoice;
    const success = sent_to_terminal || (status > 2 && status < 8);
    let pending = false;
    let statusInfo = StoredCardStatusInfo;
    if ('swipe-insert-card' == payment_method) {
      statusInfo = SwipeInsertStatusInfo;
      pending = true;
    } else if('send-invoice' === payment_method) {
      statusInfo = SendInvoiceStatusInfo;
    } else if(6 === status) {
      if('sub' === payment_term) {
        statusInfo = SubscriptionStatusInfo;
      } else {
        statusInfo = PaymentPlanStatusInfo;
      }
    }
    const statusLabel = success ? statusInfo.success.label : statusInfo.error.label;
    let statusMessage = success ? statusInfo.success.message : statusInfo.error.message;
    let statusComponent = null;
    if(pending) {
      statusComponent = <PaymentPendingStatus
        success={success}
        amount={total_amount}
        statusLabel={statusLabel}
        statusMessage={statusMessage}
      >
      </PaymentPendingStatus>;
    } else {
      statusComponent = <PaymentStatus
        success={success}
        amount={total_amount}
        statusLabel={statusLabel}
        statusMessage={statusMessage}
      >
      </PaymentStatus>;
    }
    return(statusComponent);
  }
  render() {
    return ::this._renderPaymentStatusStep();
  }
}

export { PaymentStatusStep };