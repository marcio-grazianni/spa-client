import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Sortable from 'react-anything-sortable'
import classnames from 'classnames'
import {Alert} from '../UI/alert'
import {ReviewSiteItem} from './review-site-item'
import {reviewSiteLock, changeSelectedProfile, addProfile, handleReviewSiteSort, saveReviewSites} from './actions'
import defaultSources from '../config/default-sources'

@branch({
  selected_profile: ['settings', 'review_sites', 'add_profile'],
  all_sources: ['settings', 'review_sites', 'all_sources'],
  paid_account: ['account', 'paid_account'],
})
class AddProfile extends Component {
  _changeValue(e) {
    this.props.dispatch(
      changeSelectedProfile,
      e.currentTarget.value
    )
  }
  _addProfile() {
    if (!this.props.paid_account) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(addProfile);
  }
  render() {
    const {selected_profile, all_sources} = this.props;

    // Filter down to sources with unique parent slugs
    const parent_slugs = [];
    const unique_sources = all_sources.filter((Option) => {
      if (Option.parent_slug) {
        if (parent_slugs.includes(Option.parent_slug)) {
          return false;
        } else {
          parent_slugs.push(Option.parent_slug);
          return true;
        }
      } else {
        return true;
      }
    });

    const ProfileOptionComponents = unique_sources.map((Option) => {
      let name = Option.name;
      if (Option.parent_slug) {
        name = Option.parent_name;
      }
      return (
        <option key={Option.review_source_id} value={Option.review_source_id}>
          {name}
        </option>
      );
    });
    return (
      <div className='add-profile'>
        <select value={selected_profile} onChange={::this._changeValue}>
          {ProfileOptionComponents}
        </select>
        <button
          type="button"
          className="btn btn-add"
          onClick={::this._addProfile}
        >
          Add Review Source
        </button>
      </div>
    )
  }
}

@branch({
  current_sources: ['settings', 'review_sites', 'current_sources'],
  paid_account: ['account', 'paid_account'],
  vertical: ['account', 'vertical'],
})
class ReviewSites extends Component {
  _handleSubmit(e) {
    e.preventDefault();
    if (!this.props.paid_account) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(saveReviewSites);
  }
  _handleSort(sortedReviewSites) {
    if (!this.props.paid_account) {
      this.props.dispatch(reviewSiteLock);
      return false
    }
    this.props.dispatch(
      handleReviewSiteSort,
      sortedReviewSites
    )
  }
  _renderReviewSites() {
    const {current_sources, paid_account, vertical} = this.props;
    let SiteComponents = [];
    let default_sources = [];
    if (!paid_account) {
      if (vertical) {
        default_sources = defaultSources[vertical.replace(/-/g, "")];
      }
      SiteComponents = default_sources.map((slug, i) =>
        <ReviewSiteItem className={classnames(`item-${i}`, 'locked')} key={i} sortData={{slug: slug, url: ""}} locked />
      )
    } else {
      SiteComponents = current_sources.map((Site) =>
        <ReviewSiteItem className={classnames(`item-${Site.order}`, {inactive: (!Site.active)})} key={Site.order} sortData={Site} />
      )
    }
    return (
      <div className="settingsContent" id="review-sites">
        <form className="form-horizontal review-sites" onSubmit={::this._handleSubmit}>
          <h3>Review Sources</h3>
          <p>Add sites where you would like to receive reviews. You can drag and drop to set the order in which sites are featured. The top 4 sites you list will become active.</p>
          <AddProfile />
          {
            (SiteComponents.length === 0) &&
            <div className='no-sites'>
              <i className='fa fa-pencil-square'></i>
              <h4>You haven't added any review sources</h4>
            </div>
          }
          {
            (SiteComponents.length > 0) &&
            <Sortable onSort={::this._handleSort} direction="vertical" sortHandle="handle" dynamic={true}>
              {SiteComponents}
            </Sortable>
          }
          <button type="submit" className='btn btn-confirm btn-save'>
            Save Changes
          </button>
        </form>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewSites()
    );
  }
}

export { ReviewSites };