import React, {Component} from 'react'
import {root, branch} from 'baobab-react/higher-order'
import tree from './state'
import {changeReceiveStatus, submitForm} from './actions'

@branch({
  company_name: ['company_name'],
  receive: ['receive'],
  confirmed: ['confirmed'],
})
class UnsubscribeInner extends Component {
  _handleChange(e) {
    this.props.dispatch(
      changeReceiveStatus,
      e.currentTarget.value,
    );
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(submitForm);
  }
  render() {
    const {company_name, receive, confirmed} = this.props;
    let regarding_text = '';
    if (company_name) {
        regarding_text = ' regarding ' + company_name;
    }
    return (
      <div id="validationApp" className="newApp">
        <div className="validation-wrapper main-wrapper">
          <div className='unsubscribe'>
            {
              (!confirmed) &&
              <div>
                <h2>Are you sure you want to unsubscribe?</h2>
                <p>You will not receive any further emails from appointpal{regarding_text}.</p>
                <form onSubmit={::this._handleSubmit}>
                  <div className='controls'>
                    <input type='radio' onChange={::this._handleChange} checked={!receive} value='not-receive' /> I no longer want to receive these emails
                  </div>
                  <div className='controls'>
                    <input type='radio' onChange={::this._handleChange} checked={receive} value='receive' /> Please keep me subscribed
                  </div>
                  <button className='btn btn-confirm' type='submit'>Submit</button>
                </form>
              </div>
            }
            {
              (confirmed && receive) &&
              <div className='confirmation'>
                <h2>Your changes have been confirmed.</h2>
              </div>
            }
            {
              (confirmed && !receive) &&
              <div className='confirmation'>
                <h2>You have been successfully unsubscribed.</h2>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

class UnsubscribePage extends Component {
  render() {
    return (
      <UnsubscribeInner />
    );
  }
}

const RootedUnsubscribePage = root(tree, UnsubscribePage);

module.exports = RootedUnsubscribePage;
