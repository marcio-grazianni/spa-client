import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleExpandedSection} from './actions'
import {sendReviewInvite} from '../review/actions'

@branch({
  expanded: ['appointpal', 'tools', 'expanded', 'review'],
  sending: ['appointpal', 'tools', 'review', 'sending']
})
class Review extends Component {
  _expandReview() {
    this.props.dispatch(
      toggleExpandedSection,
      'review'
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      sendReviewInvite
    );
  }
  _renderReview() {
    const {expanded, sending} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='review'>
        <label className='edit-label' onClick={::this._expandReview}>
          <span className='section-name'><i className='fa fa-star'></i>Review</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <div className='review-body'>
            <form onSubmit={::this._handleSubmit}>
              <div className="form-actions">
                <button className="btn btn-success btn-block" disabled={sending}>Send Invite</button>
              </div>
            </form>
          </div>
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderReview()
    );
  }
}

export { Review };