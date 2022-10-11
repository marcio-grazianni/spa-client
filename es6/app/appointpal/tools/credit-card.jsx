import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection, handleInputChange} from './actions'
import {openUpdateCreditCardPrompt} from '../credit_card/actions'


@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'credit_card'],
  details: ['messages', 'mini_profile'],
})
class CreditCard extends Component {
  _expandCreditCard() {
    this.props.dispatch(
      toggleExpandedSection,
      'credit_card'
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      openUpdateCreditCardPrompt
    );
  }
  _renderCreditCard() {
    const {expanded, details} = this.props;
    let card_number = '';
    let card_expiry = '';
    let card_brand = '';
    if(details) {
      card_number = details.card_number ? details.card_number : card_number;
      card_expiry = details.card_expiry ? details.card_expiry : card_expiry;
      card_brand = details.card_brand ? details.card_brand : card_brand;
    }
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='payments'>
        <label className='edit-label' onClick={::this._expandCreditCard}>
          <span className='section-name'><i className='fa fa-credit-card'></i>Credit Card</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className="payments-body">
            <div id='PaymentForm'>
              <form onSubmit={::this._handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <small>Card Number</small>
                    <input
                      type="tel"
                      name="number"
                      className="form-control"
                      value={card_number}
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    <small>Brand</small>
                    <input
                      type="text"
                      name="brand"
                      className="form-control"
                      value={card_brand}
                      disabled
                    />
                  </div>
                  <div className="col-sm-4">
                    <small>Expiration</small>
                    <input
                      type="tel"
                      name="expiry"
                      className="form-control"
                      value={card_expiry}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-success btn-block">Update</button>
                </div>
              </form>
            </div>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderCreditCard()
    );
  }
}

export { CreditCard };