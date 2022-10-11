import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement} from 'react-stripe-elements'
import {cardFormReady} from './actions'


@branch({
  card_info: ['account', 'card_info'],
})
class FakeCardSection extends Component {
  componentDidMount() {
    this.props.dispatch(cardFormReady, true);
  }
  render() {
    const {card_info} = this.props;
    const {last4, exp_month, exp_year, address_zip} = card_info;
    return (
      <div className='card-fields fake'>
        <div className='control-row-1'>
          <div className="control-group">
            <label>Card Number:</label>
            <div className='input-wrapper'>
              <input value={`XXXX XXXX XXXX ${last4}`} readOnly disabled  />
            </div>
          </div>
        </div>
        <div className='control-row-2'>
          <div className="control-group">
            <label>Expiration:</label>
            <div className='input-wrapper'>
              <input value={`${exp_month}/${exp_year}`} readOnly disabled />
            </div>
          </div>
          <div className="control-group">
            <label>Security Code:</label>
            <div className='input-wrapper'>
              <input value={`XXX`} readOnly disabled />
            </div>
          </div>
          <div className="control-group">
            <label>Zipcode:</label>
            <div className='input-wrapper'>
              <input value={`${address_zip}`} readOnly disabled />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

@branch({})
class CardSection extends React.Component {
  _onReady() {
    this.props.dispatch(cardFormReady, true);
  }
  render() {
    return (
      <div className='card-fields'>
        <div className='control-row-1'>
          <div className="control-group">
            <label>Card Number:</label>
            <div className='input-wrapper'>
              <CardNumberElement onReady={::this._onReady} style={{base: {fontSize: '18px', fontFamily: "OpenSans, 'Sans Serif'", color: '#70788F'}}} />
            </div>
          </div>
        </div>
        <div className='control-row-2'>
          <div className="control-group">
            <label>Expiration:</label>
            <div className='input-wrapper'>
              <CardExpiryElement style={{base: {fontSize: '18px', fontFamily: "OpenSans, 'Sans Serif'", color: '#70788F'}}} />
            </div>
          </div>
          <div className="control-group">
            <label>Security Code:</label>
            <div className='input-wrapper'>
              <CardCVCElement style={{base: {fontSize: '18px', fontFamily: "OpenSans, 'Sans Serif'", color: '#70788F'}}} />
            </div>
          </div>
          <div className="control-group">
            <label>Zipcode:</label>
            <div className='input-wrapper'>
              <PostalCodeElement style={{base: {fontSize: '18px', fontFamily: "OpenSans, 'Sans Serif'", color: '#70788F'}}} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

@branch({})
class CheckoutForm extends Component {
  render() {
    const {fake} = this.props;
    return (
      <div className='inner-form'>
        {
          (!fake) &&
          <CardSection />
        }
        {
          (fake) &&
          <FakeCardSection />
        }
        <div className='powered-by-stripe'>
          <i className='fa fa-lock'></i> <img src={Django.static('images/powered_by_stripe.svg')} />
        </div>
      </div>
    );
  }
}

export default CheckoutForm;