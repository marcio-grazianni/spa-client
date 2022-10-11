import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import numeral from 'numeral'

@branch({
  total: ['dashboard', 'payment_stats', 'total']
})
class PaymentsTotal extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderPaymentsTotal() {
    const height = 100;
    const width = 100;
    const {total} = this.props;
    let truncated_total = numeral(total).format('$0.00a');
    return (
      <div className='sxi-average-wrapper'>
        <div
          className='payments-total'
          style={{
            height: height,
            width: width
          }}>
          <div>Total</div>
          <div className='payments-total-amount'>
            {truncated_total}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentsTotal()
    );
  }
}

export { PaymentsTotal };