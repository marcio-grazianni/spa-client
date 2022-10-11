import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {GridItem} from './grid-item'

@branch({
  report_list: ['reports', 'displayed'],
})
class Grid extends Component {
  _renderGrid() {
    const {report_list} = this.props;
    const GridItems = report_list.map((report) => {
      return <GridItem report={report} key={report.id} />
    });
    const data = (GridItems.length > 0);
    return(
      <div className='report-grid'>
        {GridItems}
        {
          (!data) &&
          <div className='no-reports'>
            <i className='fa fa-file-text-o'></i>
            <p className='no-reports'>No reports to show</p>
          </div>
        }
      </div>
    );
  }
  render() {
    return(
      ::this._renderGrid()
    );
  }
}

export { Grid }
