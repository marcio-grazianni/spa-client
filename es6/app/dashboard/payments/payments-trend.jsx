import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import {LineGraph} from '../../UI/graphs/line-graph'
import {changeMouseOver} from './actions'

@branch({
  payment_series: ['dashboard', 'payment_stats', 'series'],
})
class PaymentsTrend extends Component {
  _changeMouseOver(index, hover_state) {
    this.props.dispatch(
      changeMouseOver,
      index,
      hover_state
    )
  }
  _renderPaymentsTrend() {
    const {payment_series} = this.props;
    let data = [];
    let min = 0;
    let max = 100;
    if (payment_series) {
      data = payment_series;
    }
    const values = data.map(node => node.total);
    max = Math.max(...values);
    return (
      <div className='sxi-trend'>
        <MediaQuery minWidth={1420}>
          <LineGraph
            field='total'
            onChangeMouseOver={::this._changeMouseOver}
            data={data}
            min={min}
            max={max}
            dollars={true}
            {...this.props}
          />
        </MediaQuery>
        <MediaQuery minWidth={1200} maxWidth={1419}>
          <LineGraph
            field='total'
            onChangeMouseOver={::this._changeMouseOver}
            width={840}
            data={data}
            min={min}
            max={max}
            dollars={true}
            {...this.props}
          />
        </MediaQuery>
        <MediaQuery maxWidth={1199}>
          <LineGraph
            field='total'
            onChangeMouseOver={::this._changeMouseOver}
            width={740}
            data={data}
            min={min}
            max={max}
            dollars={true}
            {...this.props}
          />
        </MediaQuery>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentsTrend()
    );
  }
}

export { PaymentsTrend }