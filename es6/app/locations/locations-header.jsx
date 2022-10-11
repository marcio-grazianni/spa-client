import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {TopMenu} from '../UI/top-menu'
import {SectionHeader} from '../UI/section-header'
import {changeRange} from './actions'

@branch({
  selected: ['locations', 'selected_top_menu'],
  start_date: ['locations', 'start_date'],
  end_date: ['locations', 'end_date']
})
class LocationsHeader extends Component {
  _onDateChange(picker) {
    const {startDate, endDate} = picker;
    this.props.dispatch(
      changeRange,
      startDate,
      endDate
    )
  }
  _renderLocationsHeader() {
    const {selected, start_date, end_date} = this.props;
    const MenuItems = [{value: 'leaderboard', label: 'leaderboard'}, {value: 'map', label: 'map'},];
    return (
      <SectionHeader
        id="locations"
        icon="fa-location-arrow"
        title="Locations"
        datePickerEnabled={true}
        startDate={start_date}
        endDate={end_date}
        onDateChange={::this._onDateChange}
      >
        <TopMenu
          section="locations"
          selected={selected}
          MenuItems={MenuItems}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderLocationsHeader()
    );
  }
}

export { LocationsHeader };