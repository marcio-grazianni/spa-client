import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {EditForm} from './message-seal/edit-form'
import {confirmationToggle} from '../actions'
import {toggleExpandedSection} from './actions'

@branch({
  expanded: ['seal', 'expanded', 'edit'],
})
class Edit extends Component {
  _expandEdit() {
    this.props.dispatch(
      toggleExpandedSection,
      'edit'
    )
  }
  _saveChanges() {
    this.props.dispatch(
      confirmationToggle,
      'save_seal'
    )
  }
  _renderEdit() {
    const {expanded} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='edit'>
        <label className='edit-label' onClick={::this._expandEdit}>
          <span className='section-name'><i className='fa fa-envelope-open'></i>Edit Seal</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        { 
          (expanded) &&
          <div>
            <EditForm />
            <button
              type='button'
              className='btn btn-save'
              onClick={::this._saveChanges}
            >
              Save Changes
            </button>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderEdit()
    );
  }
}

export { Edit };