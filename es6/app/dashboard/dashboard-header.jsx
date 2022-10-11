import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {changeRange, onChangeSection} from './actions'

@branch({
  start_date: ['dashboard', 'start_date'],
  end_date: ['dashboard', 'end_date'],
  selected: ['dashboard', 'selected_top_menu'],
})
class DashboardHeader extends Component {
  _onDateChange(picker) {
    const {startDate, endDate} = picker;
    this.props.dispatch(
      changeRange,
      startDate,
      endDate
    )
  }
  _renderDashboardHeader() {
    const {start_date, end_date, selected} = this.props;
    let MenuItems = [{value: 'payments', label: 'payments'}, {value: 'pxi', label: 'pxi'}];
    return (
      <SectionHeader
        id="dashboard"
        icon="fa-dashboard"
        title="Dashboard"
        datePickerEnabled={true}
        startDate={start_date}
        endDate={end_date}
        onDateChange={::this._onDateChange}
      >
        <TopMenu
          section="dashboard"
          selected={selected}
          MenuItems={MenuItems}
          onChange={onChangeSection}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderDashboardHeader()
    );
  }
}

export { DashboardHeader };