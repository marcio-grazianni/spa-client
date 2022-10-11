import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import * as actions from '../actions'

@branch({})
class DropDownToggle extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  _toggleDropdown(e) {
    this.props.dispatch(
      actions.toggleDropdown,
      this.props.id
    );
    e.stopPropagation();
  }
  _renderDropdownToggle() {
    const toggleClass = classnames('dropdown-toggle', this.props.className);
    return (
      <a
        className={toggleClass}
        onClick={::this._toggleDropdown}
      >
        {this.props.children}
      </a>
    );
  }
  render() {
    return (
      ::this._renderDropdownToggle()
    );
  }
}

@branch({})
class DropDownMenu extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    // need to bind _hideDropdown at construction so that event listener can be removed
    this._hideDropdown = this._hideDropdown.bind(this);
  }
  componentDidMount() {
    // Hide dropdown block on click outside the block
    window.addEventListener('click', this._hideDropdown, false);
  }
  componentWillUnmount() {
    // Remove click event listener on component unmount
    window.removeEventListener('click', this._hideDropdown, false);
  }
  _stopPropagation(e) {
    // Stop bubbling of click event on click inside the dropdown content
    e.stopPropagation();
  }
  _hideDropdown(e) {
    const { active } = this.props;
    // Hide dropdown block if it's not active
    if (!active) {
      this.props.dispatch(
        actions.hideDropdown,
        this.props.id
      );
    }
    e.stopPropagation();
  }
  _renderDropdownMenu() {
    return (
      this.props.children
    );
  }
  render() {
    const ulClass = classnames('dropdown-menu', this.props.className)
    return (
      <ul
        className={ulClass}
      >
        <div className='inner-menu' onClick={::this._stopPropagation}>
          {::this._renderDropdownMenu()}
        </div>
      </ul>
    );
  }

}

export { DropDownToggle, DropDownMenu };