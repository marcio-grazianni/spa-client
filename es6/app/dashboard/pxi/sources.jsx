import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {UpgradeButton} from './upgrade-button'
import {BreakdownDonut, Legend, DonutCenter} from '../../UI/graphs/breakdown-donut'
import {toggleUpgradePrompt} from '../../actions'
import {changeSelectedSource} from './actions'
import sourceConfig from '../../config/review-sources'

@branch({
  selected_source: ['dashboard', 'selected_source'],
})
class SourceItem extends Component {
  _changeSelectedSource() {
    this.props.dispatch(
      changeSelectedSource,
      this.props.slug,
    );
  }
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  render() {
    const {selected_source, slug, count, inactive, hoverable} = this.props;
    let source_key = slug.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {name, icon, color} = config_info;
    let on_click = null;
    if (hoverable) {
      on_click = ::this._toggleUpgradePrompt;
    }
    if (count == 0 || inactive) {
      return(
        <li
          className={classnames('inactive', {hoverable})}
          onClick={on_click}
        >
          <span
            className={`icon ${slug}`}
            style={{background: color}}
          >
            {icon}
          </span>
          <span className='site'>{name}</span>
            {
              (count == 0) &&
              <span className='rating'><i className='fa fa-minus'></i> <i className='fa fa-comment-o'></i></span>
            }
            {
              (count > 0) &&
              <span className='rating'>{count} <i className='fa fa-comment'></i></span>
            }
        </li>
      );
    }
    return(
      <li
        className={classnames({active: (selected_source === slug), hoverable})}
        onClick={::this._changeSelectedSource}
      >
        <span
          className={`icon ${slug}`}
          style={{background: color}}
        >
          {icon}
        </span>
        <span className='site'>{name}</span>
        <span className='rating'>{count} <i className='fa fa-comment'></i></span>
      </li>
    );
  }
}

@branch({
  source_count: ['dashboard', 'source_breakdown_count_ordered'],
  reviews_count: ['dashboard', 'reviews_count'],
  external_reviews_count: ['dashboard', 'external_reviews_count'],
  paid_account: ['account', 'paid_account'],
})
class SourceList extends Component {
  _unpaidTopSites() {
    //if unpaid then SV should be inserted first and all other sites should be inactive
    const {source_count} = this.props;
    // need to add SV reviews to the source_count
    // create new source count with SV inserted
    let sv_count;
    source_count.forEach((source_obj) => {
      if (source_obj.slug === 'subscribervoice') {
        sv_count = source_obj.count;
      }
    });
    let sv_review_count_obj = {slug: "subscribervoice", count: sv_count, inactive: false, hoverable: true};
    let new_source_count = [];
    new_source_count.push(sv_review_count_obj);
    // find where to insert the sv obj
    source_count.forEach((source_obj) => {
      if (source_obj.slug !== 'subscribervoice') {
        let new_source_obj = {slug: source_obj.slug, count: source_obj.count, inactive: true, hoverable: true};
        new_source_count.push(new_source_obj);
      }
    });
    return new_source_count;
  }
  _renderSourceList() {
    const {paid_account, source_count} = this.props;
    let new_source_count;
    if (paid_account) {
      new_source_count = source_count;
    } else {
      new_source_count = this._unpaidTopSites();
    }
    // source_breakdown may not contain all sources so set count to 0 if not found
    // Will use this array to order
    
    let SourceComponents = new_source_count.map((source_obj, i) => 
      <SourceItem key={source_obj.slug} slug={source_obj.slug} count={source_obj.count} inactive={source_obj.inactive} hoverable={source_obj.hoverable} />
    );
    SourceComponents = SourceComponents.slice(0, 7);
    return (
      <ul className='site-list'>
        {SourceComponents}
      </ul>
    );
  }
  render() {
    return (
      ::this._renderSourceList()
    );
  }
}

@branch({
  paid_account: ['account', 'paid_account'],
  selected_source: ['dashboard', 'selected_source'],
  source_breakdown: ['dashboard', 'source_breakdown'],
  onboarding_complete: ['account', 'onboarding_complete'],
})
class Data extends Component {
  _renderData() {
    const {paid_account, selected_source, source_breakdown, onboarding_complete} = this.props;
    const selected_source_data = source_breakdown[selected_source];
    let data = [0,0,0,0,0];
    let rating = 0;
    if (selected_source_data) {
        data = [
        selected_source_data.star_5,
        selected_source_data.star_4,
        selected_source_data.star_3,
        selected_source_data.star_2,
        selected_source_data.star_1,
      ]
      rating = selected_source_data.average;
    } 
    const colors = ['#4E224E', '#6D236D', '#893989', '#D4327F', '#F18ABB'];
    return (
      <div>
        <div className={classnames('left', {paid: paid_account})}>
          <BreakdownDonut data={data}>
            <DonutCenter>
              <h3>{rating}</h3>
              <div className='of-label'>of 5</div>
            </DonutCenter>
            <Legend>
              {
                Array(5).fill().map((_,i) => {
                  let star = (5 - i)
                  return (
                    <li key={i}>
                      <span
                        className='star'
                        style={{color: colors[i]}}
                      >{star}<i className='fa fa-star'></i></span>
                      <span className='rating'> {data[i]}</span>
                    </li>
                  )
                })
              }
            </Legend>
          </BreakdownDonut>
          {
            onboarding_complete && (!paid_account) &&
            <UpgradeButton />
          }
        </div>
        <div className='right'>
          <SourceList />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderData()
    );
  }
}

@branch({
  is_loading: ['dashboard', 'pxi_is_loading'],
  reviews: ['dashboard', 'reviews'],
})
class Sources extends Component {
  _renderSources() {
    const {is_loading, paid_account} = this.props;
    return (
      <div className='site-review-wrapper data-wrapper'>
        <div className='header'>
          <h3>Sources</h3>
        </div>
        <div className='bottom-data-container site-review-container'>
          {
            (is_loading) ? <LoadingOverlay /> : <Data {...this.props} />
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSources()
    );
  }
}

export { Sources };