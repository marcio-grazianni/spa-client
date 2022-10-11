import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
})
class StructuredOutboundPreviewContent extends Component {
  _renderStructuredOutboundPreviewContent() {
    const {body, meta_data} = this.props.message;
    let content = body;
    if('invoice' == meta_data.type) {
      const {invoice_amount, invoice_status, paid, receipt_sent} = meta_data;
      const formatted_amount = invoice_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const draft = invoice_status <= 2;
      const refunded = invoice_status == 9;
      let last_action = 'invoice saved';
      if(refunded) {
        last_action = 'payment refunded';
      } else if(receipt_sent) {
        last_action = 'receipt sent';
      } else if(paid) {
        last_action = 'payment succeeded';
      } else if(!draft) {
        last_action = 'invoice sent';
      }
      content = `${formatted_amount} ${last_action}`;
    } else if ('intake_form' == meta_data.type) {
      content = 'Intake Form Sent';
    } else if ('payment' == meta_data.type) {
      const {payment_amount, transaction_status, receipt_sent} = meta_data;
      const amount = parseFloat(payment_amount);
      const formatted_amount = isNaN(amount) ? payment_amount : amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const refunded = transaction_status == 7;
      let last_action = 'payment succeeded';
      if(refunded) {
        last_action = 'payment refunded';
      } else if(receipt_sent) {
        last_action = 'receipt sent';
      }
      content = `${formatted_amount} ${last_action}`;
    } else if ('appointment_confirmation' == meta_data.type || 'reply_confirmation' == meta_data.type) {
      content = 'Appointment Confirmation Sent';
    } else if ('appointment_reminder' == meta_data.type) {
      content = 'Appointment Reminder Sent';
    } else if ('appointment_followup' == meta_data.type) {
      content = 'Recare Notification Sent';
    }
    return (
      <div className='comments'>
        <div className='message-type'>
          {content}
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStructuredOutboundPreviewContent()
    );
  }
}

export { StructuredOutboundPreviewContent };