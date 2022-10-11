import React, {Component} from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import {StarRating} from '../star-rating'

class DonutArc extends Component {
  _renderDonutArc() {
    const {donutHeight, donutWidth, arcRadius, arcPadding, color, donutValue, max, paddingAmt} = this.props;

    // default paddingAmt is 1/3 of width
    let padding = Math.floor(donutWidth * 0.333333) + arcPadding;
    if (paddingAmt) {
      padding = Math.floor(donutWidth * paddingAmt) + arcPadding;
    }
    const tau = 2 * Math.PI;
    const radius = Math.max(donutWidth, donutHeight) / 1.5;
    const opacities = [1, 0]

    const pie = d3.layout.pie()
      .sort(null);

    const arc = d3.svg.arc()
      .innerRadius(radius - padding)
      .outerRadius(radius - (padding - arcRadius))
      .startAngle(0)
      .cornerRadius(20);

    const fauxDiv = ReactFauxDOM.createElement('div');

    const graph = d3.select(fauxDiv)
      .append("svg")
      .attr("width", donutWidth)
      .attr("height", donutHeight)
      .append("g")
      .attr("transform", "translate(" + donutWidth / 2 + "," + donutHeight / 2 + ") rotate(225)");

    const path = graph.append('path')
      .datum({
        endAngle: ((donutValue / max) * tau * 0.75)
      })
      .attr("fill", color)
      .attr("opacity", function(d, i) {
        return opacities[i]
      })
      .attr("d", arc)
    return (
      <div className='donut'>
        {fauxDiv.toReact()}
      </div>
    );
  }
  render() {
    return (
      ::this._renderDonutArc()
    );
  }
}

class DonutBG extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderDonutBG() {
    const {max} = this.props;
    return (
      <DonutArc
        arcRadius={3}
        arcPadding={0}
        color='#c1cae2'
        donutValue={max}
        {...this.props}
      />
    );
  }
  render() {
    return (
      ::this._renderDonutBG()
    );
  }
}

class DonutValue extends Component {
  _renderDonutValue() {
    let color = '#5B138D';
    if (this.props.arcColor) {
      color = this.props.arcColor;
    }
    return (
      <DonutArc
        arcRadius={5}
        arcPadding={1}
        color={color}
        donutValue={this.props.value}
        {...this.props}
      />
    );
  }
  render() {
    return (
      ::this._renderDonutValue()
    );
  }
}

class Score extends Component {
  _renderScore() {
    const {value, donutHeight, donutWidth, out_of, label, starRating, pct, labelColor} = this.props;
    let value_string = `${value}`;
    if (value < 0) {
      value_string = '–';
    }
    if (pct) {
      // if value is a pct, add pct sign
      value_string += '%';
    }
    return (
      <div className='score' style={{
          height: this.props.donutHeight,
          width: this.props.donutWidth
        }}
      >
        <div className='center'>
          <h3>{value_string}</h3>
          {
            (out_of) &&
            <div className='of-label'>
              of {out_of}
            </div>
          }
          {
            (starRating && value >= 0) &&
            <StarRating rating={value} />
          }
          {
            (label && !labelColor) &&
            <label>{label}</label>
          }
          {
            (label && labelColor) &&
            <label style={{color: labelColor}}>{label}</label>
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderScore()
    );
  }
}

class DashboardDonut extends Component {
  _renderDashboardDonut() {
    return (
      <div className='donut-graph'  style={{height: this.props.donutHeight, width: this.props.donutWidth}}>
        <div className='donut-wrapper' style={{height: this.props.donutHeight}}>
          <DonutBG {...this.props }/>
          <DonutValue {...this.props} />
        </div>
      <Score {...this.props} />
    </div>
    );
  }
  render() {
    return (
      ::this._renderDashboardDonut()
    );
  }
}

export { DashboardDonut };