import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleUpgradePrompt} from '../../actions'

@branch({
  pricing_model: ['account', 'vertical_config', 'pricing', 'model'],
})
class UpgradeButton extends Component {
  _toggleUpgradePrompt() {
    // TODO: possibly takes you to locations page and then gives you upgrade alpha screen
    this.props.dispatch(toggleUpgradePrompt)
  }
  render() {
    const {pricing_model} = this.props;
    let cta = 'Request Demo';
    if (pricing_model !== 'subscriber') {
      cta = 'Upgrade to Preferred'
    }
    return (
      <div className='upgrade-prompt'>
        <button
          type='button'
          className='btn btn-upgrade'
          onClick={::this._toggleUpgradePrompt}
        >
          {cta}
        </button>
      </div>
    );
  }
}

export { UpgradeButton };