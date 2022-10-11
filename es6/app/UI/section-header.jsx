import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {DatePicker} from './date-picker'
import {Alert} from '../UI/alert'

@branch({
  alert: ['alert'],
  onboarding_complete: ['account', 'onboarding_complete'],
  accepting_payments: ['appointpal', 'accepting_payments']
})
class SectionHeader extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  _renderSectionHeader() {
    const {alert, onboarding_complete, accepting_payments} = this.props;
    const iconClass = classnames('fa', this.props.icon);
    const {datePickerEnabled, startDate, endDate, onDateChange} = this.props;
    let permanent_alert = false;
    if(onboarding_complete && !accepting_payments) {
      permanent_alert = {
        body: 'Accept payments:<br><div class="subtitle">Verify your account to receive payments with micro-deposits or Plaid.</div>',
        alert_type: 'info',
        permanent: true
      }
    }
    return (
      <div className='main-header-wrapper'>
        {
          permanent_alert &&
          <div className='alert-wrapper'>
            <Alert alert={permanent_alert} alpha={true} />
          </div>
        }
        {
          alert &&
          <div className='alert-wrapper'>
            <Alert alert={alert} />
          </div>
        }
        <div className='main-header'>
          <h2>
            <i className={iconClass}></i>{this.props.title}
          </h2>
          {
            datePickerEnabled &&
            <DatePicker
              id="dashboard"
              start_date={startDate}
              end_date={endDate}
              onDateChange={onDateChange}
            />
          }
          {this.props.children}
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSectionHeader()
    );
  }
}


export { SectionHeader };