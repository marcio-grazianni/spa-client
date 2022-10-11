import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
})
class NoDataOverlay extends Component {
  render() {
    return (
      <div className='no-data-overlay'>
        <div className='img'>
          <img src={Django.static('images/appointpal/circle-grey.png')} />
        </div>
        <div className='no-data-prompt'>
          <span>Low Data</span>
        </div>
      </div>
    );
  }
}

export { NoDataOverlay };