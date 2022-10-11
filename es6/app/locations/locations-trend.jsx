import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import {LineGraph} from '../UI/graphs/line-graph'
import {changeMouseOver} from './actions'

@branch({
  rank: ['locations', 'rank'],
  data: ['locations', 'current_location', 'series'],
  max: ['locations', 'current_location', 'max'],
  previous_node: ['locations', 'current_location', 'previous_node'],
  field: ['locations', 'active_field'],
})
class LocationsTrend extends Component {
  _changeMouseOver(index, hover_state) {
    this.props.dispatch(
      changeMouseOver,
      this.props.rank,
      index,
      hover_state
    )
  }
  _renderLocationsTrend() {
    const {data, max, field} = this.props;
    return (
      <div className='review-trend'>
        {
          (data) &&
          <div>
            <MediaQuery minWidth={1420}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                {...this.props}
                max={max[field]}
              />
            </MediaQuery>
            <MediaQuery minWidth={1200} maxWidth={1419}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                width={855}
                {...this.props}
                max={max[field]}
              />
            </MediaQuery>
            <MediaQuery maxWidth={1199}>
              <LineGraph
                onChangeMouseOver={::this._changeMouseOver}
                width={735}
                {...this.props}
                max={max[field]}
              />
            </MediaQuery>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderLocationsTrend()
    );
  }
}

export { LocationsTrend }
