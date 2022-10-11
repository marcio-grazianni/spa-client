import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeBreakdownHover} from './actions'

@branch({
  breakdown_hover: ['dashboard', 'payments_breakdown_hover'],
})
class Portion extends Component {
  _setHover() {
    if (this.props.pct <= 15) {
      this.props.dispatch(
        changeBreakdownHover,
        this.props.id,
        true
      )
    }
  }
  _unsetHover() {
    if (this.props.pct <= 15) {
      this.props.dispatch(
        changeBreakdownHover,
        this.props.id,
        false
      )
    }
  }
  _renderPortion() {
    const {id, pct, label, breakdown_hover} = this.props;
    const hover_state = breakdown_hover[id];
    const portion_class = classnames('portion', `${id}-portion`);
    return (
      <div
        className={portion_class}
        id={id}
        style={{width: `${pct}%`}}
        onMouseEnter={::this._setHover}
        onMouseLeave={::this._unsetHover}
      >
        {
          (pct > 15) &&
          <div className='portion-label'>
            <label>{label}</label>
            <span className='percentage'>
              {`${pct}%`}
            </span>
          </div>
        }
        {
          (hover_state) &&
          <div className='hover-tooltip'>
            <label>{label}</label>
            <span className='percentage'>
              {`${pct}%`}
            </span>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderPortion()
    );
  }
}

@branch({
  breakdown: ['dashboard', 'payment_stats']
})
class PaymentsBreakdown extends Component {
  _renderPaymentsBreakdown() {
    const {total, succeeded_pct, failed_pct, refunded_pct} = this.props.breakdown;
    let no_data = true;
    let succeeded = 50;
    let failed = 40;
    let refunded = 10;
    if(total > 0) {
      no_data = false;
      succeeded = succeeded_pct;
      failed = failed_pct;
      refunded = refunded_pct;
    }
    const breakdownClass = classnames('sxi-breakdown-bar', {'no-data': no_data});
    return (
      <div className='sxi-breakdown'>
        <div className={breakdownClass}>
          <Portion
            id='succeeded'
            pct={succeeded_pct}
            label='Succeeded'
          />
          <Portion
            id='failed'
            pct={failed_pct}
            label='Failed'
          />
          <Portion
            id='refunded'
            pct={refunded_pct}
            label='Refunded'
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentsBreakdown()
    );
  }
}

export { PaymentsBreakdown };