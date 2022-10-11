import React, {Component} from 'react'
import {StructuredContentHeader, UnstructuredContentHeader} from './inbound-content-header'
import {StructuredContentFooter, UnstructuredContentFooter} from './inbound-content-footer'


class InboundMessageContent extends Component {
  _renderInboundMessageContent() {
    const {message} = this.props;
    const {body, meta_data} = this.props.message;
    return (
      <div className='content-wrapper'>
      {
        (body !== null) &&
        <div className='content'>
          <UnstructuredContentHeader message={message} />
          <UnstructuredContentFooter message={message} />
        </div>
      }
      {
        (body === null) &&
        <div className='content'>
          <StructuredContentHeader message={message} />
          <StructuredContentFooter message={message} />
        </div>
      }
      </div>
    );
  }
  render() {
    return (
      ::this._renderInboundMessageContent()
    );
  }
}

export { InboundMessageContent };