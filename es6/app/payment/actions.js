import axios from 'axios'


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

let checkAt = (email_value, at_company) => {
  // This function checks if there was an @ sign in the cursor and if not it adds the at_company name to the end
  if (email_value.indexOf("@") >= 0) {
    // if theres an @ symbol then just return the full value
    return email_value
  } else {
    // otherwise we concat the at_company to the end of the value
    return `${email_value}${at_company}`
  }
    
}

let validateEmail = (cursorArray, at_company) => {
  let validate = (value) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);

  // Checks for valid Email and sets error if not

  // if we allow no ats then we add username

  let error = false;
  cursorArray.forEach((cursor) => {
    let email_value = cursor.get('value');
    if (email_value === '') {
      // if we have no value then don't set error
      return false
    }
    if (at_company) {
      // if we are allowing just email part before the @
      // we check at and return full email if none
      email_value = checkAt(email_value, at_company);
    }
    if (!validate(email_value)) {
      cursor.select('error').set('Please enter a valid Email.');
      error = true;
    }
  });
  return !error
}

let validateEmailCompany = (cursorArray, at_company) => {
  let error = false;
  cursorArray.forEach((cursor) => {
    let email_value = cursor.get('value');
    if (email_value === '') {
      // if we have no value then don't set error
      return false
    }
    if (!(email_value.indexOf("@") >= 0)) {
      // if no @ then no error
      return false
    }
    let at_email_value = `@${email_value.split("@")[1]}`;
    if (at_email_value !== at_company) {
      // if the value after @ is not the same as company email
      cursor.select('error').set('Please enter a valid Email from your company.');
      error = true;
    }
  });
  return !error
}

let isValidPhone = (phone) => {
  const pattern = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i);
  return pattern.test(phone)
}

let validatePhone = (cursorArray) => {
  // Checks for valid phone number and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!isValidPhone(cursor.get('value'))) {
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
      // we don't want a popup for this one we just want to set error
      passwordCursor.select('error').set('no-popup');
    }
    return false
  }
  return true
}

export function initialLoad(tree) {

}

export function goToStep(tree, payment_payload, onboarding_payload) { //receives destination payment step and destination onboarding step
  if (tree.get('account', 'onboarding_complete')) { // onboarding is complete - use payment step
    tree.select('payment', 'payment_step').set(payment_payload);
  } else {
    tree.select('onboarding', 'onboarding_step').set(onboarding_payload);
  }
  // Reset any alerts
  tree.select('alpha_alert').set(false);
}

export function selectCard(tree, payload) {
  tree.select('payment', 'selected_card').set(payload);
}

export function selectPlan(tree, payload) {
  tree.select('payment', 'selected_plan').set(payload);
}

export function selectCycle(tree, payload) {
  tree.select('payment', 'billing_cycle').set(payload);
}

export function cardFormReady(tree, payload) {
  tree.select('payment', 'card_form_ready').set(payload);
}

export function cardFormError(tree, error) {
  tree.select('alpha_alert').set({
    body: error,
    alert_type: 'error'
  });
}

export function setPlanMouseOver(tree, name, payload) {
  if (payload) {
    tree.select('payment', 'hovered_plan').set(name);
  } else {
    tree.select('payment', 'hovered_plan').set(null);
  }
}

export function selectPlanSubmit(tree) {
  if (tree.get('account', 'onboarding_complete')) { // onboarding is complete - use payment step
    tree.select('payment', 'payment_step').set(1);
  } else {
    tree.select('onboarding', 'onboarding_step').set(6);
  }
}

export function changePlan(tree) {
  tree.select('payment', 'card_form_ready').set(false);
  const plan = tree.get('payment', 'selected_plan');
  const cycle = tree.get('payment', 'billing_cycle');
  const pricing_model = tree.get('account', 'vertical_config', 'pricing', 'model');
  const selected_id = tree.get('account', 'selected_account_id');

  // for onboarding post to create new subscription
  axios({
    method: 'post',
    url: '/stripe/new-subscription',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'plan': plan,
      'cycle': cycle,
      'pricing_model': pricing_model,
      'selected_account': selected_id
    }
  }).then((response) => {
    tree.select('payment', 'card_form_ready').set(true);
    // TODO show some sort of completed screen here.
    tree.select('account', 'paid_account').set(true);
    if (tree.get('account', 'onboarding_complete')) { // onboarding is complete - show payment step 3
      tree.select('payment', 'payment_step').set(2);
    } else {
      tree.select('onboarding', 'onboarding_step').set(7);
      tree.select('account', 'onboarding_complete').set(true);
      tree.select('alert').set({
        body: 'Your payment has been successfully processed. Enjoy SubscriberVoice!',
        alert_type: 'success'
      });
    }
    if (plan === 'standard') {
      tree.select('account', 'paid_account').set(true);
    } else {
      tree.select('account', 'paid_account').set(false);
    }
  }).catch((error) => {
    tree.select('alpha_alert').set({
      body: 'Something went wrong. Please wait a few minutes and try again.',
      alert_type: 'error'
    });
    tree.select('payment', 'card_form_ready').set(true);
  });
}

export function planPayment(tree, stripe_token) {
  tree.select('payment', 'card_form_ready').set(false);
  const plan = tree.get('payment', 'selected_plan');
  const cycle = tree.get('payment', 'billing_cycle');
  const pricing_model = tree.get('account', 'vertical_config', 'pricing', 'model');
  const selected_id = tree.get('account', 'selected_account_id');

  // for onboarding post to create new subscription
  axios({
    method: 'post',
    url: '/stripe/onboarding-create-subscription/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'stripeToken': stripe_token.id,
      'plan': plan,
      'cycle': cycle,
      'pricing_model': pricing_model,
      'selected_account': selected_id
    }
  }).then((response) => {
    if(response.data) {
      tree.select('onboarding', 'set_password_url').set(response.data.set_password_url);
    }
    if (tree.get('account', 'onboarding_complete')) { // onboarding is complete - show payment step 3
      tree.select('payment', 'payment_step').set(2);
    }
    tree.select('onboarding', 'onboarding_step').set(7);
    tree.select('account', 'onboarding_complete').set(true);
    tree.select('payment', 'card_form_ready').set(true);
    if (plan === 'standard') {
      tree.select('account', 'paid_account').set(true);
    } else {
      tree.select('account', 'paid_account').set(false);
    }
  }).catch((error) => {
    tree.select('alpha_alert').set({
      body: 'Something went wrong. Please wait a few minutes and try again.',
      alert_type: 'error'
    });
    tree.select('payment', 'card_form_ready').set(true);
  });
}

export function changeInviteFormValue(tree, payload, input_id) {
  let index = parseInt(input_id.substring(6));
  tree.select('payment', 'email_invite_form', index, 'value').set(payload);
  tree.select('payment', 'email_invite_form', index, 'error').set(false);
  tree.commit();
}

export function inviteFormSubmit(tree) {
  let email_cursor_array = [];
  // lets get an array of all email cursors
  Array(5).fill().map((_, i) => {
    email_cursor_array.push(tree.select('payment', 'email_invite_form', i));
  });

  // Reset any alerts
  tree.select('alpha_alert').set(false);

  // check for required items
  let required_errors = !validateRequired(email_cursor_array);

  // check for email errors *allow no ats*
  const username = tree.get('user', 'username');
  const at_company = `@${username.split("@")[1]}`;
  let email_errors = !validateEmail(email_cursor_array, at_company);
  let company_email_errors = !validateEmailCompany(email_cursor_array, at_company);


  if (required_errors || email_errors || company_email_errors) {
    // if any errors caught.. return false
    return false
  }

  const email_invites = tree.get('payment', 'email_invite_form');
  let email_array = email_invites.map((invite_obj) => {
    return checkAt(invite_obj.value, at_company);
  });

  // check for duplicate values in the array
  const count = (emails) => 
    emails.reduce((a, b) => 
      Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

  const duplicates = dict => 
    Object.keys(dict).filter((a) => dict[a] > 1)

  const email_dupes = duplicates(count(email_array));

  if (email_dupes.length > 0) {
    // if any duplicates set alert and return false
    tree.select('alpha_alert').set({
      body: 'All email addresses must be unique.',
      alert_type: 'error'
    });
    return false
  }

  // encode emails in the array
  email_array = email_array.map((email) => {
    return encodeURIComponent(email);
  });

  axios({
    method: 'post',
    url: '/submit-onboarding-invite-form/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'email_invites': JSON.stringify(email_array)
    }
  }).then((response) => {
    if (200 === response.status) {
      tree.select('onboarding', 'onboarding_step').set(6);
    } else {
      if (response.data) {
        // set all errors in body
        Object.keys(response.data).forEach((_, i) => {
          tree.select('payment', 'email_invite_form', i, 'error').set(response.data[i]['error']);
        });
      } else {
        tree.select('alpha_alert').set({
          body: 'Something went wrong. Please wait a few minutes and try again.',
          alert_type: 'error'
        });
      }
    }
  });
}

export function closePaymentPrompt(tree) {
  tree.select('payment_prompt').set(false);
  tree.select('messages', 'messages_lock').set(false);
}
