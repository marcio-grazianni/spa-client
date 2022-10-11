import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {Link} from 'react-router-component'
import {Alert} from '../UI/alert'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'
import {sendAppointpalActivationRequest, toggleUpgradePrompt, toggleReviewInvitePrompt} from '../actions'

class AppsToggleInner extends Component {
  render() {
    return (
      <span>
        <i className='fa fa-window-restore'></i> Apps
      </span>
    );
  }
}

@branch({
  visible: ['drop_down', 'apps_menu', 'visible'],
  vertical_config: ['account', 'vertical_config'],
  alert: ['alpha_alert'],
  pending: ['appointpal_request_pending'],
})
class AppsMenu extends Component {
  _activateAccount() {
    this.props.dispatch(sendAppointpalActivationRequest);
  }
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  _stopPropagation(e) {
    e.stopPropagation();
    return false;
  }
  _renderAppsMenu() {
    const {visible, vertical_config, alert, pending} = this.props;
    const dropdownClass = classnames('apps', {'open': visible});
    const buttonClass = classnames('btn', 'btn-next', {'disabled': pending});
    return (
      <div className={dropdownClass}>
        <DropDownToggle id="apps_menu" className="apps">
          <AppsToggleInner />
        </DropDownToggle>
        {
          visible &&
          <DropDownMenu id="apps_menu" {...this.props}>
            <h4><span className='appointpal-appoint'>appoint</span><span className='appointpal-pal'>pal</span> <i className='fa fa-home'></i></h4>
            <div className='row' onClick={::this._stopPropagation}>
              <div className='col-xs-12 col'>
                appointpal matches top cosmetic providers with people looking online for their services. SubscriberVoice syncs with appointpal so that you can validate your status as a top cosmetic provider and activate your account.
              </div>
              <div className='buttonContainer'>
              {
                (alert) &&
                <div className='alert-wrapper'>
                  <Alert alert={alert} alpha={true} />
                </div>
              }
              {
                (!alert) &&
                <button className={buttonClass} onClick={::this._activateAccount}>Activate account</button>
              }
              </div>
            </div>
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderAppsMenu()}
      </div>
    );
  }
}

export { AppsMenu };