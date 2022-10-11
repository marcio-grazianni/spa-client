import React, {Component} from 'react'
import {PaymentsTotal} from './payments-total'
import {PaymentsBreakdown} from './payments-breakdown'
import classnames from 'classnames'

class PaymentsInfo extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className='sxi-info'>
        <PaymentsTotal />
        <PaymentsBreakdown />
      </div>
    );
  }
}

export { PaymentsInfo };