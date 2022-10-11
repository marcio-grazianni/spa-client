import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Highlight from 'react-highlight'
import {copyCode} from './actions'

@branch({
  widget_code: ['widget', 'widget_code'],
})
class Code extends Component {
  _copyCode() {
    this.props.dispatch(copyCode)
  }
  _renderCode() {
    const {widget_code} = this.props;
    return(
      <li className='code'>
        <label className='edit-label'>
          <span className='section-name'><i className='fa fa-code'></i>Widget Code</span>
        </label>
        <div>
          <div className='code-wrapper'>
            <Highlight className='html'>{widget_code}</Highlight>
          </div>
          <button
	        type='button'
            className='btn btn-copy'
            onClick={::this._copyCode}
          >
	        Copy to Clipboard
          </button>
        </div>
      </li>
    )
  }
  render() {
    return (
      ::this._renderCode()
    );
  }
}

export { Code };