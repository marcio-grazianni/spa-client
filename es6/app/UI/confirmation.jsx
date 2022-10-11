import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {confirmationToggle} from '../actions'

class ConfirmationButtons extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderConfirmationButtons() {
    return(
      <div className='confirm-buttons'>
        {this.props.children}
      </div>
    )
  }
  render() {
    return(
      ::this._renderConfirmationButtons()
    )
  }
}

@branch({})
class Confirmation extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _cancel() {
    this.props.dispatch(
      confirmationToggle,
      false
    );
  }
  _renderConfirmation() {
    const {icon, title, confirm_text} = this.props;
    const icon_class = classnames('fa', icon);
    return (
      <div className="confirm-wrapper">
        <div className='confirm-top'>
          <h3><i className={icon_class}></i>{title}</h3>
          <div
            className='close'
            onClick={::this._cancel}
          >
            <i className='fa fa-times-circle'></i>
          </div>
        </div>
        <div className='confirm-body'>
          <span className='confirm-text' dangerouslySetInnerHTML={{__html: confirm_text}} />
        </div>
        {this.props.children}
      </div>
    );
  }
  render() {
    return (
      ::this._renderConfirmation()
    );
  }
}

export { Confirmation, ConfirmationButtons };