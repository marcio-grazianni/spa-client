import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Select from 'react-select'
import moment from 'moment'
import classnames from 'classnames'
import sourceConfig from '../../config/review-sources'
import {toggleFeatureLock, changeFilter, changeReviewSite} from './actions'

@branch({
  paid_account: ['account', 'paid_account'],
  grandfathered: ['account', 'grandfathered'],
})
class FilterOption extends Component {
  _onChange() {
    if (!this.props.paid_account && !this.props.grandfathered) {
      this.props.dispatch(toggleFeatureLock);
      return false;
    }
    this.props.dispatch(
      changeFilter,
      this.props.type,
      this.props.option.value,
    );
  }
  _renderFilterOption() {
    const {selected} = this.props;
    const {value, label} = this.props.option;
    const filter_class = classnames(
      'filterOption',
      {'active': (value == selected)}
    );
    return (
      <li className={filter_class}>
        <button onClick={::this._onChange}>
          {label}
        </button>
      </li>
    );
  }
  render() {
    return (
      ::this._renderFilterOption()
    );
  }
}

@branch({
  review_site_selected: ['feed', 'reviews', 'filters', 'review_sites'],
  sources: ['sources'],
  paid_account: ['account', 'paid_account'],
})
class ReviewSitesSelect extends Component {
  _onChange(payload) {
    if (!this.props.paid_account) {
      this.props.dispatch(toggleFeatureLock);
      return false;
    }
    this.props.dispatch(
      changeFilter,
      'review_sites',
      payload.value,
    );
  }
  _renderReviewSitesSelect() {
    const {review_site_selected, sources} = this.props;
    let ReviewSitesOptions = [];
    if (sources) {
      ReviewSitesOptions = sources.map((source) => {
        let source_key = source.replace(/-/g, "");
        if ('subscribervoice' === source_key) {
          source_key = 'appointpal';
        }
        const config_info = sourceConfig[source_key];
        return(
          {
            value: source,
            label: config_info.name,
          }
        );
      });
    }
    ReviewSitesOptions.unshift(
      {
        value: 'appointpal',
        label: 'AppointPal'
      }
    );
    ReviewSitesOptions.unshift(
      {
        value: 'all',
        label: 'All',
      }
    );
    return (
      <Select
        name='review-sites-select'
        value={review_site_selected}
        searchable={false}
        clearable={false}
        options={ReviewSitesOptions}
        onChange={::this._onChange}
      />
    );
  }
  render() {
    return (
      ::this._renderReviewSitesSelect()
    );
  }
}

@branch({
  sxi_selected: ['feed', 'reviews', 'filters', 'sxi'],
  comments_selected: ['feed', 'reviews', 'filters', 'comments']
})
class Filters extends Component {
  _renderFilters() {
    const {sxi_selected, comments_selected} = this.props;

    const SXIOptions = [
      {
        value:"all",
        label:"All"
      },
      {
        value:"advocates",
        label:"Advocates"
      },
      {
        value:"neutral",
        label:"Neutrals"
      },
      {
        value:"adversaries",
        label:"Adversaries"
      }
    ];
    const CommentsOptions = [
      {
        'value': 'all',
        'label': 'All'
      },
      {
        'value': 'comments',
        'label': 'Comments'
      }
    ];

    let SXIFilterOptions = [];
    for (var option of SXIOptions) {
      let filterOption = <FilterOption
          type='sxi'
          selected={sxi_selected}
          option={option}
          key={option.value}
        />
      SXIFilterOptions.push(filterOption);
    }

    let CommentsFilterOptions = [];
    for (var option of CommentsOptions) {
      let filterOption = <FilterOption
          type='comments'
          selected={comments_selected}
          option={option}
          key={option.value}
        />
      CommentsFilterOptions.push(filterOption);
    }

    return (
      <div className='filters-wrapper'>
        <h4><img src={Django.static('images/sites-icon.svg')} /> Sources</h4>
          <ReviewSitesSelect />
        <h4><i className='fa fa-filter'></i>Filter</h4>
        <ul className='filter sxi-filter'>
          {SXIFilterOptions}
        </ul>
        <h4><i className='fa fa-desktop'></i> Display</h4>
        <ul className='filter comments-filter'>
          {CommentsFilterOptions}
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderFilters()
    );
  }
}

export { Filters };