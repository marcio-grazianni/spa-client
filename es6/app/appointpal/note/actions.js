import axios from 'axios'

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

export function saveNote(tree) {
  const message_thread = tree.get('messages', 'current_message_thread');
  if(!message_thread) {
      return;
  }

  tree.select('appointpal', 'tools', 'intake', 'saving').set(true);
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const body = tree.get('appointpal', 'tools', 'notes', 'content');
  const meta_data = {
      type: 'note'
  };

  axios({
      method: 'post',
      url: '/api/messages/',
      headers: {"X-CSRFToken": Django.csrf_token()},
      data: {
          message_thread: message_thread.id,
          direction: "self",
          body: body,
          meta_data: meta_data
      }
    })
    .then((response) => {
      tree.select('appointpal', 'tools', 'notes', 'content').set("");
      tree.select('alert').set({
        body: 'Note saved!',
        alert_type: 'success'
      });
      refreshMessageList(tree, message_thread.uuid);
    })
    .catch((error) => {
      let alert_message = 'Note not saved.';
      if (error.response && error.response.data) {
        alert_message = error.response.data.message;
      }
      tree.select('alert').set({
        body: alert_message,
        alert_type: 'error'
      });
    });
  tree.select('appointpal', 'tools', 'intake', 'saving').set(false);
}