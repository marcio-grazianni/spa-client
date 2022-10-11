import axios from 'axios'

export function toggleUpdateCreditCardPrompt(tree) {
  let currentState = tree.get('appointpal', 'update_credit_card_prompt');
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'update_credit_card_prompt').set(!currentState);
}

function refreshMiniProfile(tree, message_thread_id) {
  axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/mini_profile/`
    }).then((response) => {
        if (response.data) {
            const mini_profile = response.data.mini_profile;
            tree.select('messages', 'message_thread_contacts', message_thread_id).set(mini_profile);
            tree.select('messages', 'mini_profile').set(mini_profile);
        }
    });
}

function setActiveMessageThread(tree, uuid) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    if(current_active_thread === uuid) {
        return;
    }
    tree.select('messages', 'active_message_thread').set(uuid);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    const current_filter = tree.get('messages', 'selected_filter');
    if(current_filter) {
        tree.select('messages', 'last_thread_by_section', current_filter).set(uuid);
    }
}

export function closeUpdateCreditCardPrompt(tree) {
    let account_id = tree.get('account', 'account_id');
    let message_thread_id = tree.get('messages', 'active_message_thread');
    tree.select('alpha_alert').set(false);
    tree.select('appointpal', 'update_credit_card_prompt').set(false);
    tree.select('appointpal', 'credit_card', 'transaction_setup_id').set(null);
    refreshMiniProfile(tree, message_thread_id);
}

export function openActivatePaymentsPrompt(tree) {
    tree.select('appointpal', 'activate_payments', 'requested').set(false);
    tree.select('appointpal', 'activate_payments_prompt').set(true);
}

export function openUpdateCreditCardPrompt(tree) {
    const merchant_id = tree.get('appointpal', 'merchant_id');
    if(!merchant_id) {
        openActivatePaymentsPrompt(tree);
        return;
    }
    const contact_id = tree.select('messages', 'mini_profile', 'subscriber_id').get();
    axios({
        method: 'post',
        url: '/api/stored_payment_accounts/setup_transaction/',
        data: {
            "contact_id": contact_id
        },
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        if (response.status === 200) {
          tree.select('alpha_alert').set(false);
          tree.select('appointpal', 'credit_card', 'transaction_setup_id').set(response.data.transaction_setup_id);
          tree.select('appointpal', 'update_credit_card_prompt').set(true);
        } else {
          let message = response.data.message;
          if(!message) {
            message = 'Something went wrong.'
          }
          tree.select('alert').set({
            body: message + ' If this problem persists, please contact your account representative.',
            alert_type: 'error'
          });
        }
      })
      .catch((error) => {
        let message = error.response.data.message;
        if(!message) {
            message = 'Something went wrong.'
        }
        tree.select('alert').set({
          body: message + ' If this problem persists, please contact your account representative.',
          alert_type: 'error'
        });
        console.log(error);
      });
}
