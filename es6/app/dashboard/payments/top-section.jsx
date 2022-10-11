import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {LoadingOverlay} from '../loading-overlay'
import {PaymentsInfo} from './payments-info'
import {PaymentsTrend} from './payments-trend'
import {NoDataOverlay} from '../no-data-overlay'

class Data extends Component {
  _renderData() {
    return(
      <div>
        <PaymentsInfo />
        <PaymentsTrend />
      </div>
    );
  }
  render() {
    return (
      ::this._renderData()
    );
  }
}

@branch({
  is_loading: ['dashboard', 'payments_is_loading'],
  total: ['dashboard', 'payment_stats', 'total']
})
class TopSection extends Component {
  _renderTopSection() {
    const {is_loading, total} = this.props;
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='box'>
            <div className='top-data-wrapper'>
              <div className='header'>
                <h3>Payment Summary</h3>
              </div>
              <div className='top-data'>
                {
                  (is_loading) ? <LoadingOverlay /> : <Data />
                }
                {
                  (!is_loading && 0 === total) &&
                  <NoDataOverlay />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTopSection()
    );
  }
}

export { TopSection };