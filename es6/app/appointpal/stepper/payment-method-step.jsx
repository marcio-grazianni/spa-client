import React, {Component} from 'react'
import numeral from 'numeral'
import {branch} from 'baobab-react/higher-order'
import {paymentMethodSelected} from './actions'
import classnames from 'classnames'

@branch({
  selected: ['appointpal', 'invoice_stepper', 'method_selected'],
})
class PaymentMethodSelector extends Component {
  _methodSelected(e) {
    const {disabled, selected} = this.props;
    if(disabled || selected) {
      return false;
    }
    this.props.dispatch(
      paymentMethodSelected,
      this.props.method
    );
  }
  _renderPaymentMethodSelector() {
    const {method, disabled, selected} = this.props;
    let selectorClassname = classnames('payment-method-selector', {'method-selected': selected}, {'method-disabled': disabled});
    return (
      <div className={selectorClassname} onClick={::this._methodSelected}>
        <div className="payment-method-icon">
          <img src={Django.static(`images/appointpal/${method}.png`)} />
         </div>
         <div className="payment-method-label">
           {this.props.children}
         </div>
       </div>
    );
  }
  render() {
    return ::this._renderPaymentMethodSelector();
  }
}

@branch({
  invoice: ['appointpal', 'invoice_builder']
})
class PaymentMethodStep extends Component {
  _renderPaymentMethodStep() {
    const {total_amount, recipient, payment_term} = this.props.invoice;
    const recurring = 'full' !== payment_term;
    const cardOnFile = recipient && recipient.card_number;
    const disableStoredCard = !cardOnFile;
    const disableSwipeCard = recurring;
    const disableSendInvoice = recurring || !recipient;
    const dollar_amount = numeral(total_amount).format('$0,0.00');
    return(
      <div className="payment-method-step">
        <div className="row cta-row">
          <div className="col-sm-12">
            Select payment method
          </div>
        </div>
        <div className="row invoice-total-row">
          <div className="col-sm-12">
            {dollar_amount}
          </div>
        </div>
        <div className="row payment-method-row">
          <div className="col-sm-4">
            <PaymentMethodSelector method='use-stored-card' disabled={disableStoredCard}>
              Charge Card
              <br/>
              on File
            </PaymentMethodSelector>
          </div>
          <div className="col-sm-4">
            <PaymentMethodSelector method='swipe-insert-card' disabled={disableSwipeCard}>
              Swipe or
              <br />
              Insert Card
            </PaymentMethodSelector>
          </div>
          <div className="col-sm-4">
            <PaymentMethodSelector method='send-invoice' disabled={disableSendInvoice}>
              Send Invoice via
              <br />
              Email and SMS
            </PaymentMethodSelector>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderPaymentMethodStep()
  }
}

export { PaymentMethodStep };