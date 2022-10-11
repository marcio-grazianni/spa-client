import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {closeAlert, initPaymentButtons} from '../actions'
import {createClient, cancelCreateClient, updateClient, mergePending, makeDependent} from '../appointpal/clients/actions'

@branch({
  account_slug: ['account', 'account_slug']
})
class PaymentButtons extends Component {
  componentDidMount() {
    this.props.dispatch(initPaymentButtons);
  }
  _linkBankAccount() {
    Django.Plaid.open();
  }
  _renderPaymentButtons() {
    const {account_slug} = this.props;
    const typeform_url = `https://appointpal.typeform.com/to/Eme9wwSb?typeform-medium=embed-snippet#apid=${account_slug}`
    return (
      <div className="button-panel no-subtitle">
        <button className="btn btn-default">
          <a
            className="typeform-share button"
            href={typeform_url}
            data-mode="popup"
            data-size="50"
            data-submit-close-delay="10"
            target="_blank">
            Micro-deposits
          </a>
        </button>
        <button className="btn btn-cta" onClick={::this._linkBankAccount}>Plaid</button>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentButtons()
    );
  }
}

@branch({
  guarantor_id: ['appointpal', 'client_form', 'guarantor_id']
})
class DependentButtons extends Component {
  _disallowDependent() {
    this.props.dispatch(
      cancelCreateClient
    );
  }
  _allowDependent() {
    const {operation, guarantor_id} = this.props;
    const methodCall = 'add' === operation ? createClient : updateClient;
    this.props.dispatch(
      methodCall,
      guarantor_id
    )
  }
  _renderDependentButtons() {
    const {operation} = this.props;
    const cta = 'add' === operation ? 'Create' : 'Save';
    return (
      <div className="button-panel">
        <button className="btn btn-default" onClick={::this._disallowDependent}>Cancel</button>
        <button className="btn btn-cta" onClick={::this._allowDependent}>{cta}</button>
      </div>
    );
  }
  render() {
    return (
      ::this._renderDependentButtons()
    );
  }
}

@branch({
})
class PromotionButtons extends Component {
  _disallowPromotion() {
    this.props.dispatch(
      cancelCreateClient
    );
  }
  _mergePending() {
    this.props.dispatch(
      mergePending
    )
  }
  _makeDependent() {
    this.props.dispatch(
      makeDependent
    )
  }
  _renderPromotionButtons() {
    return (
      <div className="button-panel">
        <button className="btn btn-default" onClick={::this._disallowPromotion}>Cancel</button>
        <button className="btn btn-cta" onClick={::this._mergePending}>Merge</button>
        <button className="btn btn-cta" onClick={::this._makeDependent}>Dependent</button>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPromotionButtons()
    );
  }
}

@branch({})
class Alert extends Component {
  _closeAlert() {
    this.props.dispatch(
      closeAlert,
      this.props.alpha,
    );
  }
  _renderAlert() {
    const {body, alert_type, permanent, dependent_buttons, promotion_buttons} = this.props.alert;
    const alert_class = classnames('alert', alert_type);
    const closable = !permanent;
    return (
      <div className={alert_class}>
        <p dangerouslySetInnerHTML={{__html: body}} />
        {
          closable &&
          <div
            className='close'
            onClick={::this._closeAlert}
          >
            <i className='fa fa-close'></i>
          </div>
        }
        {
          permanent &&
          <PaymentButtons/>
        }
        {
          dependent_buttons != null &&
          <DependentButtons operation={dependent_buttons} />
        }
        {
          promotion_buttons != null &&
          <PromotionButtons />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderAlert()
    );
  }
}


export { Alert };