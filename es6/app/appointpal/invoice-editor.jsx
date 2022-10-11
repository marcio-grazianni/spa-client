import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Alert} from '../UI/alert'
import {InvoiceBuilder} from './invoice/builder'
import {InvoiceSummary} from './invoice/summary'
import classnames from 'classnames'


class InvoiceEditorHeader extends Component {
  _renderInvoiceEditorHeader() {
    return (
      <div className='invoice-editor-header'>
        <h2>
          <i className="fa fa-dollar"></i>
          Invoice
        </h2>
      </div>
    );
  }
  render() {
    return ::this._renderInvoiceEditorHeader();
  }
}

@branch({
  alert: ['alpha_alert'],
})
class InvoiceEditor extends Component {
  _renderInvoiceEditor() {
    const {alert} = this.props;
    return (
      <div className="invoice-editor-wrapper">
      {
        (alert) &&
        <div className='alert-wrapper'>
          <Alert alert={alert} alpha={true} />
        </div>
      }
        <div className="invoice-editor-content">
          <InvoiceEditorHeader />
          <div className="invoice-editor-inner">
            <div className="row edit-invoice-components">
              <div className="col-sm-8">
                <InvoiceBuilder />
              </div>
              <div className="col-sm-4 no-pad">
                <InvoiceSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceEditor()
    );
  }
}

export { InvoiceEditor };