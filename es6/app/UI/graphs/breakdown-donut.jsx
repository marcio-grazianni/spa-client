import React, {Component} from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'

class DonutCenter extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderDonutCenter() {
    return (
      <div
        className='score'
        style={{height: 215}}
      >
        <div className='center'>
          {this.props.children}
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderDonutCenter()
    );
  }
}

class Legend extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderLegend() {
    return (
      <ul className='legend'>
        {this.props.children}
      </ul>
    );
  }
  render() {
    return (
      ::this._renderLegend()
    );
  }
}

class BreakdownDonut extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderBreakdownDonut() {
    const {data} = this.props;
    const width = 210;
    const height = 210;
    const padding = Math.floor(width * 0.3);
    const arcWidth = 20;
    const radius = Math.max(width, height) / 1.5;

    function getSum(total, num) {
      return total + num;
    }

    const total = data.reduce(getSum);

    const color = d3.scale
      .ordinal()
      .range(['#4E224E', '#6D236D', '#893989', '#D4327F', '#F18ABB']);

    const tau = 2 * Math.PI;

    const arc = d3.svg.arc()
      .innerRadius((radius - arcWidth) - padding)
      .outerRadius(radius - padding);

    const pie = d3.layout.pie()
      .value((d) => {return d})
      .sort(null);

    const fauxDiv = ReactFauxDOM.createElement('div');

    const donut = d3.select(fauxDiv)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let path;

    if (total > 0) {
      path = donut.selectAll('path')
        .data(pie(data))
        .enter().append("path")
        .attr('d', arc)
        .attr('fill', (d, i) => {return color(i)});
    } else {
      path = donut.selectAll('path')
        .data(pie([100]))
        .enter().append("path")
        .attr('d', arc)
        .attr('fill', '#c1cae2')
        .attr('opacity', 0.5);
    }

    return (
      <div className='breakdown-graph'>
        <div className='donut-wrapper'>
          {fauxDiv.toReact()}
        </div>
        {this.props.children}
      </div>
    );
  }
  render() {
    return (
      ::this._renderBreakdownDonut()
    );
  }
}

export { DonutCenter, Legend, BreakdownDonut };