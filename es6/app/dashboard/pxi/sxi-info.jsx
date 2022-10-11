import React, {Component} from 'react'
import {SXIAverage} from './sxi-average'
import {SXIBreakdown} from './sxi-breakdown'
import classnames from 'classnames'

class SXIInfo extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className='sxi-info'>
        <SXIAverage />
        <SXIBreakdown />
      </div>
    );
  }
}

export { SXIInfo };