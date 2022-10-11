import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection, configureScheduler} from './actions'

@branch({
  expanded: ['seal', 'expanded', 'edit'],
})
class Edit extends Component {
  _expandEdit() {
    this.props.dispatch(
      toggleExpandedSection,
      'edit'
    )
  }
  _configureScheduler() {
    this.props.dispatch(
      configureScheduler
    )
  }
  _renderEdit() {
    const {expanded} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='edit'>
        <label className='edit-label' onClick={::this._expandEdit}>
          <span className='section-name'><i className='fa fa-calendar'></i>Configure Scheduler</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        { 
          (expanded) &&
          <div>
            <button
              type='button'
              className='btn btn-save'
              onClick={::this._configureScheduler}
            >
            Configure
            </button>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderEdit()
    );
  }
}

export { Edit };