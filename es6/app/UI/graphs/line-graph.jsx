import React, {Component} from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

class LineGraph extends Component {
  _setMouseOver(index) {
    this.props.onChangeMouseOver(index, true)
  }
  _unsetMouseOver(index) {
    this.props.onChangeMouseOver(index, false)
  }
  _renderLineGraph() {
    const {data, previous_node, dollars} = this.props;

    const prefix = dollars ? "$" : "";
    let appendPrefix = function(d) { return prefix + numeral(d).format(d > 1000 ? '0.0a' : '0,0') };
    let dollarFormat = function(d) { return prefix + numeral(d).format('0,0.00') };

    // if field is given as props use that else default to 'value'
    let field;
    this.props.field ? (field = this.props.field) : (field = 'value');
    
    //svg width defaults to 1085

    let svgWidth;
    this.props.width ? (svgWidth = this.props.width) : (svgWidth = 1085);

    const margin = {top: 30, right: 95, bottom: 50, left: 75};
    const width = svgWidth - margin.left - margin.right;
    const height = 290 - margin.top - margin.bottom;

    //parse to date objects
    let parseDate = d3.time.format("%d-%b-%y").parse;
    // Scale and axis stuff
    let x = d3.time.scale().range([0, width]);
    let y = d3.scale.linear().range([height, 0]);

    let xAxis = d3.svg.axis().scale(x)
      .orient("bottom")
      .innerTickSize(0)
      .outerTickSize(0)
      .tickPadding(17)
      .tickFormat(d3.time.format("%m/%d/%y"));

    let yAxis = d3.svg.axis()
      .orient("left")
      .scale(y)
      .ticks(5)
      .outerTickSize(1)
      .innerTickSize(-(svgWidth - 100))
      .tickPadding(5)
      .tickFormat(appendPrefix);

    // #area function
    let area = d3.svg.area()
      .x(function(d) {return x(d.date)})
      .y0(height)
      .y1(function(d) {return y(d[field])});

    // line function
    let valueline = d3.svg.line()
      .x(function(d) {return x(d.date)})
      .y(function(d) {return y(d[field])});

    // # default min and max to 0 - 100
    let min;
    let max;
    this.props.min ? (min = this.props.min) : (min = 0);
    this.props.max ? (max = this.props.max) : (max = 100);

    const fauxDiv = ReactFauxDOM.createElement('div');

    const svg = d3.select(fauxDiv)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let dataParsed = []; //stores all the nodes to be displayed (omit nodes with no data)
    let rangeParsed = []; //stores total range (includes nodes with no data)
    let rectParsed = [] //stores the nodes that are currently being hovered over (should only be one)
    data.forEach((d, i) => {
      let dateParsed = parseDate(d.date);
      // let hover = false; // Hover not implented yet (implement soon)
      // // if (d.hover) { hover = d.hover }
      // parsed = {'date': dateParsed, "#{field}": d[field], 'hover': hover, 'index': d.index}
      let parsed = {'date': dateParsed, 'index': d.index, 'hover': ((d.hover) ? true : false) };
      parsed[field] = d[field];
      // # -1 value means *NO DATA* that node we don't push to parsed data set
      // # but we still push to our data set for the range
      if (d[field] >= 0) {
        dataParsed.push(parsed);
      }
      rangeParsed.push(parsed);
      // if currently hovered add to rectParsed
      if (d.hover) {
        rectParsed.push(parsed)
      }
    });
    x.domain(d3.extent(rangeParsed, function(d) {return d.date}));
    //base y domain off entire range **add 10% to min max
    const diff = max - min
    const minMaxPadding = Math.round(diff * 0.1);
    // dont add 10% if max is 5 // for 5 star rating we dont want it to go to 6 or -1
    if (max === 5) {
      y.domain([(min - 0.5), 5.5]);
    } else {
      y.domain([(min - minMaxPadding), (max + minMaxPadding)]);
    }

    //if # of nodes in total data set is <= 11
    //we will have tick for every node
    //else we d3 will auto set the ticks
    if (data.length <= 11) {
      xAxis.tickValues(rangeParsed.map((function(d) {return d.date})))
    } else {
      xAxis.ticks(5)
    }

    let lineData = dataParsed.slice(0);

    // only use previous node if showing more than one day
    if (previous_node && lineData.length > 1) {
      let previous_node_parsed = {'date': parseDate(previous_node.date)};
      previous_node_parsed[field] = previous_node[field];
      lineData.unshift(previous_node_parsed);
    }
    //Add the X Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.select("g.x.axis")
      .append("line")
      .attr("class", "domain")
      .attr("x2", (svgWidth - 98))
      .attr("y2", 0)
      .attr("transform", "translate(-25,0)")

    //Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(-25,0)`)
      .call(yAxis);

    //clip outside of confines of graph lines
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", (svgWidth - 100))
      .attr("height", 210)
      .attr("transform", "translate(-25,0)");

    //Add the Line
    svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(lineData)
      .attr("class", "area")
      .attr("d", area);

    //Add the Line
    svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .attr("d", valueline(lineData))
      .attr("class", "line");
    
    //Add Circles
    const circleGroup = svg.append("g")
      .attr("class", "circleGroup");
    const circles = circleGroup.selectAll("circle")
      .data(dataParsed)
      .enter()  
      .append("circle")
      .attr("r", function(d) {return (d.hover) ? 10 : 5})
      .attr("cx", function(d) {return x(d.date)})
      .attr("cy", function(d) {return y(d[field])})
      .on('mouseover', (d) => ::this._setMouseOver(d.index))
      .on('mouseout', (d) => ::this._unsetMouseOver(d.index));

    // Add Hover over data rectangles if there rectParsed
    if (rectParsed.length > 0) {
      const rectGroup = svg.append("g")
        .attr("class", "rectGroup");
      const rectangles = rectGroup.selectAll("rect")
        .data(rectParsed)
        .enter()  
        .append("rect")
        .attr("transform", "translate(-50,15)")
        .attr("height", 45)
        .attr("width", 100)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", (d) => x(d.date))
        .attr("y", (d) => y(d[field]));
      const rectTextGroup = rectGroup.selectAll("g")
        .data(rectParsed)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${x(d.date)},${y(d[field]) + 5})`)
        .attr("class", "text-group");
      rectTextGroup
        .append("text")
        .attr("class", "hover-info")
        .attr("transform", "translate(0,30)")
        .text((d) => dollars ? dollarFormat(d[field]) : d[field].toString());
      rectTextGroup
        .append("text")
        .text("some text")
        .attr("class", "date-info")
        .attr("transform", "translate(0,47)")
        .text((d) => moment(d.date).format('MMM Do YYYY'));
    }
    return (
      <div className='trend'>
        {fauxDiv.toReact()}
      </div>
    );
  }
  render() {
    return (
      ::this._renderLineGraph()
    );
  }
}

export { LineGraph };