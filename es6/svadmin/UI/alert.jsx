import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {closeAlert} from '../actions'

@branch({})
class Alert extends Component {
  _closeAlert() {
    this.props.dispatch(
      closeAlert,
      this.props.alpha,
    );
  }
  _renderAlert() {
    const {body, alert_type} = this.props.alert;
    const alert_class = classnames('alert', alert_type);
    return (
      <div className={alert_class}>
        <p>{body}</p>
        <div
          className='close'
          onClick={::this._closeAlert}
        >
          <i className='fa fa-close'></i>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAlert()
    );
  }
}


export { Alert };