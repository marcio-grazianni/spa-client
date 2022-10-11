import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {initialLoad} from '../../profile-page/actions'
import {BookAppointment} from './book-appointment'

@branch({
  booking_step: ['booking', 'booking_step']
})
class BookAppointmentPage extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  _renderBookAppointmentPage() {
    const {booking_step} = this.props;
    return(
      <div id="validationApp" className="newApp appointpal">
        <div>
          <BookAppointment />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderBookAppointmentPage()
    );
  }
}

export { BookAppointmentPage };
