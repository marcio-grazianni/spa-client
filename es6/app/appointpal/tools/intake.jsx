import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection} from './actions'
import {sendIntakeForm} from '../intake/actions'

@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'intake'],
  sending: ['appointpal', 'tools', 'intake', 'sending']
})
class PatientIntake extends Component {
  _expandPatientIntake() {
    this.props.dispatch(
      toggleExpandedSection,
      'intake'
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      sendIntakeForm
    );
  }
  _renderPatientIntake() {
    const {expanded, sending} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='review'>
        <label className='edit-label' onClick={::this._expandPatientIntake}>
          <span className='section-name'><i className='fa fa-clipboard'></i>Intake</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className='review-body'>
            <form onSubmit={::this._handleSubmit}>
              <div className="form-actions">
                <button className="btn btn-success btn-block" disabled={sending}>Send Intake Form</button>
              </div>
            </form>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderPatientIntake()
    );
  }
}

export { PatientIntake };