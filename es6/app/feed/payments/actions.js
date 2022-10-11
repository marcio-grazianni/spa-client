import axios from 'axios'

export function initialLoad(tree) {
  // reset all stuff on initial load
  tree.select('feed', 'payments', 'load_initial').set(false);
  tree.select('feed', 'payments', 'loading').set(true);
  tree.commit();
  tree.select('feed', 'payments', 'pages_loaded').set(0);
  tree.select('feed', 'payments', 'items').set([]);
  tree.select('feed', 'feed_lock').set(false);
  tree.select('feed', 'feed_lock_prompt', 'visible').set(false);
  tree.commit();

  fetchData(tree);
}

export function loadMore(tree) {
  // if doing the initial load then return false
  if (tree.get('feed', 'payments', 'load_initial') || tree.get('feed', 'loading')) {
    return false;
  }
  tree.select('feed', 'payments', 'loading').set(true);
  tree.commit();

  fetchData(tree);
}

export function changeFilter(tree, type, payload) {
  // sets new filter type
  tree.select('feed', 'payments', 'loading').set(true);
  tree.commit();
  tree.select('feed', 'payments', 'filters', type).set(payload);
  tree.commit();
  // resets feed
  tree.select('feed', 'payments', 'has_more').set(true);
  tree.select('feed', 'payments', 'items').set([]);
  tree.select('feed', 'payments', 'pages_loaded').set(0);
  tree.commit();

  fetchData(tree);

}

function fetchData(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }

  const paid_account = tree.select('account').get('paid_account');
  const grandfathered = tree.select('account').get('grandfathered');
  const increment = 10;
  const pages_loaded = tree.select('feed', 'payments').get('pages_loaded');
  let source_filter = tree.select('feed', 'payments', 'filters').get('payment_source');
  if('all' === source_filter) {
      source_filter = '';
  }
  let status_filter =  tree.select('feed', 'payments', 'filters').get('status');
  if('all' === status_filter) {
      status_filter = '';
  }

  // Don't load more than 10 if not paid account not grandfathrered
  if (pages_loaded > 0 && !paid_account && !grandfathered) {
    return false;
  }

  axios({
    method: 'get',
    url: `/api/transactions/?account_id=${selected_id}&page=${pages_loaded+1}&page_size=${increment}&effective_status=${status_filter}&payment_source=${source_filter}&provider=${provider_id}`
  }).then((response) => {
    if(response.data) {
      const results = response.data.results;
        if (0 === results.length) {
          tree.select('feed', 'payments', 'has_more').set(false);
        }
        else if (results.length < 10) {
          tree.select('feed', 'payments', 'has_more').set(false);
          tree.select('feed', 'payments', 'items').concat(results);
          tree.select('feed', 'payments', 'pages_loaded').set(pages_loaded+1);
        }
        else if (!paid_account && !grandfathered) {
          tree.select('feed', 'payments', 'items').concat(results);
          tree.select('feed', 'payments', 'pages_loaded').set(pages_loaded+1);
          tree.select('feed').select('feed_lock').set(true);
        }
        else {
          tree.select('feed', 'payments', 'items').concat(results);
          tree.select('feed', 'payments', 'pages_loaded').set(pages_loaded+1);
        }
      }
      tree.select('feed', 'payments', 'loading').set(false);
      tree.commit();
  });
}


