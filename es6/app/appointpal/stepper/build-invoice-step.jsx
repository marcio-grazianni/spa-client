import React, {Component} from 'react'
import {InvoiceBuilder} from '../invoice/builder'
import {InvoiceSummary} from '../invoice/summary'

class BuildInvoiceStep extends Component {
  _renderBuildInvoiceStep() {
    return(
      <div className="row build-invoice-components">
        <div className="col-sm-8">
          <InvoiceBuilder />
        </div>
        <div className="col-sm-4 no-pad">
          <InvoiceSummary />
        </div>
      </div>
    );
  }
  render() {
    return ::this._renderBuildInvoiceStep()
  }
}

export { BuildInvoiceStep };