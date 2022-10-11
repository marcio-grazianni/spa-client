import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {expandReport} from './actions'

// TODO: useful functions file
const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@branch({})
class GridItem extends Component {
  _expandReport() {
    this.props.dispatch(
      expandReport,
      this.props.report.id
    )
  }
  _renderGridItem() {
    const {start_date, end_date, data, report_type} = this.props.report;
    const {overall_rating, sxi_avg, total_reviews} = data;
    const start = moment(start_date, "YYYYMMDD").format("MMM. D");
    const end = moment(end_date, "YYYYMMDD").format("MMM. D");
    const total_reviews_str = numberWithCommas(total_reviews);
    let sxi_color = '#5B138D';
    if (sxi_avg < 0) {
      sxi_color = '#a3a3a3';
    }
    else if (sxi_avg < 40) {
      sxi_color = '#B6483C';
    } else if (sxi_avg < 60) {
      sxi_color = '#F2B262';
    }
    let range_display = `${start} - ${end}`;
    if (report_type === 'monthly') {
      range_display = moment(start_date, "YYYYMMDD").format("MMMM YYYY");
    }
    const decimals = 1;
    let sxi_round;
    if (sxi_avg > 0) {
      sxi_round = Number(Math.round((sxi_avg)+'e'+decimals)+'e-'+decimals);
    } else {
      sxi_round = "—";
    }
    let rating_display;
    if (overall_rating > 0) {
      rating_display = <div><i className='fa fa-star'></i> {overall_rating}</div>;
    } else {
      rating_display = "—";
    }
    let sxi_label = 'PXI';
    return(
      <div className='grid-item-wrapper'>
        <div
          className='grid-item'
          style={{borderTop: `1px solid ${sxi_color}`}}
          onClick={::this._expandReport}
        >
          <div className='sxi-color'>
            <div
              className='color'
              style={{background: sxi_color}}
            >
            </div>
          </div>
          <div className='report-range'>
            <h3>{range_display}</h3>
          </div>
          <div className='report-type'>
            <h4>{report_type} Report</h4>
          </div>
          <ul className='stats'>
            <li className='stat sxi'>
              <span className='desc'>
                {sxi_label}:
              </span>
              <span className='stat sxi-stat'>
                {sxi_round}
              </span>
            </li>
            <li className='stat sxi'>
              <span className='desc'>
                Overall Rating:
              </span>
              <span className='stat sxi-stat'>
                {rating_display}
              </span>
            </li>
            <li className='stat events'>
              <span className='desc'>
                Total Reviews:
              </span>
              <span className='stat events-stat'>
                {total_reviews_str}
              </span>
            </li>
          </ul>
          <div className='show-more-wrapper'>
            <div className='show-more'>
              <i className='fa fa-external-link'></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return(
      ::this._renderGridItem()
    );
  }
}

export { GridItem }
