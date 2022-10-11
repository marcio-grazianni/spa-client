import React, {Component} from 'react'
import {Header} from './header'
import {TopStats} from './top-stats'
import {ChannelBreakdown} from './channel-breakdown'

class ExpandedReport extends Component {
  _renderExpandedReport() {
    return(
      <div className='expanded-report'>
        <Header />
        <div className='report-body main-container'>
          <TopStats/>
          <ChannelBreakdown />
        </div>
      </div>
    );
  }
  render() {
    return(
      ::this._renderExpandedReport()
    );
  }
}

export { ExpandedReport }
