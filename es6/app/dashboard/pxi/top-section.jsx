import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {LoadingOverlay} from '../loading-overlay'
import {SXIInfo} from './sxi-info'
import {SXITrend} from './sxi-trend'
import {NoDataOverlay} from '../no-data-overlay'
import {ProviderSelector} from '../../UI/provider-selector'

class Data extends Component {
  _renderData() {
    return(
      <div>
        <SXIInfo />
        <SXITrend />
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
  is_loading: ['dashboard', 'pxi_is_loading'],
  average: ['dashboard', 'sxi', 'average'],
})
class TopSection extends Component {
  _renderTopSection() {
    const {is_loading, average} = this.props;
    let index_name = "Provider";
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='box'>
            <div className='top-data-wrapper'>
              <div className='header'>
                <h3>{index_name} Experience Index</h3>
              </div>
              <div className='top-data'>
                {
                  (is_loading) ? <LoadingOverlay /> : <Data />
                }
                {
                  (!is_loading && average === -1) &&
                  <NoDataOverlay />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderTopSection()
    );
  }
}

export { TopSection };