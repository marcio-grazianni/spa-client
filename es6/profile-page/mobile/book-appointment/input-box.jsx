import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

class InputBox extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  _changeValue(e) {
    this.props.changeValue(
      e.currentTarget.value,
      this.props.id
    )
  }
  _renderInputBox() {
    const {id, title, disabled, error, validation, tooltip, max_length, value, input_type, placeholder, changeValue, children, ...props} = this.props;
    const input_class = classnames({disabled, error});
    const control_group_class = classnames('control-group', {'error-group': error});
    let validationIcon = null;
    if (validation) {
      validationIcon = <i className='fa fa-check-circle'></i>
    }
    let tooltipItem = null;
    if (tooltip) {
      tooltipItem = <span>
        <i className="fa fa-info-circle" data-tip data-for={id} />
        <ReactTooltip id={id} multiline effect='solid'>
          <span>{tooltip}</span>
        </ReactTooltip>
      </span>
    }
    return (
      <div className={control_group_class}>
        {
          (title) &&
          <label>{title}: {tooltipItem}</label>
        }
        {validationIcon}
        <div className="controls">
          <input
            id={id}
            className={input_class}
            maxLength={max_length}
            value={value}
            disabled={disabled}
            type={input_type}
            placeholder={placeholder}
            onChange={::this._changeValue}
            {...props}
          />
        </div>
        {children}
      </div>
    );
  }
  render() {
    return (
      ::this._renderInputBox()
    );
  }
}

export { InputBox }
