import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {ExportButton} from './export-button'
import {onChangeSection} from './actions'


@branch({
  start_date: ['feed', 'start_date'],
  end_date: ['feed', 'end_date'],
  selected: ['feed', 'selected_top_menu']
})
class FeedHeader extends Component {
  _renderFeedHeader() {
    const {start_date, end_date, selected} = this.props;
    let MenuItems = [{value: 'payments', label: 'payments'}, {value: 'reviews', label: 'reviews'}];
    return (
      <SectionHeader
        id="feed"
        icon="fa-rss"
        title="Feed"
        datePickerEnabled={false}
        startDate={start_date}
        endDate={end_date}
      >
        <TopMenu
          section="feed"
          selected={selected}
          MenuItems={MenuItems}
          onChange={onChangeSection}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderFeedHeader()
    );
  }
}

export { FeedHeader };