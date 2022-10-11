const feed = {
  selected_top_menu: Django.feed_selected_top_menu || 'payments',
  payments: {
    items: [],
    pages_loaded: 0,
    load_initial: false,
    has_more: true,
    loading: false,
    filters: {
      payment_source: 'all',
      status: 'all'
    }
  },
  reviews: {
    items: [],
    current_item: 0,
    load_initial: false,
    has_more: true,
    loading: false,
    filters: {
      sxi: 'all',
      comments: 'comments',
      review_sites: Django.default_feed_source
    }
  },
  feature_lock: false,
  feed_lock: false,
  feed_lock_prompt: {
    visible: false
  }
}

export default feed;