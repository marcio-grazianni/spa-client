import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'

class StructuredContentHeader extends Component {
  _renderStructuredContentHeader() {
    const {from, created_at} = this.props.message;
    const {type_name} = this.props.message.meta_data;

    const now = moment(); //current moment
    let timestamp_moment = moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    return (
      <div className='content-header'>
        <div className='sender'>
          <h4>{from}</h4>
          {type_name}
        </div>
        <div className='meta'>
          <div className='source-info'>
            <img src={Django.static(`images/digest-logos/appointpal.png`)} />
          </div>
          <div className='timestamp'>
            {timestamp_moment.fromNow()}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStructuredContentHeader()
    );
  }
}

class UnstructuredContentHeader extends Component {
  _renderUnstructuredContentHeader() {
    const {from, created_at} = this.props.message;
    
    const now = moment(); //current moment
    let timestamp_moment = moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    return (
      <div className='content-header'>
        <div className='sender'>
          <h4>{from}</h4>
        </div>
        <div className='meta'>
          <div className='source-info'>
            <img src={Django.static(`images/digest-logos/appointpal.png`)} />
          </div>
          <div className='timestamp'>
            {timestamp_moment.fromNow()}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUnstructuredContentHeader()
    );
  }
}

export { StructuredContentHeader, UnstructuredContentHeader };