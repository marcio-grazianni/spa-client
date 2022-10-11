import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {changeRange} from './actions'

@branch({
  selected: ['reports', 'selected_top_menu'],
  start_date: ['reports', 'start_date'],
  end_date: ['reports', 'end_date'],
})
class ReportsHeader extends Component {
  _onDateChange(picker) {
    const {startDate, endDate} = picker;
    this.props.dispatch(
      changeRange,
      startDate,
      endDate
    )
  }
  _renderReportsHeader() {
    const {selected, start_date, end_date} = this.props;
    
    // TODO: keep configurable menu items in a seperate file
    const MenuItems = [{value: 'all', label: 'all'}, {value: 'weekly', label: 'weekly'}, {value: 'monthly', label: 'monthly'}];
    return (
      <SectionHeader
        id="reports"
        icon="fa-file-text-o"
        title="Reports"
        datePickerEnabled={true}
        startDate={start_date}
        endDate={end_date}
        onDateChange={::this._onDateChange}
      >
        <TopMenu
          section="reports"
          selected={selected}
          MenuItems={MenuItems}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderReportsHeader()
    );
  }
}

export { ReportsHeader };