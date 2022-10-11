import tree from '../state'
import axios from 'axios'

let select_available_active = () => { //resets active testimonial to top of list and turns off reply box
  tree.select('testimonials').select('active_testimonial').set(null);
  tree.select('testimonials').select('reply_active').set(false);
  tree.select('testimonials').select('reply_content').set('');
  //get item at top of the displayed list and make it active
  const top_item = tree.select('testimonials').get('displayed_testimonials')[0];
  if (top_item) {
    tree.select('testimonials').select('active_testimonial').set(top_item.session_id);
  }
}

let close_confirmation = () => {
  tree.select('confirmation').set(false);
}

export function initialLoad(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
    method: 'get',
    url: '/engagement/testimonial-list/?account_id=' + selected_id
  }).then((response) => {
    tree.select('testimonials').select('testimonial_list').set(response.data);
    select_available_active();
  }).catch((error) => {
    console.log(error);
  });
}

export function changeFilter(tree, filterId) {
  tree.select('testimonials').select('selected_filter').set(filterId);
  select_available_active();
  tree.select('alert').set(false);
}

export function onChangeSection(tree) { //set selected testimonial to top and remove alert
  select_available_active();
  tree.select('alert').set(false);
}

export function selectTestimonial(tree, testimonialId) {
  tree.select('testimonials').select('active_testimonial').set(testimonialId);
  tree.select('testimonials').select('reply_active').set(false);
  tree.select('alert').set(false);
}

export function replyToggle(tree) {
  tree.select('testimonials').select('reply_active').set(true);
}

export function changeReplyContent(tree, contentValue) {
  tree.select('testimonials').select('reply_content').set(contentValue);
  tree.select('testimonials').select('errors', 'reply').set(false);
  tree.commit();
}

export function post(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'post'
    }
  }).then((response) => {
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('posted_status').set('posted');
    close_confirmation();
    select_available_active();
    tree.select('alert').set({
      body: 'Testimonial successfully posted to your testimonial page.',
      alert_type: 'success'
    });
  });
}

export function unPost(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'unpost'
    }
  }).then((response) => {
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('posted_status').set('pending');
    active_testimonial_cursor.select('pin_status').set(false); //unpinned when unposted
    active_testimonial_cursor.select('reply').set(null); //replies will be deleted when unposted
    active_testimonial_cursor.select('status').set('open');
    close_confirmation();
    select_available_active();
    tree.select('alert').set({
      body: 'Testimonial successfully removed from your testimonial page.',
      alert_type: 'success'
    });
  });
}

export function flag(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'flag'
    }
  }).then((response) => {
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('posted_status').set('flagged');
    close_confirmation();
    select_available_active();
    tree.select('alert').set({
      body: 'Testimonial flagged and removed from your pending queue.',
      alert_type: 'error'
    });
  });
}

export function unFlag(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'unflag'
    }
  }).then((response) => {
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('posted_status').set('pending');
    close_confirmation();
    select_available_active();
    tree.select('alert').set({
      body: 'Testimonial unflagged and added back to your pending queue.',
      alert_type: 'success'
    });
  });
}

export function pin(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'pin'
    }
  }).then((response) => {
    if (response.data) { //If theres a response body we unpin item
      tree.select('testimonials').select('testimonial_list', {session_id: response.data.unpin_id}, 'pin_status').set(false);
    }
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('pin_status').set(true);
    close_confirmation();
    tree.select('alert').set({
      body: 'Testimonial has been pinned to the top of your testimonial page.',
      alert_type: 'success'
    });
  });
}

export function unPin(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'unpin'
    }
  }).then((response) => {
    const active_testimonial_cursor = tree.select('testimonials').select('testimonial_list', {session_id: active_id});
    active_testimonial_cursor.select('pin_status').set(false);
    close_confirmation();
    tree.select('alert').set({
      body: 'Testimonial has been unpinned from the top of your testimonial page.',
      alert_type: 'success'
    });
  });
}

export function cancelReply(tree) {
  tree.select('testimonials').select('reply_active').set(false);
  tree.select('testimonials').select('reply_content').set('');
}

export function checkReply(tree) {
  const reply_content = tree.select('testimonials').get('reply_content');
  if (reply_content == '') { //if no reply entered. trigger error
    tree.select('testimonials').select('errors', 'reply').set(true)
    return true
  }
  return false
}

export function reply(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const active_id = tree.select('testimonials').get('active_testimonial');
  const reply_content = tree.select('testimonials').get('reply_content');
  axios({
    method: 'post',
    url: '/engagement/update-testimonial/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'id': active_id,
      'action': 'reply',
      'reply': reply_content
    }
  }).then((response) => {
    tree.select('testimonials').select('testimonial_list', {session_id: active_id}).set(response.data.testimonial);
    close_confirmation();
    select_available_active();
    tree.select('alert').set({
      body: 'Testimonial has been successfully replied to.',
      alert_type: 'success'
    });
  });
}

export function testimonialLock(tree) {
  tree.select('testimonials', 'testimonial_lock').set(true);
}
