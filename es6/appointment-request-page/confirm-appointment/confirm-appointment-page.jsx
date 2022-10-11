import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {ConfirmAppointment} from './confirm-appointment'

@branch({
})
class ConfirmAppointmentPage extends Component {
  _renderConfirmAppointmentPage() {
    return(
      <div id="validationApp" className="newApp appointpal">
        <div>
          <ConfirmAppointment />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderConfirmAppointmentPage()
    );
  }
}

export { ConfirmAppointmentPage };
