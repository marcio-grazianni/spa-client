import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {StripeProvider, injectStripe, Elements} from 'react-stripe-elements'
import {Alert} from '../UI/alert'
import {PlanInfo} from './plan-info'
import CheckoutForm from './checkout-form'
import {goToStep, selectCard, changePlan, planPayment, cardFormReady, cardFormError} from './actions'

@branch({
  card_info: ['account', 'card_info'],
  selected_card: ['payment', 'selected_card'],
  card_form_ready: ['payment', 'card_form_ready'],
  alert: ['alpha_alert'],
})
class CardSelection extends Component {
  _selectCard(e) {
    this.props.dispatch(
      selectCard,
      e.currentTarget.name,
    );
  }
  render() {
    const {card_info, selected_card, card_form_ready, alert} = this.props;
    const {brand, last4, exp_month, exp_year} = card_info;
    return (
      <ul className='card-selection'>
        <li className='saved-card'>
          <input
            className='saved-radio'
            type='radio'
            name='saved'
            checked={(selected_card === 'saved')}
            onChange={::this._selectCard}
          />
          <p className='prompt'>{`${brand} ${last4} expires ${exp_month}/${exp_year}`}</p> 
        </li>
        <li className='new-card'>
          <input
            className='new-radio'
            type='radio'
            name='new'
            checked={(selected_card === 'new')}
            onChange={::this._selectCard}
          />
          <p className='prompt'>Add new card</p>
          {
            (selected_card === 'new') &&
            <div className={classnames('card-form-wrapper', {ready: card_form_ready})}>
              {
                (alert) &&
                <div className='alert-wrapper'>
                  <Alert alert={alert} alpha={true} />
                </div>
              }
              <CheckoutForm />
              <div className='loading'><i className='fa fa-spin fa-spinner' /></div>
            </div>

          }
        </li>
      </ul>
    );
  }
}

@branch({
  selected_plan: ['payment', 'selected_plan'],
  pricing: ['account', 'vertical_config', 'pricing'],
  card_form_ready: ['payment', 'card_form_ready'],
  alert: ['alpha_alert'],
  onboarding_complete: ['account', 'onboarding_complete'],
  card_info: ['account', 'card_info'],
  payment_method: ['payment', 'payment_method'],
})
@injectStripe
class PaymentInner extends Component {
  _back() {
    this.props.dispatch(
      goToStep,
      0, // payment step
      5, //
    );
    this.props.dispatch(cardFormReady, false);
  }
  _handleSubmit(e) {
    e.preventDefault();
    // if there is already a card
    if (this.props.card_info) {
      this.props.dispatch(
        changePlan,
      );
      return true;
    }
    this.props.stripe.createToken({type: 'card'}).then((result) => {
      if (result.token) {
        this.props.dispatch(
          planPayment,
          result.token,
        );
      } else if (result.error) {
        this.props.dispatch(
          cardFormError,
          result.error.message,
        );
        // TODO: deal with errors here
      }
    });
  }
  render() {
    const {selected_plan, pricing, card_form_ready, alert, onboarding_complete, card_info, payment_method} = this.props;
    const price = pricing[selected_plan];
    const pricing_model = pricing['model'];
    return (
      <div className="plan">
        <form onSubmit={::this._handleSubmit}>
          <div className='payment-form'>
            <div className='money-back'>
              <img src={Django.static('images/appointpal/banner-logo.png')}></img>
            </div>
            {
              (selected_plan === 'standard') &&
              <h2><span className='plan-name'>Preferred Plan:</span> <span className='prompt'>your card will be charged ${price} monthly.</span></h2>
            }
            {
              (card_info) &&// if onboarding is complete and we have card info show card seleection
              <div className={classnames('card-form-wrapper', {ready: card_form_ready})}>
                <p className='prompt'>Card type: {card_info['brand']}</p>
                {
                  (alert) &&
                  <div className='alert-wrapper'>
                    <Alert alert={alert} alpha={true} />
                  </div>
                }
                <CheckoutForm fake={true} />
                <div className='loading'><i className='fa fa-spin fa-spinner' /></div>
              </div>
            }
            {
              (!card_info) && // if in onboarding or no saved card just show card form
              <div className={classnames('card-form-wrapper', {ready: card_form_ready})}>
                <p className='prompt'>Add your card</p>
                {
                  (alert) &&
                  <div className='alert-wrapper'>
                    <Alert alert={alert} alpha={true} />
                  </div>
                }
                <CheckoutForm fake={false} />
                <div className='loading'><i className='fa fa-spin fa-spinner' /></div>
              </div>
            }
            <p className='agreement-prompt'>By clicking "Start Subscription" you agree to the <a target='_blank' href='https://www.appointpal.com/terms.html'>Terms of Service</a> and  <a target='_blank' href='https://www.appointpal.com/privacy.html'>Privacy Policy</a>.</p>
            {
              // only show back button if not a subscriber type account
              (pricing_model !== 'subscriber') &&
                <div className='back'>
                  <span onClick={::this._back}><i className='fa fa-chevron-left'></i> Back</span>
                </div>
            }
          </div>
          <ul className='plans new'>
            <li className='plan selected'>
              <PlanInfo />
              <div className='button-wrapper'>
              <button className='btn btn-next' type='submit'>Start Subscription</button>
              </div>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

@branch({})
class PaymentForm extends Component {
  render() {
    return (
      <StripeProvider apiKey={Django.stripe_pk}>
        <Elements fonts={[{family:'OpenSans', src: "url('https://fonts.googleapis.com/css?family=Open+Sans')", weight: 400}]}>
          <PaymentInner />
        </Elements>
      </StripeProvider>
    );
  }
}


export { PaymentForm };