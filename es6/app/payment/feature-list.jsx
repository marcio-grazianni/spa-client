import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'
import {setPlanMouseOver, selectPlan} from './actions'

const LiteFeatures = {
  users: '1',
  appointmentmatching: true,
  appointmentnotifications: true,
}

@branch({
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
})
class FeatureCell extends Component {
  render() {
    const {feature, plan, pricing_model} = this.props;
    const {slug} = feature;
    let feature_info;
    let feature_value;
    let FeatureComponent;
    feature_info = LiteFeatures;
    // if slug exists in feature list use that value
    // if it doesnt exist feature component is a blank span.
    if ((slug.replace(/-/g, "")) in feature_info) {
      feature_value = feature_info[slug.replace(/-/g, "")];
      // if its a string we display that in span
      if (typeof feature_value === 'string') {
        FeatureComponent = <span>{feature_value}</span>;
      } else { // display a check!
        FeatureComponent = <span><i className='fa fa-check-circle'></i></span>;
      }
    } else {
      FeatureComponent = <span></span>;
    }
    return (FeatureComponent);
  }
}

@branch({
  hovered_plan: ['payment', 'hovered_plan'],
  selected_plan: ['payment', 'selected_plan'],
  onboarding_complete: ['account', 'onboarding_complete'],
})
class Feature extends Component {
  _setMouseOver(e) {
    // this.props.dispatch(
    //   setPlanMouseOver,
    //   e.currentTarget.dataset.plan,
    //   true,
    // )
  }
  _unsetMouseOver(e) {
    // this.props.dispatch(
    //   setPlanMouseOver,
    //   e.currentTarget.dataset.plan,
    //   false,
    // )
  }
  _setSelected(e) {
    // if onboarding is complete they can't actually change selected plan
    return false;
    // if (this.props.onboarding_complete) {
    //   return false;
    // }
    // this.props.dispatch(
    //   selectPlan,
    //   e.currentTarget.dataset.plan,
    // )
  }
  render() {
    const {feature, hovered_plan, selected_plan, onboarding_complete} = this.props;
    const {name, description} = feature;
    return (
      <li className='feature-row'>
        <div className='feature-name'>
          <span
            className='info-icon'
            data-tip
            data-for={name}
            data-place="right"
            data-effect="solid"
          >
            <i className='fa fa-info-circle'></i>
          </span>
          <span className='name'>{name}</span>
          <ReactTooltip id={name}>
            {description}
          </ReactTooltip>
        </div>
        <div
          className={
            classnames(
              'column',
              'lite-column',
              {
                hovered: (hovered_plan === 'lite' && !onboarding_complete),
                selected: (selected_plan === 'lite'),
                disabled: onboarding_complete,
              },
            )
          }
          data-plan='lite'
          onMouseEnter={::this._setMouseOver}
          onMouseLeave={::this._unsetMouseOver}
          onClick={::this._setSelected}
        >
          <FeatureCell
            feature={feature}
            plan='lite'
          />
        </div>
        <div
          className={
            classnames(
              'column',
              'standard-column',
              {
                hovered: (hovered_plan === 'standard'),
                selected: (selected_plan === 'standard')
              },
            )
          }
          data-plan='standard'
          onMouseEnter={::this._setMouseOver}
          onMouseLeave={::this._unsetMouseOver}
          onClick={::this._setSelected}
        >
          <FeatureCell
            feature={feature}
            plan='standard'
          />
        </div>
      </li>
    );
  }
}

branch({
  hovered_plan: ['payment', 'hovered_plan'],
  selected_plan: ['payment', 'selected_plan'],
  onboarding_complete: ['account', 'onboarding_complete'],
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
  vertical: ['account', 'vertical'],
})
class FeatureList extends Component {
  _setMouseOver(e) {
    // this.props.dispatch(
    //   setPlanMouseOver,
    //   e.currentTarget.dataset.plan,
    //   true,
    // )
  }
  _unsetMouseOver(e) {
    // this.props.dispatch(
    //   setPlanMouseOver,
    //   e.currentTarget.dataset.plan,
    //   false,
    // )
  }
  _setSelected(e) {
    // if onboarding is complete they can't actually change selected plan
    // if (this.props.onboarding_complete) {
    //   return false;
    // }
    // this.props.dispatch(
    //   selectPlan,
    //   e.currentTarget.dataset.plan,
    // )
  }
  render() {
    const {hovered_plan, selected_plan, onboarding_complete, pricing_model, vertical} = this.props;
    const DefaultFeatures = [
      {
        slug: 'users',
        name: 'Users',
        description: 'The number of people with account access.',
      },
      {
        slug: 'appointment-matching',
        name: 'Appointment matching',
        description: 'Preferred appointment matching with prospective patients in your local area.',
      },
      {
        slug: 'appointment-notifications',
        name: 'Appointment notifications',
        description: 'Receive notifications of appointment requests from prospective patients you’ve matched with.'
      },
      {
        slug: 'appointment-messaging',
        name: 'Appointment messaging',
        description: 'Easily respond to new appointment requests.'
      },
      {
        slug: 'review-monitoring',
        name: 'Review monitoring',
        description: 'Monitor your presence across the most important sites to your practice.',
      },
      {
        slug: 'review-generation',
        name: 'Review generation',
        description: 'Generate positive reviews on the most important sites to your practice with 1000 mobile and 5000 email review invites.'
      },
      {
        slug: 'dashboard',
        name: 'Dashboard',
        description: 'Get the status of your practice across the Internet from a single centralized location.',
      },
      {
        slug: 'feed',
        name: 'Feed',
        description: 'Aggregate your reviews from across the Internet into a single feed.',
      },
      {
        slug: 'reports',
        name: 'Reports',
        description: 'Get detailed reports that keep you in complete control of your online reputation.',
      },
      {
        slug: 'leaderboard',
        name: 'Leaderboard',
        description: 'Motivate your team by identifying who is providing the best experience and driving the most reviews.',
      },
      {
        slug: 'weekly-digest',
        name: 'Weekly digest',
        description: 'Receive a weekly digest outlining the key performance indicators driving your appointments.',
      }
    ]
    const FeatureComponents = DefaultFeatures.map((feature) =>
      <Feature key={feature.name} feature={feature} />
    );
    return (
      <ul className={classnames('feature-list', pricing_model)}>
        <div className='money-back'>
          <img src={Django.static('images/appointpal/banner-logo.png')}></img>
        </div>
        <li className='plan-label'>
          <h2>Select your AppointPal plan</h2>
          <div
            className={
              classnames(
                'column',
                'lite-label',
                'lite-column',
                'disabled'
              )
            }
            data-plan='lite'
            onMouseEnter={::this._setMouseOver}
            onMouseLeave={::this._unsetMouseOver}
            onClick={::this._setSelected}
          >
            <input
              className='lite-radio'
              type='checkbox'
              checked={true}
              readOnly
            />
            <label>Lite</label>
          </div>
          <div
            className={
              classnames(
                'column',
                'standard-label',
                'standard-column',
                'selected',
              )
            }
            data-plan='standard'
            onMouseEnter={::this._setMouseOver}
            onMouseLeave={::this._unsetMouseOver}
            onClick={::this._setSelected}
          >
            <input
              className='standard-radio'
              type='radio'
              checked={true}
              readOnly
            />
            <label>Preferred</label>
          </div>
        </li>
        {FeatureComponents}
      </ul>
    );
  }
}

export { FeatureList };