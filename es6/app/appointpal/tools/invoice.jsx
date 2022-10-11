import React, {Component} from 'react'
import NumberFormat from 'react-number-format'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection, handleInvoiceAmountChange, handleInvoiceDescriptionChange, handleInputChange, startInvoice} from './actions'


@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'invoice'],
  invoice: ['appointpal', 'tools', 'invoice'],
})
class Invoice extends Component {
  _expandInvoice() {
    this.props.dispatch(
      toggleExpandedSection,
      'invoice'
    )
  }
  _handleInputFocus(e) {
    const { name } = e.target;
    this.props.dispatch(
      handleInputFocus,
      name
    )
  }
  _handleInputChange(e) {
    const { name, value } = e.target;
    this.props.dispatch(
      handleInputChange,
      'invoice',
      name,
      value
    )
  }
  _handleDescriptionChange(e) {
    const {value} = e.target;
    this.props.dispatch(
      handleInvoiceDescriptionChange,
      value
    )
  }
  _handleAmountChange(values) {
    const {formattedValue, value, floatValue} = values;
    this.props.dispatch(
      handleInvoiceAmountChange,
      value,
      floatValue
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      startInvoice
    );
  }
  _renderInvoice() {
    const {expanded, invoice} = this.props;
    const tax_rate = (invoice.tax_rate * 100).toFixed(2);
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='invoice'>
        <label className='edit-label' onClick={::this._expandInvoice}>
          <span className='section-name'><i className='fa fa-dollar'></i>Payment</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className='invoice-body'>
              <form onSubmit={::this._handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <small>Item Description</small>
                    <input
                      type="text"
                      name="item_description"
                      className="form-control"
                      placeholder="Enter line item"
                      value={invoice.description}
                      required
                      onChange={::this._handleDescriptionChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <small>Invoice Date</small>
                    <input
                      type="date"
                      name="invoice_date"
                      className="form-control"
                      value={invoice.invoice_date}
                      required
                      onChange={::this._handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <small>Due Date</small>
                    <input
                      type="date"
                      name="due_date"
                      min={invoice.invoice_date}
                      value={invoice.due_date}
                      className="form-control"
                      required
                      onChange={::this._handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                      <small>Invoice Amount</small>
                      <NumberFormat
                        name="item_amount"
                        value={invoice.amount}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={'$'}
                        className="form-control"
                        onValueChange={::this._handleAmountChange}
                      />
                    </div>
                    <div className="col-sm-4">
                      <small>Tax Rate</small>
                      <input
                        name="tax_rate"
                        type="number"
                        step="0.25"
                        value={tax_rate}
                        className="form-control"
                        disabled
                      />
                    </div>
                    <div className="col-sm-4">
                      <small>Total Amount</small>
                      <NumberFormat
                        name="total_amount"
                        thousandSeparator={true}
                        prefix={'$'}
                        value={invoice.total_amount}
                        className="form-control"
                        disabled
                      />
                    </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-success btn-block">Start Payment</button>
                </div>
              </form>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderInvoice()
    );
  }
}

export { Invoice };