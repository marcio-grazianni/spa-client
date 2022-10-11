import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'


@branch({
  account_name: ['account_name'],
  appointment: ['appointment'],
})
class Header extends Component {
  _renderHeader() {
    const {account_name} = this.props;
    const {action} = this.props.appointment;
    const confirm = 'confirm' === action;
    const verb = confirm ? 'Confirm' : 'Request';
    return(
      <div className="appointpal-header">
        <a className="logo" href="https://www.appointpal.com">
          <img src={Django.static('images/appointpal/banner-logo.png')} />
        </a>
        <div className="book-appointment-header appointpal">
          {verb} Appointment <span className="book-appointment-header-sm">{account_name}</span>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderHeader()
    );
  }
}

export { Header };
