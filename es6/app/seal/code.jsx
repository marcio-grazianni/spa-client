import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Highlight from 'react-highlight'
import {toggleExpandedSection, copyCode} from './actions'

@branch({
  expanded: ['seal', 'expanded', 'code'],
  seal_code: ['seal', 'seal_code'],
})
class Code extends Component {
  _expandCode() {
    this.props.dispatch(
      toggleExpandedSection,
      'code'
    )
  }
  _copyCode() {
    this.props.dispatch(copyCode)
  }
  _renderCode() {
    const {expanded, seal_code} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='code'>
        <label className='edit-label' onClick={::this._expandCode}>
          <span className='section-name'><i className='fa fa-code'></i>Seal Code</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        { 
          (expanded) &&
          <div>
            <div className='code-wrapper'>
              <Highlight className='html'>{seal_code}</Highlight>
            </div>
            <button
              type='button'
              className='btn btn-copy'
              onClick={::this._copyCode}
            >
              Copy to Clipboard
            </button>
          </div>
        }
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