import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {FeedList} from './payments/feed-list'
import {Filters} from './payments/filters'
import {initialLoad} from './payments/actions'

@branch({
  selected_account_id: ['account', 'selected_account_id'],
  selected_provider: ['account', 'selected_provider']
})
class PaymentsFeed extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id, selected_provider} = this.props;
    let prevProviderId = null;
    const prevProvider = prevProps.selected_provider;
    if(prevProvider) {
      prevProviderId = prevProvider.id;
    }
    let selected_provider_id = null;
    if(selected_provider) {
      selected_provider_id = selected_provider.id;
    }
    if(prevProps.selected_account_id !== selected_account_id || prevProviderId !== selected_provider_id) {
      this.props.dispatch(initialLoad, true);
    }
  }
  _renderPaymentsFeed() {
    return (
      <div className='main-container'>
        <FeedList />
        <div className='right'>
          <Filters />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderPaymentsFeed()
    );
  }
}

export { PaymentsFeed };
