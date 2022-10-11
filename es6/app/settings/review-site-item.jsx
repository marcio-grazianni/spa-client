import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {sortable} from 'react-anything-sortable'
import classnames from 'classnames'
import {reviewSiteLock, manualReviewSiteSort, reviewSiteDelete, reviewSiteChangeUrl} from './actions'
import sourceConfig from '../config/review-sources'

@sortable
@branch({})
class ReviewSiteItem extends Component {
  _changeURL(e) {
    if (this.props.locked) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(
      reviewSiteChangeUrl,
      this.props.sortData.review_feed_id,
      e.currentTarget.value,
    );
  }
  _moveUp() {
    if (this.props.locked) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(
      manualReviewSiteSort,
      this.props.sortData.order,
      'up',
    );
  }
  _moveDown() {
    if (this.props.locked) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(
      manualReviewSiteSort,
      this.props.sortData.order,
      'down',
    );
  }
  _delete() {
    if (this.props.locked) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(
      reviewSiteDelete,
      this.props.sortData.review_feed_id,
      this.props.sortData.order,
      this.props.sortData.new,
    );
  }
  _siteClick() {
    if (this.props.locked) {
      this.props.dispatch(reviewSiteLock);
    }
    return false
  }
  render() {
    const {locked} = this.props;
    const {slug, parent_slug, url} = this.props.sortData;
    let config_info;
    if (parent_slug) {
      config_info = sourceConfig[parent_slug.replace(/-/g, "")];
    } else {
      config_info = sourceConfig[slug.replace(/-/g, "")];
    }
    const {icon, name, color} = config_info;
    return(
      <div className={this.props.className}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
        style={this.props.style}
      >
        <div className='button-wrapper sites'>
          <button
            type='button'
            className={classnames('btn', 'btn-next', `btn-${slug}`, {locked})}
            style={{background: color}}
            onClick={::this._siteClick}
          >
            {icon}{name}
          </button>
        </div>
        <ul className='move-options'>
          <li><button type='button' className='btn' onClick={::this._moveUp}>
            <i className='fa fa-arrow-up'></i> Move Up
          </button></li>
          <li><button type='button' className='btn' onClick={::this._moveDown}>
            <i className='fa fa-arrow-down'></i> Move Down
          </button></li>
          <li><button type='button' className='btn' onClick={::this._delete}>
            <i className='fa fa-remove'></i> Delete
          </button></li>
        </ul>
        <div className='bottom'>
          <input className="input" value={url} onChange={::this._changeURL} placeholder="Add review URL here"/>
          <p>Cut and paste link to review page here</p>
          <div className='handle'>
            <i className='fa fa-arrows'></i>
          </div>
        </div>
      </div>
    );
  }
}

export { ReviewSiteItem };