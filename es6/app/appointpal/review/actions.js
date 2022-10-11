import tree from '../../state'
import axios from "axios";


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

export function sendReviewInvite(tree) {
  tree.select('appointpal', 'tools', 'review', 'sending').set(true);
  const account_id = tree.get('account', 'account_id');
  const message_thread = tree.get('messages', 'current_message_thread');
  const mini_profile = tree.get('messages', 'mini_profile');
  if(!message_thread || !mini_profile) {
      return;
  }
  const message_type = message_thread.outbound_message_type;
  const contact = mini_profile.subscriber_id;
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  axios({
      method: 'post',
      url: '/api/review_invites',
      headers: {"X-CSRFToken": Django.csrf_token()},
      data: {
          'account': selected_id,
          'provider': provider_id,
          'contact': contact,
          'message_type': message_type
      }
  }).then((response) => {
      load_message_list(selected_id, select_available_active);
      tree.select('alert').set({
          body: 'Invite successfully sent!',
          alert_type: 'success'
      });
      refreshMessageList(tree, message_thread.uuid);
  }).catch((error) => {
      const status = error.response.status;
      if(status < 500) {
          let alert_message = 'Message not sent.';
          if (error.response.data) {
              alert_message = error.response.data.message;
          }
          tree.select('alert').set({
              body: alert_message,
              alert_type: 'error'
          });
      } else {
          tree.select('alert').set({
              body: 'Something went wrong. Please wait a few minutes and try again.',
              alert_type: 'error'
          });
      }
      tree.select('appointpal', 'tools', 'review', 'sending').set(false);
  });
}