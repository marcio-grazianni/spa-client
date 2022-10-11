import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {BookAppointmentHeader} from './book-appointment-header'
import {submitNewPatient} from '../../actions'

@branch({
  vertical: ['vertical'],
})
class SelectNewPatient extends Component {
  _newPatientNextStep() {
    this.props.dispatch(submitNewPatient, 1);
  }
  _existingPatientNextStep() {
    this.props.dispatch(submitNewPatient, 0);
  }
  render() {
    const {vertical} = this.props;
    let HealthCareVerticals = ['cosmetic-surgery', 'dentistry', 'healthcare', 'healthcare-lite'];
    let customer_language = 'client';
    if (HealthCareVerticals.includes(vertical)) {
      customer_language = 'patient';
    } else if (vertical === 'saas' || vertical === 'auto') {
      customer_language = 'customer';
    }
    return (
      <div className="select-new-patient">
        <BookAppointmentHeader />
        <div className="select-new-patient-body">
          <h2>Are you a new {customer_language}?</h2>
          <div className='button-wrapper'>
            <button
              type='button'
              className='btn btn-confirm btn-top'
              onClick={::this._newPatientNextStep}
            >
            Yes
            </button>
          </div>
          <div className='button-wrapper'>
            <button
              type='button'
              className='btn'
              onClick={::this._existingPatientNextStep}
            >
            No
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export { SelectNewPatient };