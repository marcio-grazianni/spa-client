import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {bookAppointment} from '../actions'

@branch({
})
class BookAppointmentButton extends Component {
  _bookAppointment() {
    this.props.dispatch(bookAppointment);
  }
  _renderBookAppointmentButton() {
    return(
      <button
        type='button'
        className='btn btn-confirm btn-get-started'
        onClick={::this._bookAppointment}
      >
        Book Appointment
      </button>
    );
  }
  render() {
    return(
      ::this._renderBookAppointmentButton()
    );
  }
}

export { BookAppointmentButton };