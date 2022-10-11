import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

let replaceUnderscore = (str) => {
  return str.replace(/_/g, ' ')
}

class InputDropdown extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  _changeValue(e) {
    this.props.changeValue(
      e.currentTarget.value,
      this.props.id
    )
  }
  _renderInputDropdown() {
    const {id, title, disabled, error, tooltip, value, Options} = this.props;
    const input_class = classnames({disabled, error});
    let OptionItems = Options.map((Option) =>
      <option key={Option[0]} value={Option[0]}>
        {Option[1]}
      </option>
    );
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
      <div className="control-group"
      >
        <label>{title}: {tooltipItem}</label>
        <div className="controls">
          <select
            className={input_class}
            disabled={disabled}
            value={value}
            onChange={::this._changeValue}
          >
            {OptionItems}
          </select>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInputDropdown()
    );
  }
}

export { InputDropdown }
