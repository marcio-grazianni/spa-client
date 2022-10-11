import axios from 'axios'
import tree from '../../state'

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
  refreshMessageList(tree, new_active_thread_id);
}

let load_message_list = (account_id, callback) => {
  let wrapped_callback = () => {
    if(callback) {
      callback();
     }
  }
  axios({
      method: 'get',
      url: `/api/message_threads/?account_id=${account_id}&page_size=100`
  }).then((response) => {
      if(response.data) {
          tree.select('messages').select('message_thread_list').set(response.data.results);
      }
      wrapped_callback();
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

function openActivatePaymentsPrompt(tree) {
    tree.select('appointpal', 'activate_payments', 'requested').set(false);
    tree.select('appointpal', 'activate_payments_prompt').set(true);
}

export function sendIntakeForm(tree) {
  const merchant_id = tree.get('appointpal', 'merchant_id');
  if(!merchant_id) {
      openActivatePaymentsPrompt(tree);
      return;
  }
  const message_thread = tree.get('messages', 'current_message_thread');
  if(!message_thread) {
      return;
  }
  tree.select('appointpal', 'tools', 'intake', 'sending').set(true);
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const meta_data = {
      type: 'intake_form'
  };
  axios({
        method: 'post',
        url: '/api/messages/',
        headers: {"X-CSRFToken": Django.csrf_token()},
        data: {
            message_thread: message_thread.id,
            direction: "outbound",
            meta_data: meta_data
        }
    })
    .then((response) => {
      tree.select('appointpal', 'tools', 'intake', 'sending').set(false);
      tree.select('alert').set({
        body: 'Intake form successfully sent!',
        alert_type: 'success'
      });
      load_message_list(selected_id, select_available_active);
    })
    .catch((error) => {
      tree.select('appointpal', 'tools', 'intake', 'sending').set(false);
      let alert_message = 'Message not sent.';
      if (error.response && error.response.data) {
        alert_message = error.response.data.message;
      }
      tree.select('alert').set({
        body: alert_message,
        alert_type: 'error'
      });
    });
}