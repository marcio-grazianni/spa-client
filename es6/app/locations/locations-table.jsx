import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'
import {Table, Column, Cell} from 'fixed-data-table'
import {setActive} from './actions'
import {StarRating} from '../UI/star-rating'

class HeaderCell extends Component {
  render() {
    const {field} = this.props;
    const wrapper_class = classnames('header-wrapper', {'center-aligned': (field !== "Location")});
    return(
      <Cell>
        <div className={wrapper_class}>
          <span className='header'>{field}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  location_list: ['locations', 'location_list'],
  active_rank: ['locations', 'rank'],
})
class TextCell extends Component {
  _getLocation() {
    return this.props.location_list[this.props.rowIndex];
  }
  _setActive() {
    this.props.dispatch(
      setActive,
      this._getLocation().rank
    )
  }
  render() {
    const {location_list, active_rank, field, rowIndex} = this.props;
    const location = ::this._getLocation();
    const data = location[field];
    const wrapper_class = classnames('value-wrapper', {active: (active_rank === location.rank), 'center-aligned': (field !== "name")});
    return(
      <Cell>
        <div className={wrapper_class} onClick={::this._setActive}>
          <span className='value'>{data}</span>
        </div>
      </Cell>
    );
  }
}

@branch({
  location_list: ['locations', 'location_list'],
  active_rank: ['locations', 'rank'],
})
class RatingCell extends Component {
  _getLocation() {
    return this.props.location_list[this.props.rowIndex];
  }
  _setActive() {
    this.props.dispatch(
      setActive,
      this._getLocation().rank
    )
  }
  render() {
    const {location_list, active_rank, field, rowIndex} = this.props;
    const location = ::this._getLocation();
    const data = location[field];
    const wrapper_class = classnames('value-wrapper', 'center-aligned', {active: (active_rank === location.rank)});
    return(
      <Cell>
        <div className={wrapper_class} onClick={::this._setActive}>
          <span className='value'>
            <span className='rating-value'>{data}</span>
            {
              (data >= 0) &&
              <StarRating rating={data} />
            }
          </span>
        </div>
      </Cell> 
    );
  }
}

@branch({
  location_list: ['locations', 'location_list'],
})
class LocationsTable extends Component {
  _renderLocationsTable() {
    const {location_list} = this.props;
    return(
      <div className='table review-table'>        
        <MediaQuery minWidth={1420}>
          <Table
            rowsCount={location_list.length}
            headerHeight={40}
            rowHeight={40}
            width={1080}
            height={(40 * ((location_list.length) + 1)) + 2}
          >
            <Column
              header={<HeaderCell field='Rank' />}
              cell={<TextCell field='rank' />}
              width={216}
            />
            <Column
              header={<HeaderCell field='Location' />}
              cell={<TextCell field='name' />}
              width={432}
            />
            <Column
              header={<HeaderCell field='Rating' />}
              cell={<RatingCell field='rating' />}
              width={144}
            />
            <Column
              header={<HeaderCell field='Total Reviews' />}
              cell={<TextCell field='total_reviews' />}
              width={144}
            />
            <Column
              header={<HeaderCell field='Satisfaction' />}
              cell={<TextCell field='satisfaction' />}
              width={144}
            />
          </Table>
        </MediaQuery>
        <MediaQuery minWidth={1200} maxWidth={1419}>
          <Table
            rowsCount={location_list.length}
            headerHeight={40}
            rowHeight={40}
            width={810}
            height={(40 * ((location_list.length) + 1)) + 2}
          >
            <Column
              header={<HeaderCell field='Rank' />}
              cell={<TextCell field='rank' />}
              width={90}
            />
            <Column
              header={<HeaderCell field='Location' />}
              cell={<TextCell field='name' />}
              width={330}
            />
            <Column
              header={<HeaderCell field='Rating' />}
              cell={<RatingCell field='rating' />}
              width={130}
            />
            <Column
              header={<HeaderCell field='Total Reviews' />}
              cell={<TextCell field='total_reviews' />}
              width={130}
            />
            <Column
              header={<HeaderCell field='Satisfaction' />}
              cell={<TextCell field='satisfaction' />}
              width={130}
            />
          </Table>
        </MediaQuery>
        <MediaQuery maxWidth={1199}>
          <Table
            rowsCount={location_list.length}
            headerHeight={40}
            rowHeight={40}
            width={760}
            height={(40 * ((location_list.length) + 1)) + 2}
          >
            <Column
              header={<HeaderCell field='Rank' />}
              cell={<TextCell field='rank' />}
              width={80}
            />
            <Column
              header={<HeaderCell field='Location' />}
              cell={<TextCell field='name' />}
              width={320}
            />
            <Column
              header={<HeaderCell field='Rating' />}
              cell={<RatingCell field='rating' />}
              width={120}
            />
            <Column
              header={<HeaderCell field='Total Reviews' />}
              cell={<TextCell field='total_reviews' />}
              width={120}
            />
            <Column
              header={<HeaderCell field='Satisfaction' />}
              cell={<TextCell field='satisfaction' />}
              width={120}
            />
          </Table>
        </MediaQuery>
      </div>
    );
  }
  render() {
    return (
      ::this._renderLocationsTable()
    );
  }
}

export { LocationsTable }
