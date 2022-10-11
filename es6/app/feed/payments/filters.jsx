import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Select from 'react-select'
import moment from 'moment'
import classnames from 'classnames'
import sourceConfig from '../../config/payment-sources'
import {toggleFeatureLock, changeFilter} from './actions'

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
  selected: ['feed', 'payments', 'filters', 'payment_source'],
  paid_account: ['account', 'paid_account'],
})
class PaymentSourceSelect extends Component {
  _onChange(payload) {
    if (!this.props.paid_account) {
      this.props.dispatch(toggleFeatureLock);
      return false;
    }
    this.props.dispatch(
      changeFilter,
      'payment_source',
      payload.value,
    );
  }
  _renderPaymentSourceSelect() {
    const sources = ['Amex', 'Discover', 'Mastercard', 'Visa'];
    const {selected} = this.props;
    let PaymentSourceOptions = [];
    PaymentSourceOptions = sources.map((source) => {
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
    PaymentSourceOptions.unshift(
      {
        value: 'all',
        label: 'All',
      }
    );
    return (
      <Select
        name='payment-source-select'
        value={selected}
        searchable={false}
        clearable={false}
        options={PaymentSourceOptions}
        onChange={::this._onChange}
      />
    );
  }
  render() {
    return (
      ::this._renderPaymentSourceSelect()
    );
  }
}

@branch({
  selected: ['feed', 'payments', 'filters', 'status'],
})
class Filters extends Component {
  _renderFilters() {
    const {selected} = this.props;

    const StatusOptions = [
      {
        value:"all",
        label:"All"
      },
      {
        value:"Succeeded",
        label:"Succeeded"
      },
      {
        value:"Failed",
        label:"Failed"
      },
      {
        value:"Refunded",
        label:"Refunded"
      }
    ];
    let StatusFilterOptions = [];
    for (var option of StatusOptions) {
      let filterOption = <FilterOption
          type='status'
          selected={selected}
          option={option}
          key={option.value}
        />
      StatusFilterOptions.push(filterOption);
    }

    return (
      <div className='filters-wrapper'>
        <h4><img src={Django.static('images/sites-icon.svg')} /> Sources</h4>
          <PaymentSourceSelect />
        <h4><i className='fa fa-filter'></i>Filter</h4>
        <ul className='filter sxi-filter'>
          {StatusFilterOptions}
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