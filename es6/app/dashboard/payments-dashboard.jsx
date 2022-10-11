import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TopSection} from './payments/top-section'
import {BottomSection} from './payments/bottom-section'

@branch({
})
class PaymentsDashboard extends Component {
  renderPaymentsDashboard() {
    return (
      <div className='main-container'>
        <TopSection />
        <BottomSection />
      </div>
    );
  }
  render() {
    return ::this.renderPaymentsDashboard();
  }
}

export { PaymentsDashboard };