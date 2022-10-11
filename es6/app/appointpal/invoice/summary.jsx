import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {handleDueDateChange, toggleDatePicker} from './actions'
import {closeInvoiceEditor} from '../actions'
import {buildStepComplete} from '../stepper/actions'

@branch({
  in_editor: ['appointpal', 'invoice_editor', 'visible'],
  builder: ['appointpal', 'invoice_builder'],
})
class InvoiceSummary extends Component {
  _toggleDatePicker(e) {
    this.props.dispatch(
      toggleDatePicker
    )
  }
  _handleDueDateChange(e) {
    const { name, value } = e.target;
    this.props.dispatch(
      handleDueDateChange,
      value
    )
  }
  _closeInvoiceEditor(e) {
    this.props.dispatch(
      closeInvoiceEditor
    )
  }
  _buildStepComplete(e) {
    this.props.dispatch(
      buildStepComplete
    );
  }
  _renderInvoiceSummary() {
    const {in_editor} = this.props;
    const {number, line_items, invoice_date, due_date, tax_rate, subtotal_amount, tax_amount, total_amount, recipient, payment_term, provider} = this.props.builder;
    let formatted_number = "---";
    if(number) {
      const number_string = "" + number;
      formatted_number = number_string.padStart(9, '0');
    }
    let line_item_total = subtotal_amount;
    const discount_total = line_items.reduce(
      (prev, curr) => {
        return prev + curr.discount;
      }, 0);
    if(discount_total) {
      line_item_total = line_items.reduce(
        (prev, curr) => {
          return prev + curr.amount;
        }, 0);
    }
    const lowerClassname = classnames('invoice-content-lower', {'discounted': discount_total});
    const formatted_discount = parseFloat(discount_total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const formatted_subtotal = parseFloat(line_item_total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const formatted_tax = parseFloat(tax_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const formatted_total = parseFloat(total_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const recurring = "full" !== payment_term;
    const date_picker_label = recurring ? "Start Date" : "Due Date";
    return (
        <div className="invoice-summary">
          <div className="invoice-content">
            <div className="invoice-content-upper">
            {
              recipient &&
              <div className="row name-row">
                <div className="col-sm-12">
                  {recipient.name}
                </div>
              </div>
            }
              <div className="row email-row">
              {
                recipient &&
                <div className="col-sm-12">
                  {recipient.email}
                </div>
              }
              </div>
            {
              recipient &&
              <div className="row phone-row">
                <div className="col-sm-12">
                  {recipient.phone}
                </div>
              </div>
            }
              <div className="row date-row">
                <div className="col-sm-6 label-col">
                  Invoice Number
                </div>
                <div className="col-sm-6 date-col">
                  <div className="right-justify">
                    {formatted_number}
                  </div>
                </div>
              </div>
              {
                  provider &&
                  <div className="row date-row">
                    <div className="col-sm-4 label-col">
                      Provider
                    </div>
                    <div className="col-sm-8 date-col">
                      <div className="right-justify">
                        {provider.name}
                      </div>
                    </div>
                  </div>
              }
              <div className="row date-row">
                <div className="col-sm-6 label-col">
                  Invoice Date
                </div>
                <div className="col-sm-6 date-col">
                  <div className="right-justify">
                    {invoice_date}
                  </div>
                </div>
              </div>
              <div className="row date-row">
                <div className="col-sm-6 label-col">
                  {date_picker_label}
                </div>
                <div className="col-sm-6 date-col">
                  <div
                    className="right-justify">
                    <div
                      className="clickable-date"
                      onClick={::this._toggleDatePicker}
                    >
                      {due_date}
                    </div>
                    <input
                      className="clickable-date"
                      type="date"
                      name="due_date"
                      value={due_date}
                      min={invoice_date}
                      onChange={::this._handleDueDateChange}
                      onBlur={::this._toggleDatePicker}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={lowerClassname}>
              <div className="row subtotal-row">
                <div className="col-sm-6">
                  Subtotal
                </div>
                <div className="col-sm-6">
                  <div className="right-justify">
                    {formatted_subtotal}
                  </div>
                </div>
              </div>
            {
              (discount_total > 0) &&
              <div className="row discount-row">
                <div className="col-sm-6">
                  Discount
                </div>
                <div className="col-sm-6">
                  <div className="right-justify">
                    -{formatted_discount}
                  </div>
                </div>
              </div>
            }
              <div className="row tax-row">
                <div className="col-sm-6">
                  Tax
                </div>
                <div className="col-sm-6">
                  <div className="right-justify">
                    {formatted_tax}
                  </div>
                </div>
              </div>
              <div className="row total-row">
                <div className="col-sm-6">
                  Total
                </div>
                <div className="col-sm-6">
                  <div className="right-justify">
                    {formatted_total}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-wrapper">
          {
            in_editor &&
            <button type='button' onClick={::this._closeInvoiceEditor}>
              Close
            </button>
          }
          {
            !in_editor &&
            <button type='button' onClick={::this._buildStepComplete}>
              Next
            </button>
          }
          </div>
        </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceSummary()
    );
  }
}

export { InvoiceSummary };

