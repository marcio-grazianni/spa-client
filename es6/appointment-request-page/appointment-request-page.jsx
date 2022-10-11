import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {root} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import tree from './state'
import {BookAppointmentPage} from './book-appointment/book-appointment-page'
import {ConfirmAppointmentPage} from './confirm-appointment/confirm-appointment-page'

@branch({
  appointment: ['appointment']
})
class AppointmentRequestPage extends Component {
  _renderAppointmentRequestPage() {
    const {action} = this.props.appointment;
    const confirm = 'confirm' === action;
    const book = !confirm;
    return(
      <div>
        {
          (confirm) &&
          <ConfirmAppointmentPage />
        }
        {
          (book) &&
          <BookAppointmentPage />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentRequestPage()
    );
  }
}

const RootedAppointmentRequestPage = root(tree, AppointmentRequestPage);

module.exports = RootedAppointmentRequestPage;
