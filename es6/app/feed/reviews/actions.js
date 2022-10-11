import axios from 'axios'

function updateFeed(tree, end_item, response) {
    if(response.data) {
      const feed = response.data.feed;
        if (!feed || 0 === feed.length) {
          tree.select('feed', 'reviews', 'has_more').set(false);
        }
        else if (feed.length < 10) {
          tree.select('feed', 'reviews', 'has_more').set(false);
          tree.select('feed', 'reviews', 'items').concat(feed);
          tree.select('feed', 'reviews', 'current_item').set(end_item);
        }
        else if (!response.data.paid_account) {
          tree.select('feed', 'reviews', 'items').concat(feed);
          tree.select('feed', 'reviews', 'current_item').set(end_item);
          tree.select('feed').select('feed_lock').set(true);
        }
        else {
          tree.select('feed', 'reviews', 'items').concat(feed);
          tree.select('feed', 'reviews', 'current_item').set(end_item);
        }
      }
      tree.select('feed', 'reviews', 'loading').set(false);
      tree.select('feed', 'reviews', 'initial_load_complete').set(true);
      tree.commit();
}

export function initialLoad(tree) {
  // reset all stuff on initial load
  tree.select('feed', 'reviews', 'load_initial').set(false);
  tree.select('feed', 'reviews', 'loading').set(true);
  tree.commit();
  tree.select('feed', 'reviews', 'current_item').set(0);
  tree.select('feed', 'reviews', 'items').set([]);
  tree.select('feed', 'feed_lock').set(false);
  tree.select('feed', 'feed_lock_prompt', 'visible').set(false);
  tree.commit();

  // TODO: make this more DRY by making common function
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
  const increment = 10;
  const start_item = tree.select('feed', 'reviews').get('current_item');
  const end_item = start_item + increment;
  const source = tree.select('feed', 'reviews', 'filters').get('review_sites');
  const sxi =  tree.select('feed', 'reviews', 'filters').get('sxi');
  const comments =  tree.select('feed', 'reviews', 'filters').get('comments');

  axios({
    method: 'post',
    url: '/engagement/update-engagement-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start_item': start_item,
      'end_item': end_item,
      'source': source,
      'sxi': sxi,
      'comments': comments
    }
  }).then((response) => {
    updateFeed(tree, end_item, response);
  });
}

export function loadMore(tree) {
  // if doing the initial load then return false
  if (tree.get('feed', 'reviews', 'load_initial') || tree.get('feed', 'loading')) {
    return false;
  }
  tree.select('feed', 'reviews', 'loading').set(true);
  tree.commit();
  // TODO: make this more DRY by making common function
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
  const increment = 10;
  const start_item = tree.select('feed', 'reviews').get('current_item');
  const end_item = start_item + increment;
  const source = tree.select('feed', 'reviews', 'filters').get('review_sites');
  const sxi =  tree.select('feed', 'reviews', 'filters').get('sxi');
  const comments =  tree.select('feed', 'reviews', 'filters').get('comments');

  // Don't load more than 10 if not paid account not grandfathrered
  if (end_item > 10 && !paid_account) {
    return false;
  }

  axios({
    method: 'post',
    url: '/engagement/update-engagement-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start_item': start_item,
      'end_item': end_item,
      'source': source,
      'sxi': sxi,
      'comments': comments
    }
  }).then((response) => {
    updateFeed(tree, end_item, response);
  });

}

export function changeFilter(tree, type, payload) {
  // sets new filter type
  tree.select('feed', 'reviews', 'loading').set(true);
  tree.commit();
  tree.select('feed', 'reviews', 'filters', type).set(payload);
  tree.commit();
  // resets feed
  tree.select('feed', 'reviews', 'has_more').set(true);
  tree.select('feed', 'reviews', 'items').set([]);
  tree.select('feed', 'reviews', 'current_item').set(0);
  tree.commit();
  // TODO: make this more DRY by making common function
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
  const increment = 10;
  const start_item = tree.select('feed', 'reviews').get('current_item');
  const end_item = start_item + increment;
  const source = tree.select('feed', 'reviews', 'filters').get('review_sites');
  const sxi =  tree.select('feed', 'reviews', 'filters').get('sxi');
  const comments =  tree.select('feed', 'reviews', 'filters').get('comments');

  // Don't load more than 10 if not paid account
  if (end_item > 10 && !paid_account) {
    return false
  }

  axios({
    method: 'post',
    url: '/engagement/update-engagement-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start_item': start_item,
      'end_item': end_item,
      'source': source,
      'sxi': sxi,
      'comments': comments
    }
  }).then((response) => {
    updateFeed(tree, end_item, response);
  });

}

export function expandComment(tree, session_id, payload) {
  tree.select('feed', 'reviews', 'items', {session_id}, 'expanded').set(payload);
}

export function exportFeed(tree) {
  axios({
    method: 'post',
    url: '/engagement/export',
    headers: {"X-CSRFToken": Django.csrf_token()}
  }).then((response) => {
    tree.select('alert').set({
      body: 'Your data is being exported and will be sent to you via email.',
      alert_type: 'success',
    });
  }).catch((error) => {
    tree.select('alert').set({
      body: 'Something went wrong. Please try again and contact us if problem persists.',
      alert_type: 'error',
    });
  });
}
