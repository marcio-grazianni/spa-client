import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {OnboardingHeader} from './onboarding-header'
import {goToStep, selectIndustry, industrySubmit} from './actions'

@branch({
  selected_industry: ['onboarding', 'selected_industry'],
})
class IndustryItem extends Component {
  _selectIndustry() {
    this.props.dispatch(
      selectIndustry,
      this.props.slug
    );
  }
  render() {
    const {label, slug, selected_industry} = this.props;
    return (
      <li
        className={classnames('industry-item', {selected: (slug === selected_industry)})}
        onClick={::this._selectIndustry}
      >
        <label>{label}</label>
        <img src={Django.static(`images/industry-icons/${slug}.png`)} />
      </li>
    );
  }
}

@branch({
  selected_industry: ['onboarding', 'selected_industry'],
})
class SelectIndustry extends Component {
  _nextStep() {
    if (this.props.selected_industry) {
      this.props.dispatch(
        industrySubmit
      );
    }
  }
  render() {
    const Industries = [
      {
        label: 'E-Comm',
        slug: 'e-comm',
      },
      {
        label: 'Restaurant',
        slug: 'restaurant',
      },
      {
        label: 'Auto',
        slug: 'auto',
      },
      {
        label: 'Insurance',
        slug: 'insurance',
      },
      {
        label: 'Real Estate',
        slug: 'real-estate',
      },
      {
        label: 'Mortgage',
        slug: 'mortgage',
      },
      {
        label: 'Law',
        slug: 'law',
      },
      {
        label: 'Financial Services',
        slug: 'financial-services',
      },
    ]
    const IndustryItems = Industries.map((industry) =>
      <IndustryItem key={industry.slug} label={industry.label} slug={industry.slug} />
    );
    return (
      <div className="onboarding-industry">
        <OnboardingHeader />
        <h2>Select your industry so we can customize your experience.</h2>
        <ul className='industries'>
          {IndustryItems}
        </ul>
        <div className='button-wrapper'>
          <button
            type='button'
            className='btn btn-confirm'
            onClick={::this._nextStep}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export { SelectIndustry };