import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {AppContainer} from '../app-container'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {SealHeader} from './seal-header'
import {Sites} from './sites'
import {Edit} from './edit'
import {Code} from './code'
import {Preview} from './preview'
import {initialLoad, saveSeal} from './actions'

@branch({
  confirmation: ['confirmation'],
  paid_account: ['account', 'paid_account'],
  selected_account_id: ['account', 'selected_account_id']
})
class Seal extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id} = this.props;
    if(prevProps.selected_account_id != selected_account_id) {
      this.props.dispatch(initialLoad)
    }
  }
  _confirm() {
    const {confirmation} = this.props;
    let confirmation_function = null;
    switch (confirmation) { //different functions based current confirmation shown
      case 'save_seal':
        confirmation_function = saveSeal;
        break;

    }
    this.props.dispatch(
      confirmation_function
    );
  }
  render() {
    const ConfirmationInfo = {
      save_seal: {
        icon: 'fa-save',
        title: 'Save changes to seal',
        confirm_text: 'Are you sure you would like to save changes? You will have to copy the seal code and re-install for changes to take effect in your email messages.',
        button_text: 'Save'
      },
    }
    const {confirmation, paid_account} = this.props;
    return (
      <AppContainer section="seal">
        <div id="sealsApp" className="newApp">
          {
            confirmation &&
            <Confirmation
              icon={ConfirmationInfo[confirmation].icon}
              title={ConfirmationInfo[confirmation].title}
              confirm_text={ConfirmationInfo[confirmation].confirm_text}
            >
              <ConfirmationButtons>
                <button
                  type='button'
                  className='btn btn-confirm'
                  onClick={::this._confirm}
                >
                  {ConfirmationInfo[confirmation].button_text}
                </button>
              </ConfirmationButtons>
            </Confirmation>
          }
          <div className='seals-wrapper main-wrapper'>
            <SealHeader />
            <div className='inner'>
              <div className='main-wrapper message-seal'>
                <div className='left'>
                  <ul className='edit-list'>
                    <Sites />
                    <Edit />
                    <Code />
                  </ul>
                </div>
                <div className='right'>
                  <Preview />
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          (!paid_account) &&
          <UpgradeOverlay
            page_name="Seal"
          />
        }
      </AppContainer>
    );
  }
}

export { Seal };