import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {PlanInfo} from './plan-info'
import {PaymentForm} from './payment-form'
import {FeatureList} from './feature-list'
import {Outro} from './outro'
import {selectPlanSubmit, selectPlan} from './actions'


@branch({
  selected_plan: ['payment', 'selected_plan'],
  pricing: ['account', 'vertical_config', 'pricing'],
})
class PlanSelection extends Component {
  _selectPlanSubmit() {
    this.props.dispatch(
      selectPlanSubmit
    );
  }
  render() {
    const {selected_plan, pricing} = this.props;
    const lite_price = pricing['lite'];
    return (
      <div className='plan-select'>
        <FeatureList />
        <ul className='plans new'>
          <li className='plan selected'>
            <PlanInfo />
            <div className='button-wrapper'>
              <button
                type='button'
                className='btn btn-next'
                onClick={::this._selectPlanSubmit}
              >
                Next
              </button>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

@branch({
  onboarding_step: ['onboarding', 'onboarding_step'],
  payment_step: ['payment', 'payment_step'],
  onboarding_complete: ['account', 'onboarding_complete'],
  selected_plan: ['payment', 'selected_plan'],
  pricing: ['account', 'vertical_config', 'pricing'],
})
class SelectPlan extends Component {
  componentWillMount() {
    // // make sure we default to lite if pricing model is subscriber
    // if (this.props.pricing['model'] === 'subscriber') {
    //   this.props.dispatch(
    //     selectPlan,
    //     'lite',
    //   );
    // }
    // // if payment upgrade prompt (onboarding is complete) then select standard
    // if (this.props.onboarding_complete) {
    //   this.props.dispatch(
    //     selectPlan,
    //     'standard',
    //   );
    // }
    this.props.dispatch(
      selectPlan,
      'standard',
    );
  }
  render() {
    const {onboarding_step, onboarding_complete, payment_step, selected_plan, pricing} = this.props;
    let CurrentStep = <PlanSelection />;
    if (payment_step === 0) {
        CurrentStep = <PlanSelection />;
      } else if (payment_step === 1) {
        CurrentStep = <PaymentForm />;
      } else {
        CurrentStep = <Outro />;
      }
    return (
      <div className="onboarding-plan">
        {CurrentStep}
      </div>
    );
  }
}

export { SelectPlan };