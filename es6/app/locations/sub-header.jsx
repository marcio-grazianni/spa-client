import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {DataTypeMenu} from './data-type-menu'

@branch({
  rank: ['locations', 'rank'],
  location: ['locations', 'current_location'],
  location_list: ['locations', 'location_list'],
})
class SubHeader extends Component {
  _renderSubHeader() {
    const {rank, location, location_list} = this.props;
    return (
      <div className='review-invite-header'>
        {
          (location) &&
          <div className='header-info'>
            <div className='name'>{location.name}</div>
            <div className='rank'><b>Ranked</b> {rank} out of {location_list.length}</div>
          </div>
        }
        <DataTypeMenu />
      </div>
    );
  }
  render() {
    return (
      ::this._renderSubHeader()
    );
  }
}

export { SubHeader };