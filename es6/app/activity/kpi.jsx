import React, {Component} from 'react'
import numeral from 'numeral'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {onFilterSelected} from './actions'

@branch({
})
class KPI extends Component {
  _applyFilter() {
    const {filter, table} = this.props;
    this.props.dispatch(
      onFilterSelected,
      filter,
      table
    )
  }
  _renderKPI() {
    const {label, value, filter, selected_filter, no_truncate} = this.props;
    const kpi_class = classnames('col-sm-2', 'kpi', {'selected': (selected_filter == filter)});
    let truncated_value = no_truncate ? numeral(value).format('0,0') : numeral(value).format('($0.00a)');
    return (
      <div className={kpi_class} onClick={::this._applyFilter}>
        <div className="value">{truncated_value}</div>
        <div className="statistic">{label}</div>
     </div>
    );
  }
  render() {
    return (
      ::this._renderKPI()
    );
  }
}

export { KPI };