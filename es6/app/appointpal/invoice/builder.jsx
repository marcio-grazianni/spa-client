import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import NumberFormat from 'react-number-format'
import {handleLineItemDescriptionChange, handleLineItemQuantityChange, handleLineItemAmountChange, handleLineItemDiscountChange, addLineItem, removeLineItem, paymentTermChanged} from './actions'
import {saveAsDraft} from '../stepper/actions'
import {closeInvoiceStepper} from '../actions'

@branch({
  invoice: ['appointpal', 'invoice_builder'],
})
class PaymentTermSelector extends Component {
  _termChanged(e) {
    this.props.dispatch(
      paymentTermChanged,
      e.currentTarget.value
    );
  }
  _renderPaymentTermSelector() {
    const {disabled} = this.props;
    const {payment_term} = this.props.invoice;
    let term_language = "in full";
    switch (payment_term) {
      case 'six':
        term_language = "over 6 months";
        break;
      case 'twelve':
        term_language = "over 12 months";
        break;
      case 'eighteen':
        term_language = "over 18 months";
        break;
      case 'sub':
        term_language = "monthly until canceled";
        break;
    }
    return (
      <div className="payment-term-selector">
        <div className="select-payment-term">
          <span className="payment-term-label">Payment Type:</span>
          <span>Total amount will be collected</span>
          <span>{term_language}</span>
        </div>
        {
          !disabled &&
          <div className="controls payment-term-controls">
            <label>
              <input type="radio" name="paymentTerm" value="full"
               checked={payment_term == "full"}
               onChange={::this._termChanged} />
              In full
            </label>
            <label>
              <input type="radio" name="paymentTerm" value="six"
                checked={payment_term == "six"}
                 onChange={::this._termChanged} />
              6 months
            </label>
            <label>
              <input type="radio" name="paymentTerm" value="twelve"
               checked={payment_term == "twelve"}
               onChange={::this._termChanged} />
              12 months
            </label>
            <label>
              <input type="radio" name="paymentTerm" value="eighteen"
               checked={payment_term == "eighteen"}
               onChange={::this._termChanged} />
              18 months
            </label>
            <label>
              <input type="radio" name="paymentTerm" value="sub"
               checked={payment_term == "sub"}
               onChange={::this._termChanged} />
              Subscription
            </label>
          </div>
         }
      </div>
    );
  }
  render() {
    return ::this._renderPaymentTermSelector();
  }
}

@branch({
})
class HeaderRow extends Component {
  _renderHeaderRow() {
    return(
      <div className="row header-row">
        <div className="col-sm-3">
          Item
        </div>
        <div className="col-sm-2">
          Qty
        </div>
        <div className="col-sm-2">
          <div className="right-justify">
            Price
          </div>
        </div>
        <div className="col-sm-2">
          <div className="right-justify">
            Discount
          </div>
        </div>
        <div className="col-sm-2">
          <div className="right-justify">
            Total
          </div>
        </div>
        <div className="col-sm-1">
          &nbsp;
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderHeaderRow();
  }
}

@branch({
  builder: ['appointpal', 'invoice_builder']
})
class LineItem extends Component {
  _handleDescriptionChange(e) {
    this.props.dispatch(
      handleLineItemDescriptionChange,
      this.props.idx,
      e.target.value,
      e.target.name,
    );
  }
  _handleQuantityChange(e) {
    this.props.dispatch(
      handleLineItemQuantityChange,
      this.props.idx,
      e.target.value,
    );
  }
  _handleAmountChange(values) {
    const {formattedValue, value, floatValue} = values;
    this.props.dispatch(
      handleLineItemAmountChange,
      this.props.idx,
      floatValue,
      value,
    );
  }
  _handleDiscountChange(values) {
    const {formattedValue, value, floatValue} = values;
    this.props.dispatch(
      handleLineItemDiscountChange,
      this.props.idx,
      floatValue,
      value,
    );
  }
  _removeLineItem(e) {
    this.props.dispatch(
      removeLineItem,
      this.props.idx
    )
  }
  _renderLineItem() {
    const {read_only} = this.props.builder;
    const {line_item, idx} = this.props;
    let line_item_total = (line_item.amount * line_item.quantity - line_item.discount).toFixed(2);
    return(
      <div className="row line-item-row">
        <div className="col-sm-3">
          <input
            className="description-input"
            type="text"
            name={idx}
            value={line_item.description}
            onChange={::this._handleDescriptionChange}
            disabled={read_only}
          />
        </div>
        <div className="col-sm-2">
          <input
            className="quantity-input"
            type="number"
            name={idx}
            value={line_item.quantity}
            step="1"
            onChange={::this._handleQuantityChange}
            disabled={read_only}
          />
        </div>
        <div className="col-sm-2">
          <NumberFormat
            className="currency-input"
            name={idx}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={'$'}
            value={line_item.amount}
            onValueChange={::this._handleAmountChange}
            disabled={read_only}
          />
        </div>
        <div className="col-sm-2">
          <NumberFormat
            className="currency-input"
            name={idx}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={'$'}
            value={line_item.discount}
            onValueChange={::this._handleDiscountChange}
            disabled={read_only}
          />
        </div>
        <div className="col-sm-2">
          <NumberFormat
            className="currency-input"
            name={idx}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={'$'}
            value={line_item_total}
            disabled
          />
        </div>
        {
          !read_only &&
          <div className="col-sm-1 control-col">
            <i className="fa fa-times" onClick={::this._removeLineItem}></i>
          </div>
        }
      </div>
    );
  }
  render() {
    return ::this._renderLineItem();
  }
}

@branch({
  recurring_payments_enabled: ['account', 'recurring_payments_enabled'],
  invoice: ['appointpal', 'invoice_builder'],
})
class InvoiceBuilder extends Component {
  _addLineItem(e) {
    this.props.dispatch(
      addLineItem
    );
  }
  _saveAsDraft(e) {
    this.props.dispatch(
      saveAsDraft,
      closeInvoiceStepper
    );
  }
  _renderInvoiceBuilder() {
    const {recurring_payments_enabled} = this.props;
    const {line_items, read_only, recipient} = this.props.invoice;
    const MAX_LINE_ITEMS = 10;
    let LineItems = [];
    if(line_items) {
      LineItems = line_items.map((line_item, i) =>
        <LineItem line_item={line_item} idx={i} key={i} />
      );
    }
    const allowMore = LineItems.length < MAX_LINE_ITEMS;
    return (
      <div className="invoice-builder">
        <HeaderRow />
        {LineItems}
        <div className="row controls-row">
          <div className="col-sm-12">
            {
              !read_only && allowMore &&
              <div className="add-line-item">
                <span onClick={::this._addLineItem}>Add Item</span>
              </div>
            }
            {
              recurring_payments_enabled && recipient &&
              <PaymentTermSelector disabled={read_only} />
            }
            {
              recipient && !read_only  &&
              <div className="save-as-draft">
                <button className="btn btn-success btn-block" onClick={::this._saveAsDraft}>Save as Draft</button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceBuilder()
    );
  }
}

export { InvoiceBuilder };