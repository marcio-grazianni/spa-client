import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {upgradePromptLoad, changeUpgradeInputValue, submitDemoRequest} from '../actions'

class Feature extends Component {
  render() {
    const {icon, title} = this.props.feature;
    return (
      <li>
        <div className='icon'>
          <img src={Django.static(`images/app-icons/${icon}.svg`)} />
        </div>
        <div className='title'>
          {title}
        </div>
      </li>
    )
  }
}

@branch({
  upgrade_inputs: ['upgrade_inputs'],
})
class UpgradePrompt extends Component {
  componentDidMount() {
    this.props.dispatch(upgradePromptLoad)
  }
  _changeValue(e) {
    this.props.dispatch(
      changeUpgradeInputValue,
      e.currentTarget.name,
      e.currentTarget.value,
    )
  }
  _submitDemoRequest(e) {
    e.preventDefault();
    this.props.dispatch(submitDemoRequest);
  }
  _renderUpgradePrompt() {
    const {upgrade_inputs} = this.props;

    // TODO: pull configable info like this from seperate file
    const FeatureData = [
      {title: "Review Monitoring", icon: "review-monitoring"},
      {title: "Review Generation", icon: "review-generation"},
      {title: "Review Management", icon: "review-management"},
      {title: "Advocate Marketing", icon: "advocate-marketing"},
      {title: "And much more!", icon: "much-more"},
    ]
    let FeatureComponents = FeatureData.map((feature) => {
      return <Feature feature={feature} key={feature.icon} />
    });
    return (
      <div className="upgrade-wrapper">
        <div className='left'>
          <h3>Take control of your online reputation.</h3>
          <p>Get everything you need to generate reviews, increase ratings, boost traffic and drive revenue when you upgrade your SubscriberVoice plan.</p>
          <ul className='feature-list'>
            {FeatureComponents}
          </ul>
        </div>
        <div className="right">
          <div className='logo'>
            <img src={Django.static('images/SV_EnvelopeNew3.svg')} />
          </div>
          <p className='prompt'>
            Ready to get started? Schedule a demo to learn how SubscriberVoice turns <b>more reviews</b> into <b>more sales.</b>
          </p>
          <form onSubmit={::this._submitDemoRequest}>
            <input
              name='first_name'
              type='text'
              placeholder='First Name'
              value={upgrade_inputs.first_name}
              onChange={::this._changeValue}
            />
            <input
              name='last_name'
              type='text'
              placeholder='Last Name'
              value={upgrade_inputs.last_name}
              onChange={::this._changeValue}
            />
            <input
              name='email'
              type='email'
              placeholder='Email'
              value={upgrade_inputs.email}
              onChange={::this._changeValue}
            />
            <input
              name='company_name'
              type='text'
              placeholder='Company Name'
              value={upgrade_inputs.company_name}
              onChange={::this._changeValue}
            />
            <input
              name='phone_number'
              type='phone'
              placeholder='Phone Number'
              value={upgrade_inputs.phone_number}
              onChange={::this._changeValue}
            />
            <button type='submit' className='btn btn-confirm'>
              Request Demo
            </button>
          </form>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUpgradePrompt()
    );
  }
}

export { UpgradePrompt };