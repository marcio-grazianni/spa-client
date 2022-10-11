import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {UpgradeButton} from './upgrade-button'
import {DashboardDonut} from '../../UI/graphs/dashboard-donut'
import {YLabel, BarGraph} from '../../UI/graphs/bar-graph'
import sourceConfig from '../../config/review-sources'
import {toggleUpgradePrompt} from '../../actions'

// TODO: useful functions file
const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@branch({
  reviews_count: ['dashboard', 'actual_reviews_count'],
  overall_rating: ['dashboard', 'overall_rating'],
})
class OverallRating extends Component {
  _renderOverallRating() {
    const {reviews_count, overall_rating} = this.props;
    let rating = 0;
    if (overall_rating && overall_rating > 0) {
      rating = overall_rating;
    }
    let label;
    if (reviews_count !== 1) {
      label = `${numberWithCommas(reviews_count)} reviews`;
    } else {
      label = `${numberWithCommas(reviews_count)} review`;
    }
    return (
      <DashboardDonut
        value={rating}
        out_of={5}
        starRating={true}
        max={5}
        label={label}
        donutHeight={187}
        donutWidth={187}
      />
    );
  }
  render() {
    return (
      ::this._renderOverallRating()
    );
  }
}

@branch({
  reviews_count: ['dashboard', 'actual_reviews_count'],
})
class TopSite extends Component {
  _toggleUpgradePrompt() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  render() {
    const {reviews_count, slug, count, icon, color, inactive, hoverable} = this.props;
    let pct;
    if (reviews_count === 0) {
      pct = 0;
    } else if (count === 0) {
      pct = 0;
    } else {
      let decimals = 1;
      pct = Number(Math.round(((count / reviews_count) * 100)+'e'+decimals)+'e-'+decimals);
    }
    let on_click = null;
    if (hoverable) {
      on_click = ::this._toggleUpgradePrompt;
    }
    return(
      <li
        className={classnames(
          'top-site',
          {inactive: (count === 0 || inactive)},
          {hoverable: hoverable}
        )}
      >
        <span
          className={`icon ${slug}`}
          style={{background: color}}
          data-tip
          data-for={`${slug}-tip`}
          data-place="bottom"
          data-effect="solid"
          onClick={on_click}
        >
          {icon}
        </span>
        {
          (count !== 0 && !inactive) &&
          <ReactTooltip id={`${slug}-tip`}>
            {`${pct}%`}
          </ReactTooltip>
        }
      </li>
    );
  }
}

@branch({
  source_count: ['dashboard', 'source_breakdown_count_ordered'],
  reviews_count: ['dashboard', 'actual_reviews_count'],
  external_reviews_count: ['dashboard', 'external_reviews_count'],
  paid_account: ['account', 'paid_account'],
})
class TopSites extends Component {
  _unpaidTopSites() {
    //if unpaid then SV should be inserted first and all other sites should be inactive
    const {source_count} = this.props;
    // need to add SV reviews to the source_count
    // create new source count with SV inserted

    let new_source_count = [];

    // go through source count and make sure sv is at the beginning
    source_count.forEach((source_obj, i) => {
      let new_source_obj;
      if (source_obj.slug !== 'subscribervoice') {
        new_source_obj = {slug: source_obj.slug, count: source_obj.count, inactive: true, hoverable: true};
        new_source_count.push(new_source_obj);
      } else {
        new_source_obj = {slug: "subscribervoice", count: source_obj.count, inactive: false, hoverable: true};
        new_source_count.unshift(new_source_obj);
      }
    });
    return new_source_count;
  }
  _renderTopSites() {
    const {paid_account, source_count} = this.props;
    let new_source_count;
    if (paid_account) {
      new_source_count = source_count;
    } else {
      new_source_count = this._unpaidTopSites();
    }
    let TopSiteComponents = new_source_count.map((source_obj, i) => {
    let source_key = source_obj.slug.replace(/-/g, "");
    if ('subscribervoice' === source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {icon, color} = config_info;
      if (i > 5) {return null}
      return (
        <TopSite
          key={source_obj.slug}
          slug={source_obj.slug}
          count={source_obj.count}
          icon={icon}
          color={color}
          inactive={source_obj.inactive}
          hoverable={source_obj.hoverable}
        />
      );
    });
    TopSiteComponents = TopSiteComponents.slice(0,5);
    return (
      <ul className='top-sites'>
        {TopSiteComponents}
      </ul>
    );
  }
  render() {
    return (
      ::this._renderTopSites()
    );
  }
}
@branch({
  paid_account: ['account', 'paid_account'],
  star_breakdown: ['dashboard', 'star_breakdown'],
  onboarding_complete: ['account', 'onboarding_complete'],
})
class Data extends Component {
  _renderData() {
    const {paid_account, star_breakdown, onboarding_complete} = this.props;

    // TODO: more efficient way to order?
    const values = [
      star_breakdown.star_5,
      star_breakdown.star_4,
      star_breakdown.star_3,
      star_breakdown.star_2,
      star_breakdown.star_1,
    ];
    return (
      <div>
        <div className={classnames('left', {paid: paid_account})}>
          <OverallRating />
          <TopSites />
          {
            onboarding_complete && (!paid_account) &&
            <UpgradeButton />
          }
        </div>
        <div className='right'>
          <BarGraph
            width={240}
            xGrid={false}
            textAdjust={7}
            gridAdjust={-6}
            xLabels={false}
            values={values}
          >
            {
              Array(5).fill().map((_,i) => {// 5 stars to 1 star
                let star = 5 - i;
                return (
                  <YLabel key={star}>
                    {star} <i className='fa fa-star'></i>
                  </YLabel>
                )
              })
            }
          </BarGraph>
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
class Reviews extends Component {
  _renderReviews() {
    const {is_loading, paid_account} = this.props;
    return (
      <div className='review-wrapper data-wrapper'>
        <div className='header'>
          <h3>Reviews</h3>
        </div>
        <div className='bottom-data-container review-container'>
          {
            (is_loading) ? <LoadingOverlay /> : <Data {...this.props} />
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviews()
    );
  }
}

export { Reviews };