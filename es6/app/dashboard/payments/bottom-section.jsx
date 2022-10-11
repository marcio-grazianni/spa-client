import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {MiniFeed} from './mini-feed'
import {LineItems} from './line-items'
import {Sources} from './sources'

class BottomSection extends Component {
  _renderBottomSection() {
    return (
      <div className='bottom-data'>
        <div className='row'>
          <div className='col-sm-12 col-md-6 column-wrapper left-wrapper row-2'>
            <div className='box'>
              <MiniFeed />
            </div>
          </div>
          <div className='col-sm-12 col-md-6 column-wrapper right-wrapper row-2'>
            <div className='box'>
              <Sources />
              <LineItems />
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderBottomSection()
    );
  }
}

export { BottomSection };