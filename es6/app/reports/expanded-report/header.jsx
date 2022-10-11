import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import {closeExpandedReport} from '../actions'

@branch({
  report: ['reports', 'current_report'],
})
class Header extends Component {
  _closeExpandedReport() {
    this.props.dispatch(closeExpandedReport);
  }
  _renderHeader() {
    const {start_date, report_type} = this.props.report;
    let date_str = '';
    if (report_type ===  'monthly') {
      date_str = moment(start_date, "YYYYMMDD").format("MMMM YYYY");
    } else {
      date_str = moment(start_date, "YYYYMMDD").format("MMM D, YYYY");
    }
    const report_title = `${date_str} - ${report_type} Report`;
    return(
      <div className='expanded-header main-header-wrapper'>
        <div className='main-header'>
          <div className='back-button-wrapper'>
            <button onClick={::this._closeExpandedReport} type='button'>
              <i className='fa fa-long-arrow-left'></i>
            </button>
          </div>
          <div className='date-range'>
            <h2>{report_title}</h2>
          </div>
        </div>
    </div>
    );
  }
  render() {
    return(
      ::this._renderHeader()
    );
  }
}

export { Header }
