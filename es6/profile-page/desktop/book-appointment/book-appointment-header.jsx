import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
  account_name: ['account_name'],
  vertical: ['vertical']
})
class BookAppointmentHeader extends Component {
  render() {
    const {account_name, vertical} = this.props;
    let book_appointment_text = "Book Appointment";
    if ('saas' === vertical) {
      book_appointment_text = "Book Demo";
    }
    return (
      <div className="book-appointment-header">
        {book_appointment_text} <span className="book-appointment-header-sm">{account_name}</span>
      </div>
    );
  }
}

export { BookAppointmentHeader };