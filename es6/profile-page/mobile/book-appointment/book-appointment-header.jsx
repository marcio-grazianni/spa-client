import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
  account_name: ['account_name'],
})
class BookAppointmentHeader extends Component {
  render() {
    const {account_name} = this.props;
    return (
      <div className="book-appointment-header">
        Book Appointment <span className="book-appointment-header-sm">{account_name}</span>
      </div>
    );
  }
}

export { BookAppointmentHeader };