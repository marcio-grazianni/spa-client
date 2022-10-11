import axios from 'axios'
import moment from 'moment'
import tree from '../state'

function setActiveMessageThread(tree, uuid) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    if(current_active_thread == uuid) {
        return;
    }
    tree.select('messages', 'active_message_thread').set(uuid);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    const current_filter = tree.get('messages', 'selected_filter');
    if(current_filter) {
        tree.select('messages', 'last_thread_by_section', current_filter).set(uuid);
    }
}

function unsetActiveMessageThread(tree) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    tree.select('messages', 'active_message_thread').set(null);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    for(var section of ['all', 'open', 'closed']) {
        const last_thread_by_section = tree.get('messages', 'last_thread_by_section', section);
        if(current_active_thread == last_thread_by_section) {
            tree.select('messages', 'last_thread_by_section', section).set(null);
        }
    }
}

function restoreActiveMessageThread(tree) {
    const current_filter = tree.get('messages', 'selected_filter');
    if(current_filter) {
        const last_thread_by_section = tree.get('messages', 'last_thread_by_section', current_filter);
        if(last_thread_by_section) {
            tree.select('messages', 'active_message_thread').set(last_thread_by_section);
        }
    }
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
}

let select_available_active = () => { //resets active message to top of list and turns off reply box
  tree.select('messages').select('reply_content').set('');
  tree.select('messages').select('reply_active').set(false);
  const current_active_thread_id = tree.select('messages').get('active_message_thread');
  const displayed_message_threads = tree.select('messages').get('displayed_message_threads');
  let current_active_present = false;
  if(current_active_thread_id) {
      for(var item of displayed_message_threads) {
          if(current_active_thread_id === item.uuid) {
              current_active_present = true;
          }
      }
  }
  if(!current_active_present) {
      const top_item = displayed_message_threads[0];
      const selected_item_id = top_item && top_item.uuid;
      setActiveMessageThread(tree, selected_item_id);
  }
  const new_active_thread_id = tree.select('messages').get('active_message_thread');
  tree.select('messages', 'message_thread_messages', new_active_thread_id).set(null);
  tree.select('messages', 'message_thread_contacts', new_active_thread_id).set(null);
  setActiveMessageList(tree);
  setActiveMiniProfile(tree);
}

let close_confirmation = () => {
  tree.select('confirmation').set(false);
}

export function scrollToReply() {
  const ele = document.querySelector('div.message-thread-bottom');
  if(ele) {
    ele.scrollIntoView(false);
  }
}

export function scrollToActiveThread() {
  const ele = document.querySelector('.message-thread.active + .message-thread');
  if(ele) {
    ele.scrollIntoView({block: "center", inline: "nearest"});
  }
}

let load_message_list = (account_id, callback) => {
    let wrapped_callback = () => {
        if(callback) {
            callback();
        }
    }

    let archived_param = '';
    const selected_filter = tree.select('messages', 'selected_filter').get();
    if('open' === selected_filter) {
        archived_param = 'false';
    } else if('closed' === selected_filter) {
        archived_param = 'true';
    }

    axios({
        method: 'get',
        url: `/api/message_threads/?account_id=${account_id}&page_size=100&archived=${archived_param}`,
    })
    .then((response) => {
        if(response.data) {
            tree.select('messages').select('message_thread_list').set(response.data.results);
        }
        wrapped_callback();
    });
}

function setActiveMessageList(tree) {
    const active_message_thread = tree.select('messages', 'active_message_thread').get();
    let message_list = [];
    if(!active_message_thread) {
        tree.select('messages', 'message_list').set(message_list);
        return;
    }
    message_list = tree.select('messages', 'message_thread_messages', active_message_thread).get();
    if(null != message_list) {
        tree.select('messages', 'message_list').set(message_list);
        return;
    }
    axios({
        method: 'get',
        url: `/api/message_threads/${active_message_thread}/messages/`
    }).then((response) => {
        if (response.data) {
            message_list = response.data.messages;
            tree.select('messages', 'message_thread_messages', active_message_thread).set(message_list);
            tree.select('messages', 'message_list').set(message_list);
        }
    });
}

function refreshMessageList(tree, message_thread_id) {
    axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/messages/`
    }).then((response) => {
        if (response.data) {
            const message_list = response.data.messages;
            tree.select('messages', 'message_thread_messages', message_thread_id).set(message_list);
            tree.select('messages', 'message_list').set(message_list);
        }
    });
}

function setActiveMiniProfile(tree) {
    const active_message_thread = tree.select('messages', 'active_message_thread').get();
    if(!active_message_thread) {
        tree.select('messages', 'mini_profile').set(null);
        return;
    }
    let mini_profile = tree.select('messages', 'message_thread_contacts', active_message_thread).get();
    if(null != mini_profile) {
        tree.select('messages', 'mini_profile').set(mini_profile);
        return;
    }
    axios({
        method: 'get',
        url: `/api/message_threads/${active_message_thread}/mini_profile/`
    }).then((response) => {
        if (response.data) {
            mini_profile = response.data.mini_profile;
            tree.select('messages', 'message_thread_contacts', active_message_thread).set(mini_profile);
            tree.select('messages', 'mini_profile').set(mini_profile);
          }
        }
    );
}

export function initialLoad(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const activeThreadCursor = tree.select('messages', 'active_message_thread');
  activeThreadCursor.on('update', function() {
      console.log('Active thread was updated.')
      setActiveMessageList(tree);
      setActiveMiniProfile(tree);
  });
  load_or_search_message_list(selected_id, select_available_active);
}

export function changeFilter(tree, filterId) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  tree.select('messages').select('selected_filter').set(filterId);
  restoreActiveMessageThread(tree);
  load_or_search_message_list(selected_id, select_available_active);
}

export function changeType(tree, typeName) {
  tree.select('messages').select('selected_type').set(typeName);
  select_available_active();
  tree.select('alert').set(false);
}

export function onChangeSection(tree) { //set selected message to top and remove alert
  select_available_active();
  tree.select('alert').set(false);
}

export function selectMessageThread(tree, messageThreadId, opened) {
  let do_select = () => {
      setActiveMessageThread(tree, messageThreadId);
      tree.select('messages').select('reply_content').set('');
      tree.select('messages').select('reply_active').set(false);
      tree.select('alert').set(false);
      tree.commit();
  };
  if (!opened) {
      const account_id = tree.get('account', 'account_id');
      let selected_id = tree.get('account', 'selected_account_id');
      if (!selected_id) {
          selected_id = account_id;
      }
      axios({
          method: 'post',
          url: '/messaging/mark-thread-opened/',
          headers: {"X-CSRFToken": Django.csrf_token()},
          data: {
              'account_id': selected_id,
              'message_thread_id': messageThreadId
          }
      }).then((response) => {
          load_or_search_message_list(selected_id, do_select);
      })
  } else {
      do_select();
  }
}

export function replyToggle(tree) {
  tree.select('messages').select('reply_active').set(true);
}

export function changeReplyContent(tree, contentValue) {
  tree.select('messages').select('reply_content').set(contentValue);
  tree.select('messages').select('errors', 'reply').set(false);
  tree.commit();
}

export function cancelReply(tree) {
  tree.select('messages').select('reply_active').set(false);
  tree.select('messages').select('reply_content').set('');
}

export function checkReply(tree) {
  const reply_content = tree.select('messages').get('reply_content');
  if (reply_content == '') { //if no reply entered. trigger error
    tree.select('messages').select('errors', 'reply').set(true);
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
    const active_uuid = tree.select('messages').get('active_message_thread');
    const reply_content = tree.select('messages').get('reply_content');
    tree.select('messages').select('sending_reply').set(true);
    axios({
        method: 'post',
        url: '/messaging/reply-to-thread/',
        headers: {"X-CSRFToken": Django.csrf_token()},
        data: {
            'account_id': selected_id,
            'uuid': active_uuid,
            'reply': reply_content
          }
      }).then((response) => {
        close_confirmation();
        load_message_list(selected_id, select_available_active);
        tree.select('messages').select('sending_reply').set(false);
        console.log('Message has been successfully replied to.');
    }).catch((error) => {
        const error_data = error.response && error.response.data;
        if(error_data && error_data.primary_message_thread) {
            const primary_thread_id = error_data.primary_message_thread;
            tree.select('messages', 'primary_message_thread').set(primary_thread_id);
            tree.select('confirmation').set('sendFromPrimary');
            tree.select('messages').select('sending_reply').set(false);
        }
    });
}

export function confirmSendFromPrimary(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const primary_thread_id = tree.get('messages', 'primary_message_thread');
  let select_available_active = () => {
    setActiveMessageThread(tree, primary_thread_id);
    refreshMessageList(tree, primary_thread_id);
    refreshMiniProfile(tree, primary_thread_id);
    tree.commit();
  };
  load_message_list(selected_id, select_available_active);
  close_confirmation();
}

export function messagingLock(tree) {
  tree.select('messages', 'messages_lock').set(true);
}

export function closeConfirmationDialog(tree) {
    close_confirmation();
}

export function toggleArchived(tree) {
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if (!selected_id) {
        selected_id = account_id;
    }
    const active_uuid = tree.select('messages').get('active_message_thread');
    axios({
        method: 'post',
        url: '/messaging/toggle-archived/',
        headers: {"X-CSRFToken": Django.csrf_token()},
        data: {
            'account_id': selected_id,
            'message_thread_id': active_uuid,
        }
    }).then((response) => {
        load_or_search_message_list(selected_id, select_available_active);
    }).catch((error) => {
        console.log(error);
    })
}

export function changeSubfilter(tree, value) {
  tree.select('messages').select('selected_type').set(value);
  select_available_active();
  tree.select('alert').set(false);
}

let search_message_list = (account_id, query, callback) => {
    let wrapped_callback = () => {
        if(callback) {
            callback();
        }
    }

    let archived_param = '';
    const selected_filter = tree.select('messages', 'selected_filter').get();
    if('open' === selected_filter) {
        archived_param = 'false';
    } else if('closed' === selected_filter) {
        archived_param = 'true';
    }

    axios({
        method: 'get',
        url: `/api/message_threads/?account_id=${account_id}&search=${query}&page_size=100&archived=${archived_param}`
    }).then((response) => {
        if(response.data) {
            tree.select('messages').select('message_thread_list').set(response.data.results);
        }
        wrapped_callback();
    });
}

let load_or_search_message_list = (account_id, callback) => {
    let query = tree.get('messages', 'search_query');
    if(query) {
        search_message_list(account_id, query, callback)
    } else {
        load_message_list(account_id, callback);
    }
}

let pending_request = null;

export function changeSearchQuery(tree, value) {
  tree.select('messages', 'search_query').set(value);
  if (pending_request) {
    clearTimeout(pending_request);
  }
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let async_call = null;
  if (!value) {
    async_call = () => {load_message_list(selected_id, select_available_active);};
  } else {
    async_call = () => {search_message_list(selected_id, value, select_available_active);};
  }
  pending_request = setTimeout(async_call, 200);
}

export function deleteInvoiceConfirm(tree, invoice_id) {
    tree.select('messages', 'invoice').set(invoice_id);
    tree.select('confirmation').set('deleteInvoice');
}

export function deleteInvoice(tree) {
    const invoice_id = tree.get('messages', 'invoice');
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if (!selected_id) {
      selected_id = account_id;
    }
    axios({
        method: 'delete',
        url: '/api/invoices/' + invoice_id + '/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        tree.select('alert').set({
           body: 'Invoice Deleted',
           alert_type: 'success'
        });
        load_or_search_message_list(selected_id, select_available_active);
    })
    .catch((error) => {
      console.log(error);
    });
    tree.select('messages', 'invoice').set(null);
    tree.select('confirmation').set(false);

}

function openActivatePaymentsPrompt(tree) {
    tree.select('appointpal', 'activate_payments', 'requested').set(false);
    tree.select('appointpal', 'activate_payments_prompt').set(true);
}

export function startEmptyInvoice(tree) {
    const merchant_id = tree.get('appointpal', 'merchant_id');
    if(!merchant_id) {
        openActivatePaymentsPrompt(tree);
        return;
    }
    const provider = tree.select('account', 'selected_provider').get();
    const description = tree.select('appointpal', 'tools', 'invoice', 'description').get();
    const amount = tree.select('appointpal', 'tools', 'invoice', 'amount').get();
    const invoice_date = tree.select('appointpal', 'tools', 'invoice', 'invoice_date').get();
    const due_date = tree.select('appointpal', 'tools', 'invoice', 'due_date').get();
    const tax_rate = tree.select('appointpal', 'tools', 'invoice', 'tax_rate').get();

    tree.select('appointpal', 'invoice_builder', 'recipient').set(null);
    tree.select('appointpal', 'invoice_builder', 'provider').set(provider);
    tree.select('appointpal', 'invoice_builder', 'line_items').set(
        [
            {
                description: description,
                quantity: 1,
                amount: amount,
                discount: 0.00
            }
        ]
    );
    tree.select('appointpal', 'invoice_builder', 'invoice_date').set(invoice_date);
    tree.select('appointpal', 'invoice_builder', 'due_date').set(due_date);
    tree.select('appointpal', 'invoice_builder', 'tax_rate').set(tax_rate);
    tree.select('appointpal', 'invoice_stepper', 'step').set(1);
    tree.commit();
    tree.select('appointpal', 'tools', 'invoice', 'description').set('');
    tree.select('appointpal', 'tools', 'invoice', 'amount').set(0.0);
    tree.select('appointpal', 'tools', 'invoice', 'invoice_date').set(moment().format('YYYY-MM-DD'));
    tree.select('appointpal', 'tools', 'invoice', 'due_date').set(moment().format('YYYY-MM-DD'));
}
