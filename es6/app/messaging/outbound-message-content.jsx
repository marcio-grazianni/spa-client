import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import {deleteInvoiceConfirm} from './actions'
import {openInvoiceEditor} from '../activity/actions'
import payment from "../payment/state";


class InvoiceInnerContent extends Component {
  _confirmDeleteInvoice() {
    const {invoice_id} = this.props.message.meta_data;
    this.props.dispatch(
      deleteInvoiceConfirm,
      invoice_id
    );
  }
  _showInvoice(e) {
    const {invoice_id, invoice_status} = this.props.message.meta_data;
    const draft = invoice_status <= 2;
    if(draft) {
      this.props.dispatch(
        openInvoiceEditor,
        invoice_id
      );
      return;
    }
    const invoice_url = '/payments/pay-invoice/' + invoice_id + '/';
    window.open(invoice_url);
  }
  _viewReceipt(e) {
    const {paid_transaction_id} = this.props.message.meta_data;
    const receipt_url = '/api/transactions/' + paid_transaction_id + '/view-receipt/';
    window.open(receipt_url);
  }
  _renderInvoiceInnerContent() {
    const {created_at} = this.props.message;
    const {invoice_status, invoice_number, invoice_amount, due_date, paid, receipt_sent, paid_transaction_id, provider} = this.props.message.meta_data;
    const draft = invoice_status <= 2;
    const refunded = invoice_status == 9;
    let bold_text = `#${invoice_number} for ${invoice_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
    let regular_text = ' saved as draft.';
    if(!draft) {
      if(paid) {
        const verb = refunded ? 'refunded' : 'succeeded';
        bold_text = `#${invoice_number} payment ${verb} for ${invoice_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        regular_text = receipt_sent ? ', receipt sent.' : '.';
      } else {
        bold_text = `Invoice #${invoice_number} for ${invoice_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        regular_text = ` sent, due on ${due_date}`;
      }
    }
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='structured-wrapper'>
            <div className='from-wrapper clickable' onClick={paid_transaction_id ? :: this._viewReceipt : ::this._showInvoice}>
              <div className='from-info'>
                <div className='structured-text'>
                  <span className="structured-bold">{bold_text}</span>
                  <span>{regular_text}</span>
                </div>
                {
                  provider &&
                    <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
                }
              </div>
            </div>
            <div className='meta'>
              <div className='meta-icon'>
              {
                draft &&
                <i className='fa fa-trash clickable' onClick={::this._confirmDeleteInvoice}></i>
              }
              {
                !draft && !paid &&
                <i className='fa fa-file-text'></i>
              }
              {
                !draft && paid &&
                <i className='fa fa-check'></i>
              }
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInvoiceInnerContent()
    );
  }
}

class ReceiptInnerContent extends Component {
  _viewReceipt(e) {
    const {transaction_id} = this.props.message.meta_data;
    const receipt_url = '/api/transactions/' + transaction_id + '/view-receipt/';
    window.open(receipt_url);
  }
  _renderReceiptInnerContent() {
    const {created_at} = this.props.message;
    const {transaction_id, invoice_id, invoice_number, payment_amount, transaction_status, receipt_sent, provider} = this.props.message.meta_data;
    const refunded = transaction_status === 7;
    let amount = parseFloat(payment_amount);
    amount = isNaN(amount) ? payment_amount : amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const verb = refunded ? 'refunded' : 'succeeded';
    const bold_text = `#${invoice_number} payment ${verb} for ${amount}`;
    const regular_text = receipt_sent ? ', receipt sent.' : '.';
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='structured-wrapper'>
            <div className='from-wrapper clickable' onClick={::this._viewReceipt}>
              <div className='from-info'>
                <div className='structured-text'>
                  <span className="structured-bold">{bold_text}</span>
                  <span>{regular_text}</span>
                </div>
                {
                    provider &&
                    <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
                }
              </div>
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-check'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReceiptInnerContent()
    );
  }
}

class ReviewInviteInnerContent extends Component {
  _renderReviewInviteInnerContent() {
    const {created_at} = this.props.message;
    const {provider} = this.props.message.meta_data;
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='structured-wrapper'>
            <div className='from-wrapper'>
              <div className='from-info'>
                <div className='structured-text'>
                  <span className="structured-bold">Review invite sent</span>
                </div>
                {
                    provider &&
                    <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
                }
              </div>
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-star'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewInviteInnerContent()
    );
  }
}

class IntakeFormInnerContent extends Component {
  _renderIntakeFormInnerContent() {
    const {created_at} = this.props.message;
    const {provider} = this.props.message.meta_data;
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='structured-wrapper'>
            <div className='from-wrapper'>
              <div className='from-info'>
                <div className='structured-text'>
                  <span className="structured-bold">Patient intake form sent</span>
                </div>
                {
                    provider &&
                    <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
                }
              </div>
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-clipboard'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderIntakeFormInnerContent()
    );
  }
}

@branch({
  account_name: ['account', 'account_name']
})
class NoteInnerContent extends Component {
  _renderNoteInnerContent() {
    const {message, account_name} = this.props;
    const {from, created_at, body} = this.props.message;
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='note-header'>
            <div className='from-wrapper'>
              <div className='from-info'>
                <div className='from'>{from} at {account_name} left a note</div>
              </div>
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-sticky-note'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
        <div className='reply-entry'>
          <p dangerouslySetInnerHTML={{__html: body}} />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderNoteInnerContent()
    );
  }
}


@branch({
  account_name: ['account', 'account_name']
})
class AppointmentInnerContent extends Component {
  _renderAppointmentInnerContent() {
    const {message, account_name} = this.props;
    const {from, created_at, body} = this.props.message;
    const {appointment_data, type, provider} = this.props.message.meta_data;
    const message_type = 'appointment_reminder' === type ? 'reminder' : 'confirmation';
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='note-header'>
            <div className='from-wrapper'>
              <div className='from-info'>
                <div className='from'>Appointment {message_type} sent</div>
              </div>
              {
                  provider &&
                  <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
              }
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-calendar'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
        <div className='reply-entry'>
          <p>{body}</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentInnerContent()
    );
  }
}

@branch({
})
class RecareInnerContent extends Component {
  _renderRecareInnerContent() {
    const {message} = this.props;
    const {created_at, body} = this.props.message;
    const {provider} = this.props.message.meta_data;
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='note-header'>
            <div className='from-wrapper'>
              <div className='from-info'>
                <div className='from'>Recare Notification Sent</div>
              </div>
              {
                  provider &&
                  <div className='provider-info'><i className="fa fa-user-md"></i>{provider}</div>
              }
            </div>
            <div className='meta'>
              <div className='meta-icon'>
                <i className='fa fa-bell'></i>
              </div>
              <div className='timestamp'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
        </div>
        <div className='reply-entry'>
          <p>{body}</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderRecareInnerContent()
    );
  }
}

class StructuredInnerContent extends Component {
  _renderStructuredInnerContent() {
    const {message} = this.props;
    const {type} = this.props.message.meta_data;
    const invoice = 'invoice' === type;
    const payment = 'payment' === type;
    const review_invite = 'review_invite' === type;
    const intake_form = 'intake_form' === type;
    const note = 'note' === type;
    const confirmation = 'appointment_confirmation' === type || 'reply_confirmation' === type;
    const reminder = 'appointment_reminder' === type;
    const appointment = confirmation || reminder;
    const recare = 'appointment_followup' === type;
    return (
      <div>
      {
        invoice &&
        <InvoiceInnerContent {...this.props} />
      }
      {
        payment &&
        <ReceiptInnerContent {...this.props} />
      }
      {
        review_invite &&
        <ReviewInviteInnerContent {...this.props} />
      }
      {
        intake_form &&
        <IntakeFormInnerContent {...this.props} />
      }
      {
        note &&
        <NoteInnerContent {...this.props} />
      }
      {
        appointment &&
        <AppointmentInnerContent {...this.props} />
      }
      {
        recare &&
        <RecareInnerContent {...this.props} />
      }
      </div>
    );
  }
  render() {
    return (
      ::this._renderStructuredInnerContent()
    );
  }
}

@branch({
  account_name: ['account', 'account_name']
})
class UnstructuredInnerContent extends Component {
  _renderUnstructuredInnerContent() {
    const {account_name} = this.props;
    const {from, created_at, body} = this.props.message;
    return (
      <div className='reply replied'>
        <div className='reply-header-wrapper'>
          <div className='reply-header'>
            <div className='from-wrapper'>
              <label className='from-label'>
                From
              </label>
              <div className='from-info'>
                <div className='from'>{from} at {account_name}</div>
                <div className='date'>{moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
              </div>
            </div>
            <div className='reply-icon replied'>
              <i className='fa fa-reply'></i>
            </div>
          </div>
        </div>
        <div className='reply-entry'>
          <p>{body}</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUnstructuredInnerContent()
    );
  }
}

@branch({
  account_name: ['account', 'account_name']
})
class OutboundMessageContent extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderOutboundMessageContent() {
    const {meta_data} = this.props.message;
    const structured = meta_data && meta_data.type;
    return (
      <div className='reply-wrapper'>
        {
          structured &&
          <StructuredInnerContent {...this.props} />
        }
        {
          !structured &&
          <UnstructuredInnerContent {...this.props} />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderOutboundMessageContent()
    );
  }
}

export { OutboundMessageContent };