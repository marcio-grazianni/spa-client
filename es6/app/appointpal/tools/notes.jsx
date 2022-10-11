import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection, handleInputChange} from './actions'
import {saveNote} from '../note/actions'

@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'notes'],
  note: ['appointpal', 'tools', 'notes', 'content'],
  saving: ['appointpal', 'tools', 'notes', 'saving']

})
class Notes extends Component {
  _expandNotes() {
    this.props.dispatch(
      toggleExpandedSection,
      'notes'
    )
  }
  _handleInputChange(e) {
    const { name, value } = e.target;
    this.props.dispatch(
      handleInputChange,
      'notes',
      name,
      value
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      saveNote
    )
  }
  _renderNotes() {
    const {expanded, note, saving} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='notes'>
        <label className='edit-label' onClick={::this._expandNotes}>
          <span className='section-name'><i className='fa fa-sticky-note-o'></i>Notes</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className='notes-body'>
              <form onSubmit={::this._handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <textarea
                      name="content"
                      className="form-control"
                      onChange={::this._handleInputChange}
                      value={note}
                      placeholder="Write here..."
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-success btn-block" disabled={!note || saving}>Save</button>
                </div>
              </form>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderNotes()
    );
  }
}

export { Notes };