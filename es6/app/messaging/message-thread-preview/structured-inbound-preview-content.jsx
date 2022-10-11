import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
})
class StructuredInboundPreviewContent extends Component {
  _renderStructuredInboundPreviewContent() {
    const {vertical} = this.props;
    const {appointment_type, message_type, type_specific_field} = this.props.message_thread;

    const is_question = 'question' === message_type;
    let truncated_question = null;
    let title = 'Appointment Request';
    if (is_question) {
      title = 'Ask a Doctor';
      truncated_question = type_specific_field;
      if (truncated_question.length > 25) {
        truncated_question = truncated_question.substring(0,25) + '...';
      }
    }

    return (
      <div className='comments'>
        <div className='message-type'>
          {title}
        </div>
        {
          is_question &&
          <div className='message-subtype'>
            Question: {truncated_question}
          </div>
        }
        {
          (!is_question) && ('cosmetic-surgery' == vertical) &&
          <div className='message-subtype'>
            Type: {appointment_type}
          </div>
        }
        {
          (!is_question) && ('cosmetic-surgery' != vertical) &&
          <div className='message-subtype'>
            Preferred Time: {appointment_type}
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderStructuredInboundPreviewContent()
    );
  }
}

export { StructuredInboundPreviewContent };