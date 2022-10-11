import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import * as actions from '../actions'
import classnames from 'classnames'
import moment from 'moment'
import DateRangePicker  from 'react-bootstrap-daterangepicker'

@branch({})
class DatePicker extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  _onDateChange(e, picker) {
    this.props.onDateChange(picker)
  }
  _renderDatePicker() {
    const {start_date, end_date} = this.props;
    const startDate = moment(start_date);
    const endDate = moment(end_date);
    return (
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onApply={::this._onDateChange}
        opens='left'
        drops='down'
        minDate={moment().subtract(3, 'years')}
        maxDate={moment()}
        linkedCalendars={false}
        showDropdowns={true}
        dateLimit={{'months': 12}}
        ranges={
         {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          }
        }
        alwaysShowCalendars={true}
      >
        <div className='current-range'>
          <span className='start'>
            {startDate.format("MMM D, YYYY")}
          </span>
          <span className='divider'> - </span>
          <span className='end'>
            {endDate.format("MMM D, YYYY")}
          </span>
        </div>
        <div className='dropdown-btn'>
          <i className='fa fa-spin fa-refresh'></i> 
          <i className='fa fa-caret-down'></i>
        </div>
      </DateRangePicker>
    );
  }
  render() {
    return (
      <div className='date-picker'>
        {::this._renderDatePicker()}
      </div>
    );
  }
}

export { DatePicker };