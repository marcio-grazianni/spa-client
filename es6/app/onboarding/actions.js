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
      passwordCursor.select('error').set('Your password must be >=8 characters and contain at least 1 letter and 1 number.');
    }
    return false
  }
  return true
}

export function completeOnboarding(tree) {
  axios({
      method: 'post',
      url: '/onboarding-complete/',
      headers: {"X-CSRFToken": Django.csrf_token()}
  })
  .then((response) => {
    tree.select('onboarding', 'onboarding_step').set(7);
    tree.select('account', 'onboarding_complete').set(true);
    tree.select('account', 'paid_account').set(true);
  });
}

let pollingInterval = null;

function pollOnboardingState(tree) {
  const profile_id = tree.get('user', 'profile_id');
  axios({
      method: 'get',
      url: '/api/users/' + profile_id + '/'
  })
  .then((response) => {
      const onboarding_step = response.data.onboarding_step;
      if(4 === onboarding_step) {
          window.location.reload();
      }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function initialLoad(tree) {
   const onboarding_step = tree.get('onboarding', 'onboarding_step');
   if(1 == onboarding_step) {
     let callback = function() {
         pollOnboardingState(tree);
     };
     pollingInterval = setInterval(callback, 5000);
   }
}

export function goToStep(tree, payload) {
  tree.select('onboarding', 'onboarding_step').set(payload);
  // Reset any alerts
  tree.select('alpha_alert').set(false);
  tree.commit();
}

export function selectIndustry(tree, payload) {
  tree.select('onboarding', 'selected_industry').set(payload);
  tree.select('account_info', 'disable_fields').set(false);
}

export function industrySubmit(tree) {
  const vertical = tree.get('onboarding', 'selected_industry');
  axios({
      method: 'post',
      url: '/submit-onboarding-industry/',
      headers: {"X-CSRFToken": Django.csrf_token()},
      data: {
        'vertical': vertical
      }
  })
  .then((response) => {
      tree.select('onboarding', 'onboarding_step').set(2);
      tree.select('account', 'vertical').set(vertical);
  })
  .catch((error) => {
    console.log(error);
  });
}

export function selectPlan(tree, payload) {
  tree.select('onboarding', 'selected_plan').set(payload);
  if (payload === 'lite') {
    tree.select('onboarding', 'billing_cycle').set('monthly');
  } else if (payload === 'standard') {
    tree.select('onboarding', 'billing_cycle').set('yearly');
  }
}

export function selectCycle(tree, payload) {
  tree.select('onboarding', 'billing_cycle').set(payload);
}

export function startTutorial(tree) {
  tree.select('account', 'tutorial_active').set(true);
  tree.select('account', 'tutorial_auto_start').set(true);
}

export function completeTutorial(tree, open_prompt) {
  tree.select('account', 'tutorial_active').set(false);
  axios({
    method: 'post',
    url: '/tutorial-complete/',
    headers: {"X-CSRFToken": Django.csrf_token()}
  })
  .then((response) => {
    tree.select('onboarding', 'onboarding_step').set(7);
    tree.select('account', 'tutorial_complete').set(true);
    tree.select('account', 'onboarding_complete').set(true);
    tree.select('account', 'paid_account').set(true);
  })
  .catch((error) => {
    console.log(error);
  });
}

export function activatePayments(tree) {
  tree.select('onboarding', 'onboarding_step').set(6);
  axios({
    method: 'post',
    url: '/activate-payments/',
    headers: {"X-CSRFToken": Django.csrf_token()}
  })
  .then((response) => {
    console.log('Payments activation email sent.');
  })
  .catch((error) => {
    console.log(error);
  });
}

export function accountInfoChange(tree, value, input_id) {
  tree.select('onboarding', 'account_info', input_id, 'value').set(value);
  tree.select('onboarding', 'account_info', input_id, 'error').set(false);
  tree.commit();
}

export function firstNameChange(tree, value) {
  tree.select('onboarding', 'account_info', 'first_name', 'value').set(value);
  const first_name_cursor = tree.select('onboarding', 'account_info', 'first_name');
  if(validateRequired([first_name_cursor])) {
    tree.select('onboarding', 'account_info', 'first_name', 'error').set(false);
  }
  tree.commit();

  const formValid = validateAccountInfo(tree);
  tree.select('onboarding', 'account_info', 'is_valid').set(formValid);
}

export function lastNameChange(tree, value) {
  tree.select('onboarding', 'account_info', 'last_name', 'value').set(value);
  const last_name_cursor = tree.select('onboarding', 'account_info', 'last_name');
  if(validateRequired([last_name_cursor])) {
    tree.select('onboarding', 'account_info', 'last_name', 'error').set(false);
  }
  tree.commit();

  const formValid = validateAccountInfo(tree);
  tree.select('onboarding', 'account_info', 'is_valid').set(formValid);
}

export function usernameChange(tree, value) {
  tree.select('onboarding', 'account_info', 'username', 'value').set(value);
  const username_cursor = tree.select('onboarding', 'account_info', 'username');
  if(validateRequired([username_cursor]) && validateEmail([username_cursor])) {
    tree.select('onboarding', 'account_info', 'username', 'error').set(false);
  }
  tree.commit();

  const formValid = validateAccountInfo(tree);
  tree.select('onboarding', 'account_info', 'is_valid').set(formValid);
}

export function passwordChange(tree, value) {
  tree.select('onboarding', 'account_info', 'password', 'value').set(value);
  const password_cursor = tree.select('onboarding', 'account_info', 'password');
  if(validateRequired([password_cursor]) && validatePassword(password_cursor, true)) {
    tree.select('onboarding', 'account_info', 'password', 'error').set(false);
  }
  tree.commit();

  const formValid = validateAccountInfo(tree);
  tree.select('onboarding', 'account_info', 'is_valid').set(formValid);
}

export function confirmPasswordChange(tree, value) {
  tree.select('onboarding', 'account_info', 'confirm_password', 'value').set(value);
  const confirm_password_cursor = tree.select('onboarding', 'account_info', 'confirm_password');
  if(validateRequired([confirm_password_cursor])) {
    confirm_password_cursor.select("error").set(false);
  }
  const confirmed_password = confirm_password_cursor.get("value");
  const password = tree.select('onboarding', 'account_info', 'password').get('value');
  if (password !== confirmed_password) {
      confirm_password_cursor.select("error").set("Passwords must match");
  } else {
      confirm_password_cursor.select("error").set(false);
  }
  tree.commit();

  const formValid = validateAccountInfo(tree);
  tree.select('onboarding', 'account_info', 'is_valid').set(formValid);
}

export function validateAccountInfo(tree) {
  // Reset any alerts
  tree.select('alpha_alert').set(false);

  const first_name_cursor = tree.select('onboarding', 'account_info', 'first_name');
  const last_name_cursor = tree.select('onboarding', 'account_info', 'last_name');
  const username_cursor = tree.select('onboarding', 'account_info', 'username');
  const password_cursor = tree.select('onboarding', 'account_info', 'password');
  const confirm_password_cursor = tree.select('onboarding', 'account_info', 'confirm_password');

  // check for required items
  let required_errors = !validateRequired([
    first_name_cursor,
    last_name_cursor,
    username_cursor,
    password_cursor,
    confirm_password_cursor
  ]);

  // check for email validation
  let email_errors = !validateEmail([
    username_cursor,
  ]);

  // check that password is valid
  let password_errors = !validatePassword(password_cursor, true);
  let password = password_cursor.get("value");

  let confirm_password_errors = false;
  let confirmed_password = confirm_password_cursor.get("value");
  if (confirmed_password !== password) {
      confirm_password_cursor.select("error").set("Passwords must match");
      confirm_password_errors = true;
  }

  return !(required_errors || email_errors || password_errors || confirm_password_errors);

}

export function accountInfoSubmit(tree, e) {
  if(!validateAccountInfo(tree)) {
    return false;
  }
  const first_name_cursor = tree.select('onboarding', 'account_info', 'first_name');
  const last_name_cursor = tree.select('onboarding', 'account_info', 'last_name');
  const username_cursor = tree.select('onboarding', 'account_info', 'username');
  const password_cursor = tree.select('onboarding', 'account_info', 'password');
  const phone_number_cursor = tree.select('onboarding', 'account_info', 'phone_number');

  axios({
      method: 'post',
      url: '/submit-onboarding-account-info/',
      headers: {"X-CSRFToken": Django.csrf_token()},
      data: {
        'first_name': first_name_cursor.get('value'),
        'last_name': last_name_cursor.get('value'),
        'username': encodeURIComponent(username_cursor.get('value')),
        'password': encodeURIComponent(password_cursor.get('value'))
      }
  })
  .then((response) => {
    if(200 === response.status) {
      if (e) {
        e.trigger('click');
      } else {
        tree.select('onboarding', 'onboarding_step').set(4);
        tree.select('account', 'onboarding_complete').set(true);
        tree.select('account', 'tutorial_active').set(true);
        tree.commit();
      }
      // Set values for in app
      tree.select('user', 'first_name').set(first_name_cursor.get('value'));
      tree.select('user', 'last_name').set(last_name_cursor.get('value'));
      tree.select('user', 'username').set(username_cursor.get('value'));
      tree.select('user', 'phone_number').set(phone_number_cursor.get('value'));
    } else {
      if (response.data) {
        // set all errors in body
        Object.keys(response.data).forEach((field) => {
          tree.select('onboarding', 'account_info', field, 'error').set(response.data[field]);
        });
      } else {
        tree.select('alpha_alert').set({
          body: 'Something went wrong. Please wait a few minutes and try again.',
          alert_type: 'error'
        });
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function cardFormReady(tree, payload) {
  tree.select('onboarding', 'card_form_ready').set(payload);
}

export function cardFormError(tree, error) {
  tree.select('alpha_alert').set({
    body: error,
    alert_type: 'error'
  });
}

export function setPlanMouseOver(tree, name, payload) {
  if (payload) {
    tree.select('onboarding', 'hovered_plan').set(name);
  } else {
    tree.select('onboarding', 'hovered_plan').set(null);
  }
}

export function planPayment(tree, stripe_token) {
  tree.select('onboarding', 'card_form_ready').set(false);
  const plan = tree.get('onboarding', 'selected_plan');
  const cycle = tree.get('onboarding', 'billing_cycle');

  axios({
    method: 'post',
    url: '/stripe/onboarding-create-subscription/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'stripe_token': stripe_token.id,
      'plan': plan,
      'cycle': cycle
    }
  })
  .then((response) => {
    tree.select('onboarding', 'onboarding_step').set(6);
    tree.select('onboarding', 'card_form_ready').set(true);
    if (plan === 'standard') {
      tree.select('account', 'paid_account').set(true);
    } else {
      tree.select('account', 'paid_account').set(false);
    }
  })
  .catch((error) => {
    console.log(error);
    tree.select('alpha_alert').set({
      body: 'Something went wrong. Please wait a few minutes and try again.',
      alert_type: 'error'
    });
    tree.select('onboarding', 'card_form_ready').set(true);
  });
}
