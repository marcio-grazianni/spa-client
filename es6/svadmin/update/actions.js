import tree from './state'
import axios from 'axios'
import qs from 'qs'
import Papa from 'papaparse'

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

let validateEmail = (cursorArray) => {
  let validate = (value) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);

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

let updateAccountInfo = (updateFormCursor, accountsCursor) => {
  const selected_id = updateFormCursor.get('select_account', 'value');
  const accounts = accountsCursor.get();
  const account_info = accountsCursor.get({'id': parseInt(selected_id)});
  Object.keys(updateFormCursor.get()).forEach((field) => {
    if (field in account_info ) {
      if (account_info[field] !== null) {
        updateFormCursor.select(field, 'value').set(account_info[field]);
      }
    }
  });
  if (account_info['paid']) {
    updateFormCursor.select('payment', 'value').set(1);
  } else if (account_info['lite']) {
    updateFormCursor.select('payment', 'value').set(2);
  }
}

export function initialLoad(tree) {
  axios({
    method: 'get',
    url: '/api/accounts/',
    headers: {"X-CSRFToken": Django.csrf_token()},
  })
  .then((response) => {
    tree.select('update', 'accounts').set(response.data);
    tree.select('update', 'update_form', 'select_account', 'value').set(response.data[0]['id']);
    tree.commit();
    const update_form_cursor = tree.select('update', 'update_form');
    const accounts_cursor = tree.select('update', 'accounts');
    updateAccountInfo(update_form_cursor, accounts_cursor);

  })
  .catch((error) => {
    debugger
  })
}

export function selectAccount(tree, value) {
  tree.select('update', 'update_form', 'select_account', 'value').set(value);
  tree.commit();
  const update_form_cursor = tree.select('update', 'update_form');
  const accounts_cursor = tree.select('update', 'accounts');
  updateAccountInfo(update_form_cursor, accounts_cursor);
}

export function changeValue(tree, value, input_id) {
  // TODO: IF password/special type run validation functions
  tree.select('update', 'update_form', input_id, 'value').set(value);
  tree.select('update', 'update_form', input_id, 'error').set(false);
  tree.commit();
}

function formatSubAccounts(tree, data) {
  const account_name = tree.get('update', 'update_form', 'name', 'value');
  const account_slug = tree.get('creation', 'create_form', 'slug', 'value');
  const vertical = tree.get('update', 'update_form', 'vertical', 'value');
  const review_source_slugs = tree.get('update', 'update_form', 'review_source_slugs');
  let sub_accounts_raw = data.filter((row) => {
    return row['parent_name'] === account_name;
  });
  let sub_accounts_formatted = sub_accounts_raw.map((row, index) => {
    let formatted_row = {};
    if (row['account_name']) {
      formatted_row['name'] = row['account_name'];
    } else {
      formatted_row['name'] = `${account_name} ${row['location_name']}`;
    }
    formatted_row['primary_contact'] = {}
    if (row['username']) {
      formatted_row['primary_contact']['username'] = row['username'];
      formatted_row['primary_contact']['email'] = row['username'];
    } else {
      let username_slug = `${account_slug}-${index+1}`;
      formatted_row['primary_contact']['username'] = `${username_slug}@subscribervoice.com`;
      formatted_row['primary_contact']['email'] = `${username_slug}@subscribervoice.com`;
    }
    formatted_row['primary_contact']['first_name'] = row['first_name'];
    formatted_row['primary_contact']['last_name'] = row['last_name'];
    formatted_row['location'] = {
      name: row['location_name'],
      stated_address: row['location_address'], 
    };
    formatted_row['url'] = row['url'];
    formatted_row['vertical'] = vertical;
    formatted_row['sub_accounts'] = [];
    formatted_row['review_feeds'] = [];
    review_source_slugs.forEach((slug) => {
      if (row[slug]) {
        formatted_row['review_feeds'].push({
          source: slug,
          url: row[slug],
        })
      }
    });
    return formatted_row;
  });
  return sub_accounts_formatted;
}

export function uploadSubAccountCSV(tree, files) {
  // we only accept the first file
  let formatted_sub_accounts;
  const file = files[0];
  Papa.parse(file, {
    header: true,
    complete: function(results) {
      formatted_sub_accounts = formatSubAccounts(tree, results.data);
      tree.select('update', 'update_form', 'sub_accounts').set(formatted_sub_accounts);
    }
  });
}

export function handleSubmit(tree) {
  const selected_id = tree.get('update', 'update_form', 'select_account', 'value');
  const update_form = tree.select('update', 'update_form');

  const name_cursor = update_form.select('name');
  const slug_cursor = update_form.select('slug');
  const vertical_cursor = update_form.select('vertical');
  const payment_cursor = update_form.select('payment');
  const url_cursor = update_form.select('url');

  // const location_name_cursor = update_form.select('location_name');
  // const location_address_cursor = update_form.select('location_address');

  // const username_cursor = update_form.select('username');
  // const first_name_cursor = update_form.select('first_name');
  // const last_name_cursor = update_form.select('last_name');
  // const phone_cursor = update_form.select('phone');
  // const onboarding_step_cursor = update_form.select('onboarding_step');

  // check for required items
  let required_errors = !validateRequired([
    name_cursor,
    slug_cursor,
    url_cursor,
    // location_name_cursor,
    // location_address_cursor,
  ]);

  // check for url validation
  let url_errors = !validateURL([
    url_cursor,
  ]);

  // check for email validation
  // let email_errors = !validateEmail([
  //   username_cursor,
  // ]);

  if (required_errors || url_errors) {
    // if any errors caught.. return false
    return false
  }

  let payment_paid_status = false;
  let payment_lite_status = false;
  if (payment_cursor.get('value') == 1) {
    payment_paid_status = true;
  } else if (payment_cursor.get('value') == 2) {
    payment_lite_status = true;
  }

  axios({
    method: 'patch',
    url: `/api/accounts/${selected_id}`,
    data: {
      "name": name_cursor.get('value'),
      "slug": slug_cursor.get('value'),
      "paid": payment_paid_status,
      "lite": payment_lite_status,
      "url": url_cursor.get('value'),
      // "logo": null,
      "vertical": vertical_cursor.get('value'),
      "sub_accounts": update_form.get('sub_accounts'),
      "review_feeds": [],
    },
    headers: {"X-CSRFToken": Django.csrf_token()},
  })
  .then((response) => {
    tree.select('alert').set({
      body: "Success!",
      alert_type: 'success'
    });
  })
  .catch((error) => {
    let error_data = error.response.data;
    let alert_text = '';
    let error_field_key;
    let error_key;
    for (error_field_key in error_data) {
      for (error_key in error_data[error_field_key]) {
        alert_text += `${error_key}: ${error_data[error_field_key][error_key]}\n`
      }
    }
    tree.select('alert').set({
      body: alert_text,
      alert_type: 'error'
    });
  })
}