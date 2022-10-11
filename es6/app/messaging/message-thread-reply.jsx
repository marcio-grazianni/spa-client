import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {ReplyHeader} from './reply-header'
import {ReplyBody} from './reply-body'
import {ReplyFooter} from './reply-footer'

@branch({})
class MessageThreadReply extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderMessageThreadReply() {
    return (
      <div className='reply-wrapper'>
        <div className='reply'>
          <ReplyHeader />
          <ReplyBody />
          <ReplyFooter />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderMessageThreadReply()
    );
  }
}

export { MessageThreadReply };