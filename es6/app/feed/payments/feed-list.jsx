import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import InfiniteScroll from 'react-infinite-scroller'
import {FeedItem} from './feed-item'
import {initialLoad, loadMore} from './actions'

class Loader extends Component {
  render() {
    return (
      <div className="loader">
        <h5>
          <i className='fa fa-spinner fa-spin'></i>
          <span>Loading ...</span>
        </h5>
      </div>
    );
  }
}

@branch({
  items: ['feed', 'payments', 'items'],
  loading: ['feed', 'payments', 'loading'],
  feed_lock: ['feed', 'feed_lock'],
  has_more: ['feed', 'payments', 'has_more'],
  load_initial: ['feed', 'payments', 'load_initial'],
})
class FeedList extends Component {
  _load_more() {
    if (this.props.load_initial) {
      this.props.dispatch(initialLoad);
    } else {
      this.props.dispatch(loadMore);
    }
  }
  _renderFeedList() {
    const {items, loading, feed_lock, has_more, load_initial} = this.props;
    let FeedItems = items.map((item, i) =>
      <FeedItem item={item} key={i} />
    );
    const data = (FeedItems.length > 0);
    return(
      <div className='feed-wrapper'>
        {
          (!data) &&
          <div className='no-reviews'>
            <i className='fa fa-rss'></i>
            <p className='no-reviews'>No recent payments to show</p>
          </div>
        }
        <InfiniteScroll
          pageStart={0}
          loadMore={::this._load_more}
          hasMore={(has_more && (!feed_lock) && (!loading))}
          useWindow={true}
          initialLoad={load_initial}
          threshold={250}
          loader={<Loader />}
        >
          <ul className='feed'>
            {FeedItems}
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
  render() {
    return(
      ::this._renderFeedList()
    );
  }
}

export { FeedList };