import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Alert} from '../../profile-page/UI/alert'
import {InputBox, PhoneInputBox} from './input-box'
import {InputDropdown} from './input-dropdown'
import {changePatientName, changePatientEmail, changePhoneNumber, changeAppointmentType, appointmentInfoSubmit} from '../actions'

@branch({
  account_info: ['booking', 'appointment_info'],
  sending: ['booking', 'sending'],
  alert: ['alpha_alert'],
  vertical: ['vertical']
})
class AppointmentInfo extends Component {
  _changePatientName(e) {
    this.props.dispatch(
      changePatientName,
      e.currentTarget.value
    )
  }
  _changeEmail(e) {
    this.props.dispatch(
      changePatientEmail,
      e.currentTarget.value
    )
  }
  _changePhoneNumber(e) {
    this.props.dispatch(
      changePhoneNumber, e
    )
  }
  _changeAppointmentType(e) {
    this.props.dispatch(
      changeAppointmentType, e
    )
  }
  _nextStep() {
    this.props.dispatch(
      appointmentInfoSubmit
    );
  }
  render() {
    const {alert, sending, vertical} = this.props;
    const {name, phone_number, email, appointment_type} = this.props.account_info;
    return (
      <div className="appointpal-booking-step appointment-info">
        <div className="appointpal-booking-step-body appointment-info-body">
          <h2>Tell us about yourself.</h2>
          <div className="appointment-info-form">
              <form autoComplete="off">
                {
                  (alert) &&
                  <div className='alert-wrapper'>
                    <Alert alert={alert} alpha={true} />
                  </div>
                }
                <InputBox
                  id="name"
                  placeholder="Name"
                  input_type="text"
                  value={name.value}
                  error={name.error}
                  onChange={::this._changePatientName}
                />
                <PhoneInputBox
                  id="phone_number"
                  placeholder="Phone Number"
                  value={phone_number.value}
                  error={phone_number.error}
                  onChange={::this._changePhoneNumber}
                />
                <InputBox
                  id="email"
                  placeholder="Email"
                  input_type="email"
                  value={email.value}
                  error={email.error}
                  onChange={::this._changeEmail}
                />
                {
                  ('cosmetic-surgery' == vertical) &&
                  <InputDropdown
                    id="appointment_type"
                    title="Select Treatment"
                    tooltip="Please select the treatment you desire."
                    disabled={false}
                    value={appointment_type.value}
                    error={appointment_type.error}
                    Options={[
                    'Arm Lift', 'Body Contouring', 'BOTOX\u00ae', 'Brazilian Butt Lift', 'Breast Augmentation/Implants',
                    'Breast Lift', 'Breast Reduction', 'Brow Lift', 'Cheek Augmentation', 'Chemical Peel', 'Chin Surgery',
                    'CoolSculpting\u00ae', 'Eyelid Surgery', 'Facelift Surgery', 'Hair Transplant', 'Injectable Fillers',
                    'JUV\u00c9DERM\u00ae', 'Laser Hair Removal', 'Laser Skin Resurfacing', 'Liposuction',
                    'Male Breast Reduction Surgery', 'Mommy Makeover', 'Neck Lift', 'Restylane\u00ae', 'Rhinoplasty',
                    'Thigh Lift', 'Tummy Tuck', 'Other'
                    ]}
                    changeValue={::this._changeAppointmentType}
                  />
                }
                {
                  ('cosmetic-surgery' != vertical) &&
                  <InputDropdown
                    id="appointment_type"
                    title="Preferred Time"
                    tooltip="Please select your preferred appointment time."
                    disabled={false}
                    value={appointment_type.value}
                    error={appointment_type.error}
                    Options={['Morning', 'Afternoon', 'First Available']}
                    changeValue={::this._changeAppointmentType}
                  />
                }
              </form>
            </div>
        </div>
          <div className="button-wrapper appointpal">
            <button
              type='button'
              className='btn btn-confirm'
              onClick={::this._nextStep}
              disabled={sending}
            >
            Submit
            </button>
          </div>
      </div>
    );
  }
}

export { AppointmentInfo };