import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {DashboardDonut} from '../../UI/graphs/dashboard-donut'

class SXIDonut extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderSXIDonut() {
    const {height, width} = this.props
    let average = 0; //if average is -1 (no data) set to 0
    (this.props.average > 0) ? (average = Math.round(this.props.average)) : (average = 0);
    const max = 100; //max sxi = 100
    let label = "PXI";
    return (
      <DashboardDonut
        value={average}
        max={max}
        label={label}
        donutHeight={height}
        donutWidth={width}
      />
    );
  }
  render() {
    return (
      ::this._renderSXIDonut()
    );
  }
}

@branch({
  average: ['dashboard', 'sxi', 'average']
})
class SXIAverage extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderSXIAverage() {
    const height = 100;
    const width = 100;
    const {average} = this.props;
    return (
      <div className='sxi-average-wrapper'>
        <div
          className='sxi-average'
          style={{
            height: height,
            width: width
          }}>
          <SXIDonut
            height={height}
            width={width}
            average={average}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSXIAverage()
    );
  }
}

export { SXIAverage };