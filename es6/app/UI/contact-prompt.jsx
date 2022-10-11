import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {Alert} from '../UI/alert'
import {changeContactInputValue, submitContactPrompt} from '../actions'

@branch({
  contact_inputs: ['contact_inputs'],
  alert: ['alpha_alert'],
})
class ContactPrompt extends Component {
  componentDidMount() {
  }
  _changeValue(e) {
    this.props.dispatch(
      changeContactInputValue,
      e.currentTarget.name,
      e.currentTarget.value,
    );
  }
  _submitContactPrompt(e) {
    e.preventDefault();
    this.props.dispatch(submitContactPrompt);
  }
  _renderContactPrompt() {
    const {contact_inputs, alert} = this.props;
    return (
    <div className="contact-wrapper">
      <div className='logo'>
        <img src={Django.static('images/SV_EnvelopeNew3.svg')} />
      </div>
      <form onSubmit={::this._submitContactPrompt}>
        {
          (alert) &&
          <div className='alert-wrapper'>
            <Alert alert={alert} alpha={true} />
          </div>
        }
        <p className='to-email'><b>To:</b> {contact_inputs.to_email}</p>
        <div className='input-wrapper'>
          <label>Subject:</label>
          <input
            name='subject'
            type='text'
            value={contact_inputs.subject}
            onChange={::this._changeValue}
          />
        </div>
        <div className='input-wrapper'>
          <label>Body:</label>
          <textarea
            name='body'
            value={contact_inputs.body}
            onChange={::this._changeValue}
          />
        </div>
        <button type='submit' className='btn btn-confirm'>
          Send Email
        </button>
      </form>
    </div>
    );
  }
  render() {
    return (
      ::this._renderContactPrompt()
    );
  }
}

export { ContactPrompt };