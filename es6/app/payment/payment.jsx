import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SelectPlan} from './select-plan'
 
@branch({})
class Payment extends Component {
  render() {
    return (
      <div className="onboarding-wrapper payment-only appointpal">
        <SelectPlan />
      </div>
    );
  }
}


export { Payment };