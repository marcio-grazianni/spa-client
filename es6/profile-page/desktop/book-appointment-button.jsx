import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {bookAppointment} from '../actions'

@branch({
  vertical: ['vertical']
})
class BookAppointmentButton extends Component {
  _bookAppointment() {
    this.props.dispatch(bookAppointment);
  }
  _renderBookAppointmentButton() {
    const {vertical} = this.props;
    let book_appointment_text = "Book Appointment";
    if ('saas' === vertical) {
      book_appointment_text = "Book Demo";
    }
    return(
      <button
        type='button'
        className='btn btn-confirm btn-get-started'
        onClick={::this._bookAppointment}
      >
        {book_appointment_text}
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