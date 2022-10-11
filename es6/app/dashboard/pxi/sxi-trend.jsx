import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import {LineGraph} from '../../UI/graphs/line-graph'
import {changeMouseOver} from './actions'

@branch({
  sxi_data: ['dashboard', 'sxi', 'series'],
  previous_node: ['dashboard', 'sxi', 'previous_node'],
})
class SXITrend extends Component {
  _changeMouseOver(index, hover_state) {
    this.props.dispatch(
      changeMouseOver,
      index,
      hover_state
    )
  }
  _renderSXITrend() {
    const {sxi_data} = this.props;
    let data = [];
    if (sxi_data) {
      data = sxi_data;
    }
    return (
      <div className='sxi-trend'>
        <MediaQuery minWidth={1420}>
          <LineGraph
            field='sxi'
            onChangeMouseOver={::this._changeMouseOver}
            data={data}
            {...this.props}
          />
        </MediaQuery>
        <MediaQuery minWidth={1200} maxWidth={1419}>
          <LineGraph
            field='sxi'
            onChangeMouseOver={::this._changeMouseOver}
            width={840}
            data={data}
            {...this.props}
          />
        </MediaQuery>
        <MediaQuery maxWidth={1199}>
          <LineGraph
            field='sxi'
            onChangeMouseOver={::this._changeMouseOver}
            width={740}
            data={data}
            {...this.props}
          />
        </MediaQuery>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSXITrend()
    );
  }
}

export { SXITrend }