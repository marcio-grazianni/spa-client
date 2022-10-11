import axios from 'axios'
import request from 'superagent'
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

let validateEmail = (emailAddress) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(emailAddress);

function initTypeform(tree) {
  var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm_share", b="https://embed.typeform.com/";
  if(!gi.call(d,id)){
    js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q)
  }
}

function initPlaid(tree) {
  const profile_id = tree.get('user', 'profile_id');
  axios({
      method: 'post',
      url: '/payments/create-link-token/',
      headers: {"X-CSRFToken": Django.csrf_token()}
  })
  .then((response) => {
    const link_token = response.data.link_token;
    (function($) {
      Django.Plaid = Plaid.create({
        ...Django.linkHandlerCommonOptions,
        token: link_token,
        onSuccess: function(public_token, metadata) {
          $.post('/payments/plaid-webhook/', {
            profile_id: profile_id,
            public_token: public_token,
            plaid_account_id: metadata.account_id
          }, function(data) {
               tree.select('appointpal', 'accepting_payments').set(true);
               tree.commit();
          });
        }
      });
    })(jQuery);
  })
  .catch((error) => {
    console.log(error);
  });
}

export function initPaymentButtons(tree) {
    initTypeform(tree);
    initPlaid(tree);
}

export function initialLoad(tree) {
    tree.select('loading').set(true);
    initPaymentButtons(tree);
    // Logged in user's account_id
    const account_id = tree.get('account', 'account_id');
    // Account selected from dropdown, if any
    let selected_id = tree.get('account', 'selected_account_id');
    if (!selected_id) {
        selected_id = account_id;
    } else {
        const related_account = tree.get('account', 'related_accounts', {id: related_account_id});
        tree.select('account', 'paid_account').set(related_account.paid);
    }
    tree.select('review_invite', 'selected_account_id').set(selected_id);
    tree.commit();

    // Load full info for selected account
    let req = request.get(`/get-info/?account_id=${selected_id}`)
    .end(function(err, res) {
        if (!(err) && !(res.error) && (res.body)) {
            tree.select('user', 'username').set(res.body.username);
            tree.select('user', 'first_name').set(res.body.first_name);
            tree.select('user', 'last_name').set(res.body.last_name);
            tree.select('user', 'admin').set(res.body.admin);
            tree.select('account', 'account_logo').set(Django.media_url + res.body.company_logo);
            tree.select('account', 'account_slug').set(res.body.slug);
            tree.select('account', 'rating').set(res.body.rating);
            tree.select('account', 'grandfathered').set(res.body.grandfathered);
            let email_invite_limit = res.body.email_invite_limit;
            let email_invites_sent = res.body.email_invites_sent;
            let sms_invite_limit = res.body.sms_invite_limit;
            let sms_invites_sent = res.body.sms_invites_sent;
            tree.select('account', 'email_invites_remaining').set(Math.max(email_invite_limit - email_invites_sent, 0));
            tree.select('account', 'sms_invites_remaining').set(Math.max(sms_invite_limit - sms_invites_sent, 0));
            if (selected_id === account_id) { // only set paid back on parent if parent is selected.
                tree.select('account', 'paid_account').set(res.body.paid);
            }
            tree.commit();

            tree.select('account', 'vertical').set(res.body.vertical);
            tree.select('sources').set(res.body.sources);
            tree.select('generators').set(res.body.generators);
            tree.select('settings', 'review_sites', 'current_sources').set(res.body.generator_objects);
            tree.select('loading').set(false);
            if (Django.upgrade) {
                if (Django.vertical_config['pricing']['model'] === 'subscriber') {
                    tree.select('upgrade_prompt').set(true);
                } else {
                    tree.select('payment_prompt').set(true);
                }
            }
        }
  });
}

export function selectProvider(tree, provider) {
    tree.select('account', 'selected_provider').set(provider);
    hideDropdown(tree, 'provider_selector');
}

export function selectRelatedAccount(tree, related_account_id) {
    tree.select('loading').set(true);
    tree.commit();
    const account_id = tree.get('account', 'account_id');
    const related_account_summary = tree.get('account', 'related_accounts', {id: related_account_id});
    tree.select('account', 'account_summary').set(related_account_summary);
    if (account_id === related_account_id) {
        tree.select('account', 'selected_account_id').set(null);
    } else {
        tree.select('account', 'selected_account_id').set(related_account_summary.id);
        tree.select('account', 'paid_account').set(related_account_summary.paid);
    }
    tree.select('feed', 'payments', 'items').set([]);
    tree.select('feed', 'reviews', 'items').set([]);
    tree.select('feed', 'filters').set({
        sxi: 'all',
        comments: 'comments',
        review_sites: Django.default_feed_source,
    });

    tree.commit();
    let req = request.get(`/get-info/?account_id=${related_account_id}`)
    .end(function(err, res) {
        if (!(err) && !(res.error) && (res.body)) {
            tree.select('user', 'username').set(res.body.username);
            tree.select('user', 'first_name').set(res.body.first_name);
            tree.select('user', 'last_name').set(res.body.last_name);
            tree.select('user', 'admin').set(res.body.admin);
            tree.select('account', 'account_logo').set(Django.media_url + res.body.company_logo);
            tree.select('account', 'account_slug').set(res.body.slug);
            tree.select('account', 'rating').set(res.body.rating);
            tree.select('account', 'paid_account').set(res.body.paid);
            tree.select('account', 'grandfathered').set(res.body.grandfathered);
            tree.select('appointpal', 'merchant_id').set(res.body.merchant_id);
            tree.select('account', 'providers').set(res.body.providers);
            tree.select('account', 'selected_provider').set(null);

            let email_invite_limit = res.body.email_invite_limit;
            let email_invites_sent = res.body.email_invites_sent;
            let sms_invite_limit = res.body.sms_invite_limit;
            let sms_invites_sent = res.body.sms_invites_sent;
            tree.select('account', 'email_invites_remaining').set(Math.max(email_invite_limit - email_invites_sent, 0));
            tree.select('account', 'sms_invites_remaining').set(Math.max(sms_invite_limit - sms_invites_sent, 0));
            tree.commit();
      
            tree.select('account', 'vertical').set(res.body.vertical);
            tree.select('sources').set(res.body.sources);
            tree.select('generators').set(res.body.generators);
            tree.select('settings', 'review_sites', 'current_sources').set(res.body.generator_objects);
            tree.select('loading').set(false);
            if (Django.upgrade) {
                if (Django.vertical_config['pricing']['model'] === 'subscriber') {
                    tree.select('upgrade_prompt').set(true);
                } else {
                    tree.select('payment_prompt').set(true);
                }
            }
            toggleDropdown(tree, 'location_selector');
        }
  });
}

export function handleNavigation(tree) {
  // TODO: what else should we reset upon navigation through app?
  tree.select('navigating').set(true);
  tree.commit();
  tree.select('upgrade_prompt').set(false);
  tree.select('dashboard', 'date_upgrade_prompt').set(false);
  tree.select('testimonials', 'testimonial_lock').set(false);
  tree.select('messages', 'messages_lock').set(false);
  tree.select('account', 'settings_lock').set(false);
  tree.select('settings', 'review_site_lock').set(false);
  tree.select('review_invite_prompt').set(false);
  tree.select('alert').set(false);
  tree.select('accelerator', 'setup_step').set(false);
  tree.select('accelerator', 'accelerator_lock').set(false);
  tree.select('team', 'team_lock').set(false);
  // SHould factor out *Reset feed* stuff **also need to always reload first 10 reviews on page load**
  tree.select('feed', 'loading').set(false);
  tree.select('feed', 'load_initial').set(true);
  tree.select('feed', 'current_item').set(0);
  tree.select('feed', 'sessions').set([]);
  tree.select('feed', 'feature_lock').set(false);
  tree.select('feed', 'feed_lock').set(false);
  tree.select('feed', 'feed_lock_prompt', 'visible').set(false);
  tree.select('feed', 'has_more'). set(true);
  tree.select('reports', 'expanded').set(false);
  window.setTimeout(() => {
      tree.select('navigating').set(false);
      tree.commit();
    }, 1);
  window.scrollTo(0,0);
}

export function handleTutorialNavigation(tree, router, routerHref) {
  router.navigate(routerHref);
}

export function toggleDropdown(tree, dropdownId) {
  let currentState = tree.get('drop_down', dropdownId, 'visible');
  const newState = !currentState
  tree.select('drop_down', dropdownId, 'visible').set(newState);
  if(newState) {
      if ('location_selector' === dropdownId) {
          tree.select('drop_down', 'provider_selector', 'visible').set(false);
      } else if ('provider_selector' === dropdownId) {
          tree.select('drop_down', 'location_selector', 'visible').set(false);
      }
  }
}

export function hideDropdown(tree, dropdownId) {
  tree.select('drop_down', dropdownId, 'visible').set(false);
}

export function changeTopMenuSection(tree, section, menuId) {
  tree.select(section, 'selected_top_menu').set(menuId);
}

export function closeBulkAddRemove(tree) {
  tree.select('settings', 'subscribers', 'bulk_add').set(false);
  tree.select('settings', 'subscribers', 'bulk_remove').set(false);
  tree.select('alpha_alert').set(false);
}

export function confirmationToggle(tree, confirmationId) { //if passed confirmationId then set confirmation - else set false
  if (confirmationId) {
    tree.select('confirmation').set(confirmationId); //confirmation is app-wide state
  }
  else {
    tree.select('messages', 'invoice').set(null);
    tree.select('confirmation').set(false);
  }
}

export function closeAlert(tree, alpha) {
  if (alpha) {
    tree.select('alpha_alert').set(false);
  }
  tree.select('alert').set(false);
}

function sendUpgradeRequest(tree) {
  tree.select('upgrade_request_pending').set(true);
  const paid = tree.get('account', 'paid_account');
  let url = paid ? '/appointpal-demo-request/' : '/upgrade-to-premium-request/';
  let req = request.post(url).send()
    .end(function(err, res) {
      tree.select('alpha_alert').set({
        body: 'Request sent!',
        alert_type: 'success'
    });
  });
  tree.select('upgrade_request_pending').set(false);
}

export function toggleUpgradeOverlay(tree) {
    tree.select('review_invite_lock').set(true);
}

export function toggleUpgradePrompt(tree) {
  //if (tree.get('messages', 'messages_lock')) {
  //    sendUpgradeRequest(tree);
  //    return;
  //}
  const paid = tree.get('account', 'paid_account');
  const pricing_model = tree.get('account', 'vertical_config', 'pricing', 'model');

  if (tree.get('account', 'settings_lock')) { // if in the settings backdoor we just turn off the settings backdoor *should show onboarding*
    tree.select('account', 'settings_lock').set(false);
    return false;
  }

  let currentState;
  if (paid || pricing_model === 'subscriber') { // if already paid or subscriber type - show them request demo
    currentState = tree.get('upgrade_prompt');
    tree.select('upgrade_prompt').set(!currentState);
  } else { // If not paid we show the payment/upgrade prompt
    currentState = tree.get('payment_prompt');
    tree.select('payment_prompt').set(!currentState);
    tree.select('payment', 'payment_step').set(0);
  }
}

export function upgradePromptLoad(tree) {
  // Sets the inputs to the current user/account values
  tree.select('upgrade_inputs', 'first_name').set(tree.get('user', 'first_name'));
  tree.select('upgrade_inputs', 'last_name').set(tree.get('user', 'last_name'));
  tree.select('upgrade_inputs', 'username').set(tree.get('user', 'username'));
  tree.select('upgrade_inputs', 'company_name').set(tree.get('account', 'account_name'));
  tree.select('upgrade_inputs', 'phone_number').set(tree.get('user', 'phone_number'));
}

export function closeUpgradePrompt(tree) {
  tree.select('upgrade_prompt').set(false);
}

export function changeUpgradeInputValue(tree, field, value) {
  tree.select('upgrade_inputs', field).set(value);
  tree.commit();
}

export function submitDemoRequest(tree) {
  let req = request.post('/demo-request/')
    .send(`first_name=${tree.get('upgrade_inputs', 'first_name')}`)
    .send(`last_name=${tree.get('upgrade_inputs', 'last_name')}`)
    .send(`email=${tree.get('upgrade_inputs', 'email')}`)
    .send(`company_name=${tree.get('upgrade_inputs', 'company_name')}`)
    .send(`phone_number=${tree.get('upgrade_inputs', 'phone_number')}`)
  .end(function(err, res) {
    if (res.status === 200) {
      tree.select('upgrade_prompt').set(false);
    } else {
        // TODO: write error handler
    }
  });
}

export function toggleContactPrompt(tree) {
  // Reset subject and body values
  tree.select('contact_inputs', 'body').set("");
  tree.select('contact_inputs', 'subject').set("");
  let currentState = tree.get('contact_prompt');
  tree.select('contact_prompt').set(!currentState);
}

export function changeContactInputValue(tree, field, value) {
  tree.select('contact_inputs', field).set(value);
  tree.commit();
}

export function closeContactPrompt(tree) {
  tree.select('contact_prompt').set(false);
}

export function submitContactPrompt(tree) {
  let req = request.post('/give-feedback-form/')
    .send(`subject=${tree.get('contact_inputs', 'subject')}`)
    .send(`body=${tree.get('contact_inputs', 'body')}`)
  .end(function(err, res) {
    if (res.status === 200) {
      tree.select('alpha_alert').set({
        body: 'Your feedback has been successfully sent!',
        alert_type: 'success'
      });
      tree.select('review_invite', 'contact', 'value').set('');
      tree.select('review_invite', 'first_name', 'value').set('');
    } else {
      tree.select('alpha_alert').set({
        body: 'Something went wrong. Please wait a few minutes and try again.',
        alert_type: 'error'
      });
    }
  });
}

export function toggleLocationPrompt(tree) {
  // Reset values
  tree.select('alpha_alert').set(false);
  tree.select('location_inputs').set(tree.get('default_location_inputs'));
  let currentState = tree.get('location_prompt');
  tree.select('location_prompt').set(!currentState);
}

export function addLocationInput(tree) {
  // Reset values
  const new_index = tree.select('location_inputs').get().length + 1;
  tree.select('location_inputs').push({
    label: `Address ${new_index}`,
    name: `address_${new_index}`,
    value: "",
  });
}

export function changeLocationInputValue(tree, field, value) {
  tree.select('location_inputs', {name: field}, 'value').set(value);
  tree.commit();
}

export function closeLocationPrompt(tree) {
  tree.select('alpha_alert').set(false);
  tree.select('location_prompt').set(false);
}

export function toggleReviewInvitePrompt(tree) {
  if (tree.get('account', 'settings_lock')) {
    tree.select('account', 'settings_lock').set(false);
    return false;
  }
  let currentState = tree.get('review_invite_prompt');
  tree.select('alpha_alert').set(false);
  checkSendLimits(tree);
  tree.select('review_invite_prompt').set(!currentState);
}

export function closeReviewInvitePrompt(tree) {
  tree.select('alpha_alert').set(false);
  tree.select('review_invite', 'contact', 'error').set(false);
  tree.select('accelerator_invites', 'contacts', 'error').set(false);
  tree.select('review_invite_prompt').set(false);
  tree.select('mini_accelerator').set(false);
}

export function reviewInviteLock(tree) {
  tree.select('onboarding', 'onboarding_step').set(4);
  tree.select('alpha_alert').set(false);
  tree.select('review_invite', 'contact', 'error').set(false);
  tree.select('accelerator_invites', 'contacts', 'error').set(false);
  tree.select('review_invite_prompt').set(false);
  tree.select('account', 'onboarding_review_invite_lock').set(false);
}

export function closePaymentPrompt(tree) {
  tree.select('alpha_alert').set(false);
  tree.select('review_invite', 'contact', 'error').set(false);
  tree.select('accelerator_invites', 'contacts', 'error').set(false);
  tree.select('payment_prompt').set(false);
}

export function changeReviewInviteLocation(tree, value) {
  tree.select('review_invite', 'selected_account_id').set(value);
  tree.commit();
}

export function changeReviewInviteValue(tree, field, value) {
  tree.select('review_invite', field, 'value').set(value);
  tree.select('review_invite', field, 'error').set(false);
  tree.commit();
}

export function changeAcceleratorInvitesValue(tree, field, value) {
  if(value) {
    const contact_list = value.trim().split('\n');
    if (contact_list.length > 50) {
      tree.select('accelerator_invites', 'contacts', 'error').set('You may only upload 50 contacts at a time.');
      return false;
    }
  }
  tree.select('accelerator_invites', field, 'value').set(value);
  tree.select('accelerator_invites', field, 'error').set(false);
  tree.commit();
}

export function submitAcceleratorInvites(tree) {
  const paid_account = tree.get('account', 'paid_account');
  const invites_remaining = tree.get('account', 'invites_remaining');
  if (!paid_account && invites_remaining < 1) {
    if (Django.vertical_config['pricing']['model'] === 'subscriber') {
      tree.select('upgrade_prompt').set(true);
    } else {
      tree.select('payment_prompt').set(true);
    }
    tree.select('alpha_alert').set(false);
    tree.select('review_invite', 'contact', 'error').set(false);
    tree.select('accelerator_invites', 'contacts', 'error').set(false);
    tree.select('review_invite_prompt').set(false);
    return false;
  }
  // Reset errors
  tree.select('accelerator_invites', 'contacts', 'error').set(false);

  const phone_util = PhoneNumberUtil.getInstance();
  const contacts = tree.get('accelerator_invites', 'contacts', 'value');
  const contact_list = contacts.trim().split('\n');
  if (contact_list.length > 50) {
      tree.select('accelerator_invites', 'contacts', 'error').set('You may only upload 50 contacts at a time.');
      return false;
  }
  let rows = [];
  for (var contact of contact_list) {
    let formatted_contact = contact;
    let contact_type = null;
    if (validateEmail(contact)) {
        contact_type = 'email'
    } else {
      // Check if valid US phone number and if valid we parse to E164 format
      try {
        // Try because it will throw error if not possible phone number
        let possible_phone_number = phone_util.parse(contact, 'US');
        if (phone_util.isValidNumber(possible_phone_number)) {
          formatted_contact = phone_util.format(possible_phone_number, PhoneNumberFormat.E164);
          contact_type = 'sms';
        }
      } catch (err) {
          // Do nothing.
      }
    }
    if (!contact_type) {
      if (contact.length > 30) {
          contact = contact.substring(0,30) + '...';
      }
      tree.select('accelerator_invites', 'contacts', 'error').set(contact + ' is not a valid email address or phone number.');
      return false;
    }
    rows.push([formatted_contact, contact_type]);
  }
  let sub_account_id = '';
  const selected_account_id = tree.get('account', 'selected_account_id');
  if (selected_account_id) {
    sub_account_id = selected_account_id;
  }
  let req = request.post('/sms/bulk-send-invites/')
    .send({rows: rows, subaccount: sub_account_id})
    .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.status === 200) {
      if (res.body) {
          tree.select('account', 'email_invites_remaining').set(res.body.email_invites_remaining);
          tree.select('account', 'sms_invites_remaining').set(res.body.sms_invites_remaining);
      }
      tree.select('alpha_alert').set({
        body: 'Invites successfully sent!',
        alert_type: 'success'
      });
    } else if (res.status === 403) {
      let alert_message = 'Something went wrong. Please wait a few minutes and try again.';
      if (res.body) {
          alert_message = res.body.message + ' Please <a href="mailto:contact@appointpal.com?subject=Invite%20Limits%20Exceeded" target="_blank">contact us</a> to update.'
      }
      tree.select('alpha_alert').set({
        body: alert_message,
        alert_type: 'error'
      });
    } else {
      let alert_message = 'Something went wrong. Please wait a few minutes and try again.';
      if (res.body) {
          alert_message = res.body.message;
      }
      tree.select('alpha_alert').set({
        body: alert_message,
        alert_type: 'error'
      });
    }
    tree.select('accelerator_invites', 'contacts', 'value').set('');
  });
}

export function submitReviewInvite(tree) {
  const paid_account = tree.get('account', 'paid_account');
  const invites_remaining = tree.get('account', 'invites_remaining');
  if (!paid_account && invites_remaining < 1) {
    if (Django.vertical_config['pricing']['model'] === 'subscriber') {
      tree.select('upgrade_prompt').set(true);
    } else {
      tree.select('payment_prompt').set(true);
    }
    tree.select('alpha_alert').set(false);
    tree.select('review_invite', 'contact', 'error').set(false);
    tree.select('accelerator_invites', 'contacts', 'error').set(false);
    tree.select('review_invite_prompt').set(false);
    return false;
  }
  let sub_account_id = '';
  const selected_account_id = tree.get('account', 'selected_account_id');
  if (selected_account_id) {
    sub_account_id = selected_account_id;
  }

  const contact = tree.get('review_invite', 'contact', 'value');
  const first_name = tree.get('review_invite', 'first_name', 'value');

  // Reset errors
  tree.select('review_invite', 'contact', 'error').set(false);
  tree.select('review_invite', 'first_name', 'error').set(false);

  // TODO: factor our validation function into seperate validation modules.
  let contact_type;
  let phone_util = PhoneNumberUtil.getInstance();
  let possible_phone_number;

  let email_address = '';
  let phone_number = '';

  if (validateEmail(contact)) {
    // Check if email address first
    contact_type = 'email';
    email_address = contact;
  } else {
    // Check if valid US phone number and if valid we parse to E164 format
    try {
      // Try because it will throw error if not possible phone number
      possible_phone_number = phone_util.parse(contact, 'US');
      if (phone_util.isValidNumber(possible_phone_number)) {
        phone_number = phone_util.format(possible_phone_number, PhoneNumberFormat.E164);
        contact_type = 'phone';
      } else {
        contact_type = null;
      }
    } catch (err) {
      contact_type = null;
    }
  }
  if (!contact_type) {
    tree.select('review_invite', 'contact', 'error').set('Make sure you enter a valid phone number or email address');
    return false;
  }
  let req = request.post('/sms/send-review-invite/')
    .send(`subaccount=${sub_account_id}`)
    .send(`${contact_type}=${contact}`)
    .send(`name=${first_name}`)
  .end(function(err, res) {
    if (res.status === 200) {
      tree.select('alpha_alert').set({
        body: 'Invite successfully sent!',
        alert_type: 'success'
      });
      tree.select('review_invite', 'contact', 'value').set('');
      tree.select('review_invite', 'first_name', 'value').set('');
      if (res.body) {
          tree.select('account', 'email_invites_remaining').set(res.body.email_invites_remaining);
          tree.select('account', 'sms_invites_remaining').set(res.body.sms_invites_remaining);
      }
    } else if (res.status < 500) {
      let alert_message = 'Message not sent.';
      if (res.body) {
        alert_message = res.body.message;
      }
      tree.select('alpha_alert').set({
        body: alert_message,
        alert_type: 'error'
      });
      tree.select('review_invite', 'contact', 'value').set('');
      tree.select('review_invite', 'first_name', 'value').set('');
    } else {
      tree.select('alpha_alert').set({
        body: 'Something went wrong. Please wait a few minutes and try again.',
        alert_type: 'error'
      });
    }
  });
}

export function toggleMiniAccelerator(tree) {
    checkSendLimits(tree);
    let currentState = tree.get('mini_accelerator');
    tree.select('mini_accelerator').set(!currentState);
}

function checkSendLimits(tree) {
    let email_invites_remaining = tree.get('account', 'email_invites_remaining');
    let sms_invites_remaining = tree.get('account', 'sms_invites_remaining');
    if (email_invites_remaining <= 0 && sms_invites_remaining <=0) {
        let body = 'You have exceeded your invite limits.  Please <a href="mailto:contact@appointpal.com?subject=Invite%20Limits%20Exceeded" target="_blank">contact us</a> to update.';
        tree.select('alpha_alert').set({
            body: body,
            alert_type: 'error'
        });
    }
}

export function sendAppointpalActivationRequest(tree) {
  tree.select('appointpal_request_pending').set(true);
  let req = request.post('/activate-appointpal-account/').send()
    .end(function(err, res) {
      tree.select('alpha_alert').set({
        body: 'Activation request sent!',
        alert_type: 'success'
    });
  });
  tree.select('appointpal_request_pending').set(false);
}

export function requestAppointpalIntroductions(tree) {
  tree.select('request_introductions_sent').set(true);
  let req = request.post('/request-appointpal-introductions/').send()
    .end(function(err, res) {
      if(err) {
        console.error(err);
      } else if(res.error) {
        console.error(res.error);
      } else {
        console.log('Request sent!');
      }
    });
}
