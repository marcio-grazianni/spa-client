import request from 'superagent'
import moment from 'moment'

let isImage = (type) => {
  let [file_type, file_suffix] = type.split('/');
  const allowed_types = ['png', 'jpg', 'jpeg', 'gif'];
  return ( (file_type === 'image') && (allowed_types.includes(file_suffix)) )
}

let hasChanged = (dataArray) => {
  let changed = false;
  dataArray.forEach((data) => {
    if (data.has_changed) {
      changed = true;
    }
  });
  return changed
}

let validateRequired = (cursorArray) => {
  /* Checks if all required cursors are set and
  sets an error if any required
  items have been left blank */
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      cursor.select('error').set('This field is required.');
      error = true;
    }
  });
  return !error
}

let validate = (value) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);

let validateEmail = (cursorArray) => {
  // Checks for valid Email and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid Email.');
      error = true;
    }
  });
  return !error
}

let validateURL = (cursorArray) => {
  let validate = (value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);

  // Checks for valid URL and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid URL.');
      error = true;
    }
  });
  return !error
}

let validatePhone = (cursorArray) => {
  let validate = (value) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);

  // Checks for valid phone number and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid phone number.');
      error = true;
    }
  });
  return !error
}

let validatePassword = (passwordCursor, set_error) => {
  // Validates a single password if set_error then we set errors
  // Returns true if there was an error

  let validate = (value) => /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,128}$/.test(value);

  // Password must have 8 characters
  if (!validate(passwordCursor.get('value'))) {
    if (set_error && passwordCursor.get('value') !== "") {
      // if we should set the error *on submit* and value is not ""
      passwordCursor.select('error').set('Your password must be >= 8 characters and contain at least 1 letter and 1 number.')
    }
    return false
  }
  return true
}

let matchedValidation = (tree) => {
  // Check if password 2 matches password 1 if not matched. we set error on password_2
  const new_password_1 = tree.select('settings', 'inputs', 'new_password_1');
  const new_password_2 = tree.select('settings', 'inputs', 'new_password_2');
  let match = (new_password_1.get('value') === new_password_2.get('value'));
  if (!match) {
    new_password_2.select('error').set('Your passwords do not match');
  }
  return match
}

let passwordValidation = (tree) => {
  // Runs on any password change. checks to see if valid password and checks if the two passwords match.
  const new_password_1 = tree.select('settings', 'inputs', 'new_password_1');
  const new_password_2 = tree.select('settings', 'inputs', 'new_password_2');

  let password_verified = validatePassword(new_password_1);

  // Match validation will only be set if password 1 is valid and the passwords match
  let match = ((new_password_1.get('value') === new_password_2.get('value')) && password_verified);
  tree.select('settings', 'password_validation', 'verified').set(password_verified);
  tree.select('settings', 'password_validation', 'match').set(match);
}

export function initialLoad(tree) {
  const account_id = tree.get('account', 'account_id');
  const vertical = tree.get('account', 'vertical');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let settings_req = request.get(`/get-settings/?account_id=${selected_id}`)
  .end(function(err, res) {
    if (!(err) && !(res.error) && (res.body)) {
      // TODO: write error handler... duh
      Object.entries(res.body.settings_data).forEach(([key, value]) => {
        tree.select('settings', 'inputs', key, 'value').set(value);
      });
      tree.select('settings', 'subscribers', 'subscriber_list').set(res.body.subscriber_list);
      // Reset Logo preview and format
      tree.select('settings', 'inputs', 'company_logo', 'preview').set(false);
      tree.select('settings', 'inputs', 'company_logo', 'format').set(false);
    }
  });
  let review_source_req = request.get(`/get-review-sources/?account_id=${selected_id}`)
  .end(function(err, res) {
    if (!(err) && !(res.error) && (res.body)) {
      tree.select('settings', 'review_sites', 'all_sources').set(res.body.all_sources);

      // Set currently selected profile as the first of all sources
      tree.select('settings', 'review_sites', 'add_profile').set(res.body.all_sources[0].review_source_id);
    }
  });
}

export function onChangeSection(tree) {
  const settings_lock = tree.select('account', 'settings_lock').get();
  if(settings_lock) {
    return false;
  }
  tree.select('alert').set(false);
}

export function setSettingsLock(tree) {
  tree.select('settings', 'selected_top_menu').set('notifications');
}

export function selectTable(tree, table) {
    tree.select('settings', 'activity', 'selected').set(table);
    tree.select('settings', 'activity', 'search_query').set("");
    tree.select('settings', 'activity', table, 'search_query').set("");
}

export function changeValue(tree, value, input_id) {
  // TODO: IF password/special type run validation functions
  tree.select('settings', 'inputs', input_id, 'value').set(value);
  tree.select('settings', 'inputs', input_id, 'has_changed').set(true);
  tree.select('settings', 'inputs', input_id, 'error').set(false);
  tree.commit();
  if ((input_id === 'new_password_1') || (input_id === 'new_password_2')) {
    passwordValidation(tree)
  }
}

export function changeLogo(tree, files) {
  // Reset errors
  tree.select('settings', 'inputs', 'company_logo', 'error').set(false)

  // we only accept the first file
  const file = files[0];
  if ( !(isImage(file.type)) ) {
    tree.select('settings', 'inputs', 'company_logo', 'error').set("The file you have selected is not the correct format.")
    return false
  }
  let reader = new FileReader();
  reader.onload = (e) => {
    let bstr = e.target.result;
    let b64 = btoa(bstr);
    tree.select('settings', 'inputs', 'company_logo', 'preview').set(file.preview);
    tree.select('settings', 'inputs', 'company_logo', 'value').set(b64);
    tree.select('settings', 'inputs', 'company_logo', 'format').set(file.type);
    tree.select('settings', 'inputs', 'company_logo', 'has_changed').set(true);

  }
  reader.readAsBinaryString(file);
}

export function saveCompanyInfo(tree) {
  const company_url_cursor = tree.select('settings', 'inputs', 'company_url');
  const company_logo_cursor = tree.select('settings', 'inputs', 'company_logo');
  const company_tz_cursor = tree.select('settings', 'inputs', 'company_tz');
  const reply_to_cursor = tree.select('settings', 'inputs', 'reply_to');
  const tax_rate_cursor = tree.select('settings', 'inputs', 'tax_rate');

  // Reset any alerts
  tree.select('alert').set(false);

  // Reset logo error
  tree.select('settings', 'inputs', 'company_logo', 'error').set(false)

  if (!hasChanged([company_url_cursor.get(), company_logo_cursor.get(), company_tz_cursor.get(), reply_to_cursor.get(), tax_rate_cursor.get()])) {
    // Nothing has changed so just set an error and return false
    tree.select('alert').set({
      body: 'You haven\'t made any changes!',
      alert_type: 'error'
    });
    window.scrollTo(0, 0);
    return false
  }

  // check for required items
  let required_errors = !validateRequired([
    company_url_cursor,
    company_logo_cursor,
    company_tz_cursor,
    tax_rate_cursor
  ]);

  // check for url validation
  let url_errors = !validateURL([
    company_url_cursor,
  ]);

  // check for email validation
  let email_errors = !validateEmail([
    reply_to_cursor,
  ]);

  if (required_errors || url_errors || email_errors) {
    // if any errors caught.. return false
    window.scrollTo(0, 0);
    return false
  }

  // only send a logo value if we've made changes
  let logo_value = '';
  let logo_format = '';
  if (company_logo_cursor.get('has_changed')) {
    logo_value = encodeURIComponent(company_logo_cursor.get('value'));
    logo_format = company_logo_cursor.get('format');
  }
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let company_url = company_url_cursor.get('value');
  if (company_url) {
      company_url = encodeURI(company_url);
  }
  let reply_to = reply_to_cursor.get('value');
  if (reply_to) {
      reply_to = encodeURIComponent(reply_to);
  }
  const tax_rate = tax_rate_cursor.get('value');
  let new_tax_rate = null;
  if(tax_rate_cursor.get('has_changed')) {
      new_tax_rate = tax_rate / 100.0;
  }
  let req = request.post('/save-company-info/')
    .send(`account_id=${selected_id}`)
    .send(`company_url=${company_url}`)
    .send(`company_logo=${logo_value}`)
    .send(`logo_format=${logo_format}`)
    .send(`company_tz=${company_tz_cursor.get('value')}`)
    .send(`tax_rate=${tax_rate}`)
    .send(`reply_to=${reply_to}`)
  .end(function(err, res) {
    if (res.status === 200) {
      if (res.body) {
        tree.select('account', 'account_logo').set(Django.media_url + res.body.logo);
        tree.select('user', 'account_url').set(res.body.url);
      }
      if(new_tax_rate) {
          tree.select('appointpal', 'invoice_builder', 'tax_rate').set(new_tax_rate);
          tree.select('appointpal', 'tools', 'invoice', 'tax_rate').set(new_tax_rate);
          tree.commit();
      }
      tree.select('alert').set({
        body: 'Your company info has been successfully updated.',
        alert_type: 'success'
      });
    } else {
      tree.select('alert').set({
        body: 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.',
        alert_type: 'error'
      });
    }
    window.scrollTo(0, 0);
  });
}

export function saveUserInfo(tree) {
  const first_name_cursor = tree.select('settings', 'inputs', 'first_name');
  const last_name_cursor = tree.select('settings', 'inputs', 'last_name');
  const phone_number_cursor = tree.select('settings', 'inputs', 'phone_number');
  const weekly_digest_cursor = tree.select('settings', 'inputs', 'weekly_digest');
  const email_notifications_cursor = tree.select('settings', 'inputs', 'email_notifications');

  // Reset any alerts
  tree.select('alert').set(false);
  if (!hasChanged([first_name_cursor.get(), last_name_cursor.get(), phone_number_cursor.get(), weekly_digest_cursor.get(), email_notifications_cursor.get()])) {
    // Nothing has changed so just set an error and return false
    tree.select('alert').set({
      body: 'You haven\'t made any changes!',
      alert_type: 'error'
    });
    window.scrollTo(0, 0);
    return false
  }

  // check for required items
  let required_errors = !validateRequired([
    first_name_cursor,
    last_name_cursor,
  ]);

  // check for phone validation
  let phone_errors = !validatePhone([
    phone_number_cursor,
  ]);

  if (required_errors || phone_errors) {
    // if any errors caught.. return false
    window.scrollTo(0, 0);
    return false
  }

  let req = request.post('/save-user-info/')
    .send(`first_name=${first_name_cursor.get('value')}`)
    .send(`last_name=${last_name_cursor.get('value')}`)
    .send(`phone_number=${phone_number_cursor.get('value')}`)
    .send(`weekly_digest=${weekly_digest_cursor.get('value')}`)
    .send(`email_notifications=${email_notifications_cursor.get('value')}`)
  .end(function(err, res) {
    if (res.status === 200) {
      // if successful we update our user state
      tree.select('user', 'first_name').set(first_name_cursor.get('value'));
      tree.select('user', 'last_name').set(last_name_cursor.get('value'));
      tree.select('user', 'phone_number').set(phone_number_cursor.get('value'));
      tree.select('alert').set({
        body: 'Your user info has been successfully updated.',
        alert_type: 'success'
      });
    } else {
      tree.select('alert').set({
        body: 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.',
        alert_type: 'error'
      });
    }
    window.scrollTo(0, 0);
  });
}

export function changePassword(tree) {
  const current_password_cursor = tree.select('settings', 'inputs', 'current_password');
  const new_password_1_cursor = tree.select('settings', 'inputs', 'new_password_1');
  const new_password_2_cursor = tree.select('settings', 'inputs', 'new_password_2');

  // Reset any alerts
  tree.select('alert').set(false);

  // Check if any values have changed
  if (!hasChanged([current_password_cursor.get(), new_password_1_cursor.get(), new_password_2_cursor.get()])) {
    // Nothing has changed so just set an error and return false
    tree.select('alert').set({
      body: 'You haven\'t made any changes!',
      alert_type: 'error'
    });
    window.scrollTo(0, 0);
    return false
  }

  // All three passwords are required
  let required_errors = !validateRequired([
    current_password_cursor,
    new_password_1_cursor,
    new_password_2_cursor,
  ]);

  // Check if both new passwords are valid **set errors **pass true
  let password_errors = (!validatePassword(new_password_1_cursor, true) || !validatePassword(new_password_2_cursor, true));

  // Check if second password matches first
  let matched_errors = !matchedValidation(tree);

  if (required_errors || password_errors || matched_errors) {
    // if any errors return false
    window.scrollTo(0, 0);
    return false
  }

  let req = request.post('/change-password/')
    .send(`old_password=${current_password_cursor.get('value')}`)
    .send(`new_password1=${new_password_1_cursor.get('value')}`)
    .send(`new_password2=${new_password_2_cursor.get('value')}`)
  .end(function(err, res) {
    if (res.status === 200) {
      tree.select('alert').set({
        body: 'Your password has been successfully changed.',
        alert_type: 'success'
      });
    } else {
      // Default error body
      let error_body = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if (res.body.error) {
        error_body = res.body.error;
      }
      tree.select('alert').set({
        body: error_body,
        alert_type: 'error'
      });
    }
    window.scrollTo(0, 0);
  });
}

export function saveNotifications(tree) {
  const email_notifications_cursor = tree.select('settings', 'inputs', 'email_notifications');
  const weekly_digest_cursor = tree.select('settings', 'inputs', 'weekly_digest');

  // Reset any alerts
  tree.select('alert').set(false);

  if (!hasChanged([weekly_digest_cursor.get(), email_notifications_cursor.get()])) {
    // Nothing has changed so just set an error and return false
    tree.select('alert').set({
      body: 'You haven\'t made any changes!',
      alert_type: 'error'
    });
    window.scrollTo(0, 0);
    return false
  }

  let req = request.post('/save-notification-preferences/')
    .send(`email_notifications=${email_notifications_cursor.get('value')}`)
    .send(`weekly_digest=${weekly_digest_cursor.get('value')}`)
  .end(function(err, res) {
    if (res.status === 200) {
      tree.select('alert').set({
        body: 'Your notification settings have been successfully updated.',
        alert_type: 'success'
      });
    } else {
      tree.select('alert').set({
        body: 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.',
        alert_type: 'error'
      });
    }
    window.scrollTo(0, 0);
  });
}

export function changeSelectedProfile(tree, value) {
  tree.select('settings', 'review_sites', 'add_profile').set(value);
}

function reviewSiteOrder(reviewSites) {
  let active_count = 0;
  const ordered_review_sites = reviewSites.map((site, index) => {
    let active_state = site.active;
    if (site.active) {
      active_count += 1;
    }
    if (active_count > 4) { // if we already have 4 active sources then all remaining should be made inactive
      active_state = false;
    } else if (site.url !== '' && (!site.active)) { // else if not empty url string and previously inactive we should activate
      active_state = true;
      active_count += 1
    }
    const new_order = {...site, id: site.review_feed_id, order: index + 1, url: site.url, active: active_state};
    return new_order
  });
  return ordered_review_sites
}

export function addProfile(tree) {
  tree.select('settings', 'review_sites', 'has_changed').set(true);
  const review_sites = tree.get('settings', 'review_sites', 'current_sources');
  const review_source_id = parseInt(tree.get('settings', 'review_sites', 'add_profile'));
  const all_sources = tree.get('settings', 'review_sites', 'all_sources');
  const selected_source = tree.get('settings', 'review_sites', 'all_sources', {review_source_id});
  const random_new_id = Math.round(Math.random()*10000) + 1;
  let new_source = {
    name: selected_source.name,
    order: (review_sites.length + 1),
    review_feed_id: `new-${random_new_id}-${review_source_id}`,
    review_source_id,
    slug: selected_source.slug,
    url: "",
    new: true,
    parent_slug: selected_source.parent_slug,
    parent_name: selected_source.parent_name,
    active: false,
  }
  tree.select('settings', 'review_sites', 'current_sources').push(new_source);
  tree.commit();
  // update review Site Order / active/inactive stuff
  const current_sources = tree.get('settings', 'review_sites', 'current_sources').slice(0);
  const ordered_review_sites = reviewSiteOrder(current_sources);

  tree.select('settings', 'review_sites', 'current_sources').set(ordered_review_sites);
}

export function handleReviewSiteSort(tree, sortedReviewSites) {
  tree.select('settings', 'review_sites', 'has_changed').set(true);
  let active_count = 0;
  const ordered_review_sites = reviewSiteOrder(sortedReviewSites);
  tree.select('settings', 'review_sites', 'current_sources').set(ordered_review_sites);
}

export function manualReviewSiteSort(tree, order, direction) {
  tree.select('settings', 'review_sites', 'has_changed').set(true);
  let from_index = order - 1;
  let to_index;
  let arrayMove = (arr, fromIndex, toIndex) => {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
  const current_sources = tree.get('settings', 'review_sites', 'current_sources').slice(0);

  (direction == 'up') ? to_index = from_index - 1 : to_index = from_index + 1;
  if (direction == 'up' && to_index < 0) {
    return false
  } else if (direction == 'down' && to_index >= current_sources.length) {
    return false
  }

  arrayMove(current_sources, from_index, to_index);
  const ordered_review_sites = reviewSiteOrder(current_sources);

  tree.select('settings', 'review_sites', 'current_sources').set(ordered_review_sites);
}

export function reviewSiteDelete(tree, review_feed_id, order, new_feed) {
  tree.select('settings', 'review_sites', 'has_changed').set(true);
  let delete_index = order - 1;
  const current_sources = tree.get('settings', 'review_sites', 'current_sources');
  const new_sources = current_sources.slice(0, delete_index).concat(current_sources.slice(delete_index + 1));

  const ordered_review_sites = reviewSiteOrder(new_sources);


  // if not a new review feed then we add the feed_id to list of feeds to be deleted
  if (!new_feed) {
    tree.select('settings', 'review_sites', 'delete_ids').push(review_feed_id);
  }
  tree.select('settings', 'review_sites', 'current_sources').set(ordered_review_sites);
}

export function reviewSiteChangeUrl(tree, review_feed_id, payload) {
  tree.select('settings', 'review_sites', 'has_changed').set(true);
  let current_sources = tree.get('settings', 'review_sites', 'current_sources').slice(0);
  const updated_sources = current_sources.map((site) => {
    if (site.review_feed_id == review_feed_id) {
      return {...site, url: payload, active: (payload !== '')}
    } else {
      return site;
    }
  });
  const ordered_review_sites = reviewSiteOrder(updated_sources);
  tree.select('settings', 'review_sites', 'current_sources').set(ordered_review_sites);
  tree.commit();
}

export function saveReviewSites(tree) {
  const has_changed = tree.get('settings', 'review_sites', 'has_changed');
  if (!has_changed) {
    // Nothing has changed so just set an error and return false
    tree.select('alert').set({
      body: 'You haven\'t made any changes!',
      alert_type: 'error'
    });
    window.scrollTo(0, 0);
    return false
  }
  const delete_ids = tree.get('settings', 'review_sites', 'delete_ids');
  const review_sites = tree.get('settings', 'review_sites', 'current_sources');
  const review_sites_encoded = review_sites.map((obj) => {
    // obj clone hack
    let obj_cloned = JSON.parse(JSON.stringify(obj));
    let url = obj.url;
    obj_cloned.url = encodeURIComponent(url);
    return obj_cloned;
  });
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let req = request.post('/update-review-generators/')
    .send(`account_id=${selected_id}`)
    .send(`delete_ids=${JSON.stringify(delete_ids)}`)
    .send(`review_generators=${JSON.stringify(review_sites_encoded)}`)
  .end(function(err, res) {
    if (res.status === 200 && res.body) {
      tree.select('settings', 'review_sites', 'current_sources').set(res.body);
      const generator_array = res.body.map((source_obj) =>
        source_obj.slug
      );
      tree.select('generators').set(generator_array);
      tree.select('alert').set({
        body: 'Your review sources have been successfully updated.',
        alert_type: 'success'
      });
      tree.select('settings', 'review_sites', 'has_changed').set(false);
      tree.select('settings', 'review_sites', 'delete_ids').set([]);
    } else {
      tree.select('alert').set({
        body: 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com.',
        alert_type: 'error'
      });
    }
    window.scrollTo(0, 0);
  });
}

export function reviewSiteLock(tree) {
  tree.select('settings', 'review_site_lock').set(true);
}

export function changeSearchQuery(tree, payload) {
  tree.select('settings', 'subscribers', 'search_query').set(payload);
  tree.commit();
  const hidden_ids = tree.get('settings', 'subscribers', 'hidden_ids');
  hidden_ids.forEach((id) => {
    tree.select('settings', 'subscribers', 'subscriber_list', {id}, 'selected').set(false);
  });
}

export function handleSort(tree, payload) {
  const current_sort = tree.get('settings', 'subscribers', 'sort');
  const sort_direction = tree.get('settings', 'subscribers', 'sort_direction');
  if (payload !== current_sort) {
    tree.select('settings', 'subscribers', 'sort').set(payload);
    tree.select('settings', 'subscribers', 'sort_direction').set('up');
  } else {
    if (sort_direction === 'up') {
      tree.select('settings', 'subscribers', 'sort_direction').set('down');
    } else {
      tree.select('settings', 'subscribers', 'sort_direction').set('up');
    }
  }
}

export function selectToggle(tree, id) {
  const current_state = tree.get('settings', 'subscribers', 'subscriber_list', {id}, 'selected');
  tree.select('settings', 'subscribers', 'subscriber_list', {id}, 'selected').set(!current_state);
}

export function unselectAll(tree) {
  const selected_ids = tree.get('settings', 'subscribers', 'selected_ids');
  selected_ids.forEach((id) => {
    tree.select('settings', 'subscribers', 'subscriber_list', {id}, 'selected').set(false);
  });
}

export function unsubscribeSelected(tree) {
  const unsubscribe_ids = tree.get('settings', 'subscribers', 'unsubscribe_ids');
  if (unsubscribe_ids.length === 0) {
    tree.select('alert').set({
      body: "You haven't selected any subscribers eligible to be unsubscribed.",
      alert_type: 'error'
    });
    return false;
  }
  tree.select('confirmation').set('unsubscribe');
}

export function unsubscribeConfirm(tree) {
  const unsubscribe_ids = tree.get('settings', 'subscribers', 'unsubscribe_ids');
  let req = request.post('/manual-unsubscribe/')
    .send(`unsubscribe_ids=${JSON.stringify(unsubscribe_ids)}`)
  .end(function(err, res) {
    if (res.status === 200) {
      unsubscribe_ids.forEach((unsubscribe_id) => {
        tree.select('settings', 'subscribers', 'subscriber_list', {'id': unsubscribe_id}, 'unsubscribed').set(true);
        tree.select('settings', 'subscribers', 'subscriber_list', {'id': unsubscribe_id}, 'unsubscribed_at').set(moment().format('MM/DD/YY'));
      });
      tree.select('alert').set({
        body: 'The selected subscribers have been successfully unsubscribed.',
        alert_type: 'success'
      });
    } else {
      tree.select('alert').set({
        body: 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com.',
        alert_type: 'error'
      });
    }
    tree.select('confirmation').set(null);
  })
}

export function openBulkAdd(tree) {
  tree.select('settings', 'subscribers', 'bulk_add').set(true);
}

export function openBulkRemove(tree) {
  tree.select('settings', 'subscribers', 'bulk_remove').set(true);
}

export function subscriberAddTextareaChange(tree, payload) {
  tree.select('settings', 'subscribers', 'subscriber_add_textarea_value').set(payload);
  tree.commit();
}

export function subscriberRemoveTextareaChange(tree, payload) {
  tree.select('settings', 'subscribers', 'subscriber_remove_textarea_value').set(payload);
  tree.commit();
}

export function toggleDropzoneHover(tree, hover_state) {
  let dropzone_cursor;
  if (tree.get('settings', 'subscribers', 'bulk_add')) {
    dropzone_cursor = tree.select('settings', 'subscribers', 'dropzone_add');
  } else {
    dropzone_cursor = tree.select('settings', 'subscribers', 'dropzone_remove');
  }
  let timeout = dropzone_cursor.get('hover_timeout');
  if (timeout) {
    window.clearTimeout(timeout);
  }

  let time_delay;
  (hover_state) ? time_delay = 0 : time_delay = 5000;

  timeout = window.setTimeout(() =>
    dropzone_cursor.select('hover_state').set(hover_state)
  , time_delay);

  dropzone_cursor.select('hover_timeout').set(timeout);
  tree.commit();
}

export function handleDrop(tree, payload) {
  if (tree.get('settings', 'subscribers', 'bulk_add')) {
    tree.select('settings', 'subscribers', 'dropzone_add', 'hover_state').set(false);
    tree.select('settings', 'subscribers', 'dropzone_add', 'loading_state').set(true);
  } else {
    tree.select('settings', 'subscribers', 'dropzone_remove', 'hover_state').set(false);
    tree.select('settings', 'subscribers', 'dropzone_remove', 'loading_state').set(true);
  }
  tree.commit();
  
  // TODO: make this work for multiple files???
  // For now we just take the first file.
  const file = payload[0];
  let req = request.post('/subscriber-parse/');
  req.attach(file.name, file);
  req.end(function(err, res) {
    // TODO: handle errors
    if (res.status === 200 && res.body) {
      if (tree.get('settings', 'subscribers', 'bulk_add')) {
        tree.select('settings', 'subscribers', 'file_subscriber_add_count').set(res.body.emails.length);
        tree.select('settings', 'subscribers', 'filename_add').set(res.body.filename);
        tree.select('settings', 'subscribers', 'dropzone_add', 'loading_state').set(false);
        tree.select('settings', 'subscribers', 'dropzone_add', 'loaded_state').set(true);
        tree.select('settings', 'subscribers', 'file_subscriber_add_list').set(res.body.emails);
      } else {
        tree.select('settings', 'subscribers', 'file_subscriber_remove_count').set(res.body.emails.length);
        tree.select('settings', 'subscribers', 'filename_remove').set(res.body.filename);
        tree.select('settings', 'subscribers', 'dropzone_remove', 'loading_state').set(false);
        tree.select('settings', 'subscribers', 'dropzone_remove', 'loaded_state').set(true);
        tree.select('settings', 'subscribers', 'file_subscriber_remove_list').set(res.body.emails);
      }
    }
    else {
      tree.select('alpha_alert').set({
        body: `Something went wrong. Please double check your list and try again.` ,
        alert_type: 'error'
      });
    }
  });
}

export function resetSubscriberList(tree, bulk_type) {
  if (bulk_type === 'add') {
    tree.select('settings', 'subscribers', 'file_subscriber_add_count').set(0);
    tree.select('settings', 'subscribers', 'filename_add').set("");
    tree.select('settings', 'subscribers', 'dropzone_add', 'loading_state').set(false);
    tree.select('settings', 'subscribers', 'dropzone_add', 'loaded_state').set(false);
    tree.select('settings', 'subscribers', 'file_subscriber_add_list').set([]);
  } else {
    tree.select('settings', 'subscribers', 'file_subscriber_remove_count').set(0);
    tree.select('settings', 'subscribers', 'filename_remove').set("");
    tree.select('settings', 'subscribers', 'dropzone_remove', 'loading_state').set(false);
    tree.select('settings', 'subscribers', 'dropzone_remove', 'loaded_state').set(false);
    tree.select('settings', 'subscribers', 'file_subscriber_remove_list').set([]);
  }
}

export function handleAdd(tree) {
  const textarea_value = tree.get('settings', 'subscribers', 'subscriber_add_textarea_value');
  const possible_emails = textarea_value.split("\n");
  const validated_emails = possible_emails.filter((possible_email) =>
    validate(possible_email)
  );
  let file_subscriber_list;
  let bulk_type;
  file_subscriber_list = tree.get('settings', 'subscribers', 'file_subscriber_add_list');
  const subscribers = file_subscriber_list.concat(validated_emails);
  tree.select('settings', 'subscribers', 'subscriber_add_count').set(subscribers.length);
  tree.select('settings', 'subscribers', 'subscriber_add_list').set(subscribers);
  if (subscribers.length > 0) {
    tree.select('settings', 'subscribers', 'bulk_add').set(false);
    return false
  } else {
    tree.select('alpha_alert').set({
      body: 'You haven\'t added any subscribers!' ,
      alert_type: 'error'
    });
    return true
  }
}

export function handleRemove(tree) {
  const textarea_value = tree.get('settings', 'subscribers', 'subscriber_remove_textarea_value');
  const possible_emails = textarea_value.split("\n");
  const validated_emails = possible_emails.filter((possible_email) =>
    validate(possible_email)
  );
  let file_subscriber_list;
  let bulk_type;
  file_subscriber_list = tree.get('settings', 'subscribers', 'file_subscriber_remove_list');
  const subscribers = file_subscriber_list.concat(validated_emails);
  tree.select('settings', 'subscribers', 'subscriber_remove_count').set(subscribers.length);
  tree.select('settings', 'subscribers', 'subscriber_remove_list').set(subscribers);
  if (subscribers.length > 0) {
    tree.select('settings', 'subscribers', 'bulk_remove').set(false);
    return false
  } else {
    tree.select('alpha_alert').set({
      body: 'You haven\'t added any subscribers!' ,
      alert_type: 'error'
    });
    return true
  }
}

export function setNotUploadedError(tree) {
  tree.select('alert').set({
    body: 'You haven\'t added any subscribers!' ,
    alert_type: 'error'
  });
}

export function addConfirm(tree) {
  const subscribers = tree.get('settings', 'subscribers', 'subscriber_add_list');
  const subscribers_encoded = subscribers.map((email) => {
    return encodeURIComponent(email);
  });
  let req = request.post('/subscriber-add/')
    .send(`emails=${JSON.stringify(subscribers_encoded)}`)
    .end(function(err, res) {
      // TODO: handle errors
      if (res.status === 200 && res.body) {
        if (res.body.added_count > 0) {
          let subscribers_added_str;
          if (res.body.added_count > 1) {
            subscribers_added_str = `${res.body.added_count} subscribers`;
          } else {
            subscribers_added_str = '1 subscriber';
          }
          tree.select('alert').set({
            body: `You've successfully added ${subscribers_added_str} to your Accelerator Campaign!` ,
            alert_type: 'success'
          });
        } else {
          tree.select('alert').set({
            body: `We weren't able to add any subscribers to your campaign. Please double check your list and try again.` ,
            alert_type: 'error'
          });
        }
        tree.select('confirmation').set(false);

        tree.select('settings', 'subscribers', 'subscriber_list').set(res.body.updated_list);
        tree.select('settings', 'subscribers', 'added_count').set(res.body.added_count);
        resetSubscriberList(tree, 'add');
        tree.select('settings', 'subscribers', 'subscriber_add_textarea_value').set("");
      }
      else {
        tree.select('alert').set({
          body: `Something went wrong. Please double check your list and try again.` ,
          alert_type: 'error'
        });
      }
    });
}

export function removeConfirm(tree) {
  const subscribers = tree.get('settings', 'subscribers', 'subscriber_remove_list');
  const subscribers_encoded = subscribers.map((email) => {
    return encodeURIComponent(email);
  });
  let req = request.post('/subscriber-remove/')
    .send(`emails=${JSON.stringify(subscribers_encoded)}`)
    .end(function(err, res) {
      // TODO: handle errors
      if (res.status === 200 && res.body) {
        if (res.body.removed_count > 0) {
          let subscribers_removed_str;
          if (res.body.removed_count > 1) {
            subscribers_removed_str = `${res.body.removed_count} subscribers`;
          } else {
            subscribers_removed_str = '1 subscriber';
          }
          tree.select('alert').set({
            body: `You've successfully removed ${subscribers_removed_str} from your Accelerator Campaign!` ,
            alert_type: 'success'
          });
        } else {
          tree.select('alert').set({
            body: `We weren't able to remove any subscribers from your campaign. Please double check your list and try again.` ,
            alert_type: 'error'
          });
        }
        tree.select('confirmation').set(false);

        tree.select('settings', 'subscribers', 'subscriber_list').set(res.body.updated_list);
        tree.select('settings', 'subscribers', 'removed_count').set(res.body.removed_count);
        resetSubscriberList(tree, 'remove');
        tree.select('settings', 'subscribers', 'subscriber_remove_textarea_value').set("");
      }
      else {
        tree.select('alert').set({
          body: `Something went wrong. Please double check your list and try again.` ,
          alert_type: 'error'
        });
      }
    });
}
