import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {NoDataOverlay} from '../no-data-overlay'
import {YLabel, Graph} from '../../UI/graphs/bar-graph'

class BarGraph extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderBarGraph() {
    return (
      <div className='bar-graph'>
        <div className='row'>
          <div className='col col-sm-4'>
            <ul className='y-labels'>
              {this.props.children}
            </ul>
          </div>
          <div className='col col-sm-8'>
            <Graph {...this.props} />
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderBarGraph()
    );
  }
}

@branch({
  paid_account: ['account', 'paid_account'],
  item_breakdown: ['dashboard', 'item_breakdown'],
})
class Data extends Component {
  _renderData() {
    const {paid_account, item_breakdown} = this.props;

    const values = item_breakdown.map((item) => {return item.count});
    return (
      <div>
        <div className='right'>
          <BarGraph
            width={320}
            xGrid={false}
            textAdjust={7}
            gridAdjust={-6}
            xLabels={false}
            values={values}
          >
            {
              item_breakdown.map((item) => {
                return (
                  <YLabel key={item.label}>
                    {item.label}
                  </YLabel>
                )
              })
            }
          </BarGraph>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderData()
    );
  }
}

@branch({
  is_loading: ['dashboard', 'payments_is_loading'],
  item_breakdown: ['dashboard', 'item_breakdown'],
})
class LineItems extends Component {
  _renderLineItems() {
    const {is_loading, paid_account, item_breakdown} = this.props;
    return (
      <div className='review-wrapper data-wrapper'>
        <div className='header'>
          <h3>Top Items</h3>
        </div>
        <div className='bottom-data-container items-container'>
          {
            (is_loading) ? <LoadingOverlay /> : <Data {...this.props} />
          }
          {
            (!is_loading && item_breakdown.length === 0) &&
            <NoDataOverlay />
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderLineItems()
    );
  }
}

export { LineItems };