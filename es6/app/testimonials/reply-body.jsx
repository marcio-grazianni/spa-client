import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeReplyContent} from './actions'

@branch({
  reply_content: ['testimonials', 'reply_content'],
  error: ['testimonials', 'errors', 'reply']
})
class ReplyBody extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _changeReplyContent(e) {
    this.props.dispatch(
      changeReplyContent,
      e.target.value
    )
  }
  _renderReplyBody() {
    const {reply_content, error} = this.props;
    const body_class = classnames('reply-entry', {'error': error})
    return (
      <div className={body_class}>
        <textarea
          value={reply_content}
          onChange={::this._changeReplyContent}
          placeholder="Write here..."
        />
      </div>
    );
  }
  render() {
    return (
      ::this._renderReplyBody()
    );
  }
}

export { ReplyBody };