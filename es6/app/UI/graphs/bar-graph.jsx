import React, {Component} from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'

class Graph extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderGraph() {
    let roundUpTens = (i) => {return (Math.floor((i / 10)) * 10) + 10}

    const {width, xGrid, pctLabels, xLabels, values} = this.props;
    let {max, barHeight, barPadding, textAdjust, gridAdjust} = this.props;
    if (!max) {
      max = roundUpTens(d3.max(values));
    }

    if (!barHeight) {
      // Default barHeight is 35px
      barHeight = 35;
    }

    if (!barPadding) {
      // Default barHeight is 20px
      barPadding = 20;
    }

    if (!textAdjust) {
      /* Text adjust sets the vertical positioning of text 
         Default Value is 0 */
      textAdjust = 0;
    }

    if (!gridAdjust) {
      /* Grid adjust sets the vertical positioning of text 
         Default Value is 0 */
      gridAdjust = 0;
    }


    //Calculate height of graph. 
    let height = ((barHeight + barPadding) * values.length) - 5


    let pctValues = values.map((v) => Math.round((v / max) * 100));

    let xMax = roundUpTens(d3.max(pctValues)); //We will change x range of graph based on max pct Value (rounded up to nearest 10)
    let tickMulti, numLines;
    if (xMax >= 100) {
      xMax = 100;
      tickMulti = 20;
      numLines = (xMax / tickMulti);
    }
    else if (xMax >= 50) {
      //if not divisible by 20 and add 10 to max
      if ((xMax % 20) != 0) {
        xMax += 10;
      }
      tickMulti = 20;
      numLines = (xMax / tickMulti);
    }
    else {
      tickMulti = 5;
      numLines = (xMax / tickMulti);
    }
    const lineDistance = width / numLines;

    const grid = d3.range(numLines + 1).map((i) => {
      return {'x1':0,'y1':0,'x2':0,'y2':(height + gridAdjust)}
    });

    const leftLine = [{'x1':0,'y1':0,'x2':0,'y2':(height + gridAdjust)}]

    const tickVals = grid.map((d,i) => {
      if (i === 0) {
        return "100"
      } else {
        return ((i * tickMulti))
      }
    });

    const xscale = d3.scale.linear()
      .domain([0,xMax])
      .range([0,width]);

    const yscale = d3.scale.linear()
      .domain([0,values.length])
      .range([0,height]);

    const fauxDiv = ReactFauxDOM.createElement('div');

    const canvas = d3.select(fauxDiv)
      .append('svg')
      .attr({'width':width + 40,'height':(height + 20)});

    if (xGrid) {
      const grids = canvas.append('g')
        .attr('id','grid')
        .attr('transform','translate(10,0)')
        .selectAll('line')
        .data(grid)
        .enter()
        .append('line')
        .attr({
          'x1':((d,i) => {return i*lineDistance}),
          'y1':((d) => {return d.y1}),
          'x2':((d,i) => {return i*lineDistance}),
          'y2':((d) => {return d.y2}),
          'class':((d,i) => {return `grid-${i}`}),
        });
    } else {
      canvas.append('g')
        .attr('id','grid')
        .attr('transform','translate(10,0)')
        .selectAll('line')
        .data(leftLine)
        .enter()
        .append('line')
        .attr({
          'x1':((d,i) => {return i*lineDistance}),
          'y1':((d) => {return d.y1}),
          'x2':((d,i) => {return i*lineDistance}),
          'y2':((d) => {return d.y2}),
          'class':((d,i) => {return `grid-${i}`}),
        });
    }
    if (xLabels) {
      const xAxis = d3.svg.axis();

      xAxis
        .orient('bottom')
        .scale(xscale)
        .outerTickSize(0)
        .tickValues(tickVals)
        .tickFormat((d,i) => {
          if (pctLabels) {
            return `${d}%`
          }
          else {
            if (d === "100") {return max}
            return `${Math.round(i * tickMulti / xMax * max)}`
          }
        });

      const x_axis = canvas.append('g')
        .attr("transform", "translate(10,260)")
        .attr('id','xaxis')
        .call(xAxis);
    }

    let rightRoundedRect = (x, y, width, height, radius) => {
      return "M" + x + "," + y + "h" + (width - radius) + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius + "v" + (height - 2 * radius) + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius + "h" + (radius - width) + "z"
    }

    const chart = canvas.append('g')
      .attr("transform", "translate(10,5)")
      .attr('id','bars')
      .selectAll('path')
      .data(pctValues)
      .enter()
      .append('path')
      .attr("d", (d,i) => {
        let width = xscale(d);
        return (rightRoundedRect(0, (yscale(i)), width, barHeight, 3))
      })
      .attr("fill", "#5B138D")
      .attr("opacity", (d) => {
        if (xscale(d) === 0) {
          return 0
        } else {
          return 1
        }
      });

    const textGroup = canvas.append('g')
      .attr("transform", `translate(-25,${textAdjust})`)
      .attr('id','pctText');

    const textGroups = textGroup.selectAll('g')
      .data(pctValues)
      .enter()
      .append('g')
      .attr("transform", (d,i) => {
        if ((xscale(d) - 2) < 70) { //If bar less then 70px we show green text
          return `translate(${(xscale(d) + 42)},${(yscale(i) + 15)})`
        }
        else {
          return `translate(${(xscale(d) + 30)},${(yscale(i) + 15)})`
        }
      })
      .attr("class", "text-group")
      .attr("fill", (d) => {
        if ((xscale(d) - 2) < 70) { //If bar less then 70px we show green text
          return '#5B138D'
        }
        else {
          return '#ffffff'
        }
      })
      .attr("opacity", (d) => {
        if (xscale(d) === 0) {
          return 0
        } else {
          return 1
        }
      });
    textGroups
      .append("text")
      .attr("class", "pct-text")
      .attr("text-anchor", (d) => {
        if ((xscale(d) - 2) < 70) { //If bar less then 70px we show green text
          return 'start'
        }
        else {
          return 'end'
        }
      })
      .attr("dominant-baseline", "central")
      .attr("transform", "translate(-3,0)")
      .text((d, i) => {
        if (pctLabels) {
          return `${values[i]}%`
        }
        else {
          return `${values[i]}`
        }
      });

    return (
      <div className='graph'>
        {fauxDiv.toReact()}
      </div>
    );
  }
  render() {
    return (
      ::this._renderGraph()
    );
  }
}

class YLabel extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderYLabel() {
    return (
      <li>
        {this.props.children}
      </li>
    );
  }
  render() {
    return (
      ::this._renderYLabel()
    );
  }
}

class BarGraph extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderBarGraph() {
    return (
      <div className='bar-graph'>
        <ul className='y-labels'>
          {this.props.children}
        </ul>
        <Graph {...this.props} />
      </div>
    );
  }
  render() {
    return (
      ::this._renderBarGraph()
    );
  }
}

export { YLabel, BarGraph, Graph };