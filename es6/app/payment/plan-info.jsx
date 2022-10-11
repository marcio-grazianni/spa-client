import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {selectCycle} from './actions'


@branch({
})
class APCycleSelection extends Component {
  _selectCycle(e) {
    if (this.props.disabled) {
      return false;
    }
    this.props.dispatch(
      selectCycle,
      e.currentTarget.value,
    );
  }
  render() {
    const {disabled} = this.props;
    return (
      <div className='cycle-select'>
        <label>Subscription Type:</label>
        <ul className={classnames('cycles', {disabled})}>
          <li><input name='cycle' value='yearly' type='radio' checked={true} disabled={disabled} readOnly /> <span>Annual</span></li>
        </ul>
      </div>
    );
  }
}

@branch({
  pricing: ['account', 'vertical_config', 'pricing'],
  plural: ['account', 'vertical_config', 'plural'],
})
class PlanInfo extends Component {
  render() {
    const {pricing} = this.props;
    const price = pricing['standard'];
    return (
      <div>
        <div className='header'>
          <label>&nbsp;</label>
        </div>
        <h2>Preferred</h2>
        <div className='price'>
          <h3>${price}<span>/mo</span></h3>
        </div>
        <p>Our preferred plan, for surgical and nonsurgical aesthetic providers.</p>
        <div className='divider'></div>
        <ul className='features'>
          <li><i className='fa fa-check'></i> Access appointment requests</li>
          <li><i className='fa fa-check'></i> Increase appointment matches</li>
          <li><i className='fa fa-check'></i> Fill appointment cancellations</li>
          <li><i className='fa fa-check'></i> Boost ratings & reviews</li>
          <li><i className='fa fa-check'></i> Drive new patients</li>
        </ul>
        <div className='divider'></div>
        <APCycleSelection disabled={true} />
      </div>
    );
  }
}

export { PlanInfo };