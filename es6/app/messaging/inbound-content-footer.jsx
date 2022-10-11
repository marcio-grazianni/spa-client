import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'

@branch({
  vertical: ['account', 'vertical']
})
class StructuredContentFooter extends Component {
  constructor(props, context) {
    super(props, context);
  }

  _renderStructuredContentFooter() {
    const {vertical} = this.props;
    const {appointment_type} = this.props.message.meta_data;
    return (
      <div className='content-reply appointment-request-header'>
        <ul>
        {
          ('cosmetic-surgery' == vertical) &&
          <li><label>Type</label>: {appointment_type}</li>
        }
        {
          ('cosmetic-surgery' != vertical) &&
          <li><label>Preferred Time</label>: {appointment_type}</li>
        }
        </ul>
      </div>
    );
  }

  render() {
    return (
      ::this._renderStructuredContentFooter()
    );
  }
}

class UnstructuredContentFooter extends Component {
  constructor(props, context) {
    super(props, context);
  }

  _renderDangerously(body) {
    return (
      <div className='content-reply'>
        <p dangerouslySetInnerHTML={{__html: body}} />
      </div>
    );
  }

  _renderUnstructuredContentFooter() {
    const {body, html, meta_data} = this.props.message;
    if(meta_data) {
      const content = html ? html : body;
      return (
        ::this._renderDangerously(content)
      );
    }
    return(
      <div className='content-reply'>
        <pre>{body}</pre>
      </div>
    );
  }

  render() {
    return (
      ::this._renderUnstructuredContentFooter()
    );
  }
}

export { StructuredContentFooter, UnstructuredContentFooter };