import {monkey} from 'baobab'
import moment from 'moment'
import request from 'superagent'

const messages = {
  messages_lock: false,
  message_thread_list: [],
  message_thread_messages: {},
  message_thread_contacts: {},
  message_list: [],
  mini_profile: null,
  start_date: moment().subtract(90, 'days'),
  end_date: moment().subtract(0, 'days'),
  selected_filter: 'all',
  selected_type: 'all',
  errors: {
    reply: false
  },
  reply_content: "",
  active_message_thread: Django.active_message_thread_id,
  primary_message_thread: null,
  last_thread_by_section: {
      all: null,
      open: null,
      closed: null
  },
  sending_reply: false,
  search_query: Django.search_query,
  invoice: null,
  message_thread: {
      selected_filter: 'all'
  },
  current_message_thread: monkey({
    cursors: {
      message_thread_list: ['messages', 'message_thread_list'],
      active_message_thread: ['messages', 'active_message_thread']
    },
    get: (state) => {
      for (var message_thread of state.message_thread_list) {
        if (message_thread.uuid === state.active_message_thread) {
          return message_thread;
        }
      }
    },
  }),
  displayed_message_threads: monkey({
    cursors: {
      message_thread_list: ['messages', 'message_thread_list'],
      selected_filter: ['messages', 'selected_filter'],
      selected_type: ['messages', 'selected_type']
    },
    get: (state) => {
      let displayed = [];
      for (var message_thread of state.message_thread_list) {
        if (state.selected_type == 'all') {
            displayed.push(message_thread);
        }
        if (state.selected_type == 'appointments' && message_thread.appointment_request_message && 'NA' !== message_thread.appointment_request_message.appointment_type) {
            displayed.push(message_thread)
        }
        if (state.selected_type == 'draft' && message_thread.subscriber_details.draft_dollars > 0) {
            displayed.push(message_thread);
        }
        if (state.selected_type == 'pending' && message_thread.subscriber_details.pending_dollars > 0) {
            displayed.push(message_thread);
        }
        if (state.selected_type == 'overdue' && message_thread.subscriber_details.overdue_dollars > 0) {
            displayed.push(message_thread);
        }
        if (state.selected_type == 'paid' && message_thread.subscriber_details.paid_dollars > 0) {
            displayed.push(message_thread);
        }
      }
      return displayed;
    },
  }),
  displayed_messages: monkey({
    cursors: {
      message_list: ['messages', 'message_list'],
      selected_filter: ['messages', 'message_thread', 'selected_filter']
    },
    get: (state) => {
      let displayed = [];
      if(state.message_list) {
        for (var message of state.message_list) {
          if (state.selected_filter == 'all') {
            displayed.push(message);
          }
          if (state.selected_filter == 'messages' && !message.meta_data) {
            displayed.push(message);
          }
          if (state.selected_filter == 'appointments' && message.meta_data && ('request' === message.meta_data.type || 'direct' === message.meta_data.type)) {
            displayed.push(message);
          }
          if (state.selected_filter == 'invoices' && message.meta_data && 'invoice' === message.meta_data.type) {
            displayed.push(message);
          }
          if (state.selected_filter == 'invites' && message.meta_data && 'review_invite' === message.meta_data.type) {
            displayed.push(message);
          }
          if (state.selected_filter == 'intakes' && message.meta_data && 'intake_form' === message.meta_data.type) {
            displayed.push(message);
          }
          if (state.selected_filter == 'notes' && message.meta_data && 'note' === message.meta_data.type) {
            displayed.push(message);
          }
        }
      }
     return displayed;
    }
  })
}

export default messages;