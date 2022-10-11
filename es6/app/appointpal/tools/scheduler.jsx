import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection} from './actions'

@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'scheduler'],
})
class Scheduler extends Component {
  _expandScheduler() {
    this.props.dispatch(
      toggleExpandedSection,
      'scheduler'
    )
  }
  _renderScheduler() {
    const {expanded} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='scheduler'>
        <label className='edit-label' onClick={::this._expandScheduler}>
          <span className='section-name'><i className='fa fa-calendar'></i>Scheduler</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className='scheduler-body'>
              <iframe src='https://schedule.nylas.com/subscribervoice-test-30min' frameBorder='0' />
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderScheduler()
    );
  }
}

export { Scheduler };