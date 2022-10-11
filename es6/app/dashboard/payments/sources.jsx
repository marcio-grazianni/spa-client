import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {LoadingOverlay} from '../loading-overlay'
import {UpgradeButton} from './upgrade-button'
import {BreakdownDonut, DonutCenter} from '../../UI/graphs/breakdown-donut'
import {toggleUpgradePrompt} from '../../actions'
import {changeSelectedSource} from './actions'
import sourceConfig from '../../config/payment-sources'

@branch({
  selected_source: ['dashboard', 'selected_payment_source'],
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
    const {selected_source, slug, count, text_color} = this.props;
    let source_key = slug;
    if(!source_key) {
      source_key = 'appointpal';
    }
    const config_info = sourceConfig[source_key];
    const {name, icon, color} = config_info;
    if (count == 0) {
      return(
        <li className='inactive'>
          <span
            className={`icon ${slug}`}
            style={{background: color}}
          >
            {icon}
          </span>
          <span className='site'>{name}</span>
          <span className='rating'><i className='fa fa-minus'></i></span>
        </li>
      );
    }
    return(
      <li
        className={classnames({active: (selected_source === slug)})}
        onClick={::this._changeSelectedSource}
      >
        <span
          className={`icon ${slug}`}
          style={{background: color}}
        >
          {icon}
        </span>
        <span className='site' style={{color: text_color}}>{name}</span>
        <span className='rating'>{count}</span>
      </li>
    );
  }
}

@branch({
  source_count: ['dashboard', 'payment_source_count_ordered'],
})
class SourceList extends Component {
  _renderSourceList() {
    const {source_count} = this.props;
    const colors = ['#4E224E', '#6D236D', '#893989', '#D4327F'];
    let SourceComponents = source_count.map((source_obj, i) =>
      <SourceItem key={source_obj.slug} slug={source_obj.slug} count={source_obj.count} text_color={colors[i]} />
    );
    return (
      <ul className='site-list extra-padding'>
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
  selected_source: ['dashboard', 'selected_payment_source'],
  source_count: ['dashboard', 'payment_source_count_ordered'],
  onboarding_complete: ['account', 'onboarding_complete'],
})
class Data extends Component {
  _renderData() {
    const {paid_account, selected_source, source_count, onboarding_complete} = this.props;
    let total_count = 0;
    let selected_source_count = 0;
    let data = [0, 0, 0, 0, 0];
    if(selected_source && source_count) {
      for(let i = 0; i < source_count.length; i++) {
        let count = source_count[i].count;
        data[i] = count;
        total_count += count;
        if(selected_source == source_count[i].slug) {
          selected_source_count = count;
        }
      }
    }
    const colors = ['#4E224E', '#6D236D', '#893989', '#D4327F'];
    return (
      <div>
        <div className='left'>
          <BreakdownDonut data={data}>
            <DonutCenter>
              <h3>{selected_source_count}</h3>
              <div className='of-label'>of {total_count}</div>
            </DonutCenter>
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
  is_loading: ['dashboard', 'payments_is_loading'],
  reviews: ['dashboard', 'reviews'],
})
class Sources extends Component {
  _renderSources() {
    const {is_loading, paid_account} = this.props;
    return (
      <div className='site-review-wrapper data-wrapper'>
        <div className='header'>
          <h3>Card Types</h3>
        </div>
        <div className='bottom-data-container site-review-container card-types-container'>
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