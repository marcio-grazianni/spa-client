import React, {Component} from 'react'
import classnames from 'classnames'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {changeRange, onChangeSection} from './actions'

@branch({
  selected: ['activity', 'selected_top_menu'],
  start_date: ['activity', 'start_date'],
  end_date: ['activity', 'end_date'],
  selected_account_id: ['account', 'selected_account_id'],
  selected_provider: ['account', 'selected_provider']
})
class ActivityHeader extends Component {
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id, start_date, end_date, selected_provider} = this.props;
    let prevProviderId = null;
    const prevProvider = prevProps.selected_provider;
    if(prevProvider) {
      prevProviderId = prevProvider.id;
    }
    let selected_provider_id = null;
    if(selected_provider) {
      selected_provider_id = selected_provider.id;
    }
    if(prevProps.selected_account_id !== selected_account_id || prevProviderId !== selected_provider_id) {
      this.props.dispatch(
        changeRange,
        start_date,
        end_date
      )
    }
  }
  _onDateChange(picker) {
    const {startDate, endDate} = picker;
    this.props.dispatch(
      changeRange,
      startDate,
      endDate
    )
  }
  _renderActivityHeader() {
    const {selected, start_date, end_date} = this.props;
    const datePickerEnabled = 'contacts' != selected && 'plans' != selected && 'subscriptions' != selected;
    let MenuItems = [{value: 'contacts', label: 'Patients'}, {value: 'payments', label: 'payments'}, {value: 'invoices', label: 'invoices'}, {value: 'review_invites', label: 'reviews'}, {value: 'plans', label: 'Recurring'}, {value: 'appointments', label: 'Schedule'}, {value: 'appointment_requests', label: 'Requests'}];
    return (
      <SectionHeader
        id="activity"
        icon="fa-tasks"
        title="Activity"
        datePickerEnabled={datePickerEnabled}
        startDate={start_date}
        endDate={end_date}
        onDateChange={::this._onDateChange}
        >
        <TopMenu
          section="activity"
          selected={selected}
          MenuItems={MenuItems}
          onChange={onChangeSection}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderActivityHeader()
    );
  }
}

export { ActivityHeader };