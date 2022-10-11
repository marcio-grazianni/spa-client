import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeBreakdownHover} from './actions'

@branch({
  breakdown_hover: ['dashboard', 'breakdown_hover'],
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
  breakdown: ['dashboard', 'sxi', 'breakdown']
})
class SXIBreakdown extends Component {
  _renderSXIBreakdown() {
    let {advocates_pct, neutral_pct, adversaries_pct} = this.props.breakdown;
    const total = advocates_pct + neutral_pct + adversaries_pct;
    let  no_data;
    if (total == 0) {
      advocates_pct = 50;
      neutral_pct = 40;
      adversaries_pct = 10;
      no_data = true;
    }
    const breakdownClass = classnames('sxi-breakdown-bar', {'no-data': no_data});
    return (
      <div className='sxi-breakdown'>
        <div className={breakdownClass}>
          <Portion
            id='advocates'
            pct={advocates_pct}
            label='Advocates'
          />
          <Portion
            id='neutral'
            pct={neutral_pct}
            label='Neutral'
          />
          <Portion
            id='adversaries'
            pct={adversaries_pct}
            label='Adversaries'
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSXIBreakdown()
    );
  }
}

export { SXIBreakdown };