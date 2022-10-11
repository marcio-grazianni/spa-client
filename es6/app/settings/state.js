import {monkey} from 'baobab'
import moment from 'moment'

const settings = {
  selected_top_menu: 'user_info',
  review_site_lock: false,
  inputs: {
    company_name: {
      value: "",
      error: false,
      has_changed: false,
    },
    company_logo: {
      value: "",
      error: false,
      preview: false,
      format: false,
      has_changed: false,
    },
    company_url: {
      value: "",
      error: false,
      has_changed: false,
    },
    company_tz: {
      value: "",
      error: false,
      has_changed: false,
    },
    reply_to: {
      value: "",
      error: false,
      has_changed: false,
    },
    username: {
      value: "",
      error: false,
      has_changed: false,
    },
    first_name: {
      value: "",
      error: false,
      has_changed: false,
    },
    last_name: {
      value: "",
      error: false,
      has_changed: false,
    },
    phone_number: {
      value: "",
      error: false,
      has_changed: false,
    },
    current_password: {
      value: "",
      error: false,
      has_changed: false,
    },
    new_password_1: {
      value: "",
      error: false,
      has_changed: false,
    },
    new_password_2: {
      value: "",
      error: false,
      has_changed: false,
    },
    weekly_digest: {
      value: "",
      error: false,
      has_changed: false,
    },
    email_notifications: {
      value: "",
      error: false,
      has_changed: false,
    },
    tax_rate: {
      value: "",
      error: false,
      has_changed: false,
    }
  },
  password_validation: {
    verified: false,
    match: false,
  },
  review_sites: {
    add_profile: "",
    all_sources: [],
    delete_ids: [],
    current_sources: [],
    has_changed: false,
  },
  activity: {
    selected: "payments",
    search_query: "",
    payments: {
      loading: false,
      status_filter: "ALL",
      payment_list: [],
      summary_statistics: {
        total_dollars: null,
        succeeded_dollars: null,
        failed_dollars: null,
        refunded_dollars: null
      },
      ordering: '-updated_at',
      pages: -1,
      page: 0,
      page_size: 20,
      sorted: null,
      filtered: "",
      search_query: "",
      sort: "updated_at",
      sort_direction: "down",
      selected: null
    },
    invoices: {
      loading: false,
      status_filter: "ALL",
      invoice_list: [],
      summary_statistics: {
        total_dollars: null,
        draft_dollars: null,
        sent_dollars: null,
        overdue_dollars: null,
        paid_dollars: null
      },
      ordering: '-updated_at',
      pages: -1,
      page: 0,
      page_size: 20,
      sorted: null,
      filtered: "",
      search_query: "",
      sort: "updated_at",
      sort_direction: "down",
      selected: null
    },
    review_invites: {
      loading: false,
      invite_list: [],
      summary_statistics: {
        total_sent: null,
        total_opened: null,
        total_responded: null
      },
      ordering: '-created_at',
      pages: -1,
      page: 0,
      page_size: 20,
      sorted: null,
      filtered: "",
      search_query: "",
      sort: "date",
      sort_direction: "down",
      invite_ids: monkey({
        cursors: {
          invite_list: ['settings', 'activity', 'review_invites', 'invite_list']
        },
        get: (state) => {
          const {invite_list} = state;
          return invite_list.map((invite) =>
            invite.id
          );
        }
      }),
      displayed_list: monkey({
        cursors: {
          invite_list: ['settings', 'activity', 'review_invites', 'invite_list'],
          search_query: ['settings', 'activity', 'review_invites', 'search_query'],
          sort: ['settings', 'activity', 'review_invites', 'sort'],
          sort_direction: ['settings', 'activity', 'review_invites', 'sort_direction']
        },
        get: (state) => {
          const {invite_list, search_query, sort, sort_direction} = state;
          let displayed_list = invite_list.slice(0);
          const year_0 = moment().year(0); // if still subscribed use year 0 as const for sort
          if (search_query !== "") {
            displayed_list = displayed_list.filter((invite) =>
              invite.email.includes(search_query)
            );
          }
          let multiplier = 1;
          if (sort_direction === 'down') {
            multiplier = -1;
          }
          displayed_list.sort((a, b) => {
            let sortA;
            let sortB;
            if (sort === 'email') {
              sortA = a[sort].toUpperCase();
              sortB = b[sort].toUpperCase();
              if (sortA < sortB) {
                return -1 * multiplier;
              }
              if (sortA > sortB) {
                return multiplier;
              }
              return 0;
            } else if (sort === 'subscription') {
                sortA = year_0;
                sortB = year_0;
                if (a['unsubscribed_at']) {
                  sortA = moment(a['unsubscribed_at'], 'MM/DD/YY')
                }
                if (b['unsubscribed_at']) {
                  sortB = moment(b['unsubscribed_at'], 'MM/DD/YY');
                }
                if (sortA.isAfter(sortB)) {
                  return -1 * multiplier;
                } else if (sortA.isBefore(sortB)) {
                  return 1 * multiplier;
                } else { // if same date sort by email (always up)
                  sortA = a['email'].toUpperCase();
                  sortB = b['email'].toUpperCase();
                  if (sortA < sortB) {
                    return -1;
                  }
                  if (sortA > sortB) {
                    return 1;
                  }
                  return 0;
                }
            }
            sortA = a[sort];
            sortB = b[sort];
            return (sortB - sortA) * multiplier;
          });
          return displayed_list;
        }
      })
    },
  },
  subscribers: {
    subscriber_list: [],
    search_query: "",
    sort: "email",
    sort_direction: "up",
    subscriber_ids: monkey({
      cursors: {
        subscriber_list: ['settings', 'subscribers', 'subscriber_list'],
      },
      get: (state) => {
        const {subscriber_list} = state;
        return subscriber_list.map((subscriber) =>
          subscriber.id
        );
      },
    }),
    displayed_list: monkey({
      cursors: {
        subscriber_list: ['settings', 'subscribers', 'subscriber_list'],
        search_query: ['settings', 'subscribers', 'search_query'],
        sort: ['settings', 'subscribers', 'sort'],
        sort_direction: ['settings', 'subscribers', 'sort_direction'],
      },
      get: (state) => {
        const {subscriber_list, search_query, sort, sort_direction} = state;
        let displayed_list = subscriber_list.slice(0);
        const year_0 = moment().year(0); // if still subscribed use year 0 as const for sort
        if (search_query !== "") {
          displayed_list = subscriber_list.filter((subscriber) =>
            subscriber.email.includes(search_query)
          );
        }
        let multiplier = 1;
        if (sort_direction === 'down') {
          multiplier = -1;
        }
        displayed_list.sort((a, b) => {
          let sortA;
          let sortB;
          if (sort === 'email') {
            sortA = a[sort].toUpperCase();
            sortB = b[sort].toUpperCase();
            if (sortA < sortB) {
              return -1 * multiplier;
            }
            if (sortA > sortB) {
              return 1 * multiplier;
            }
            return 0;
          } else if (sort === 'subscription') {
              sortA = year_0;
              sortB = year_0;
            if (a['unsubscribed_at']) {
              sortA = moment(a['unsubscribed_at'], 'MM/DD/YY')
            }
            if (b['unsubscribed_at']) {
              sortB = moment(b['unsubscribed_at'], 'MM/DD/YY');
            }
            if (sortA.isAfter(sortB)) {
              return -1 * multiplier;
            } else if (sortA.isBefore(sortB)) {
              return 1 * multiplier;
            } else { // if same date sort by email (always up)
              sortA = a['email'].toUpperCase();
              sortB = b['email'].toUpperCase();
              if (sortA < sortB) {
                return -1;
              }
              if (sortA > sortB) {
                return 1;
              }
              return 0;
            }
          }
          sortA = a[sort];
          sortB = b[sort];
          return (sortB - sortA) * multiplier;

        });
        return displayed_list;
      },
    }),
    displayed_ids: monkey({
      cursors: {
        displayed_list: ['settings', 'subscribers', 'displayed_list'],
      },
      get: (state) => {
        const {displayed_list} = state;
        return displayed_list.map((subscriber) =>
          subscriber.id
        );
      },
    }),
    hidden_ids: monkey({
      cursors: {
        subscriber_ids: ['settings', 'subscribers', 'subscriber_ids'],
        displayed_ids: ['settings', 'subscribers', 'displayed_ids'],
      },
      get: (state) => {
        const {subscriber_ids, displayed_ids} = state;
        return subscriber_ids.filter((id) =>
          !(displayed_ids.includes(id))
        );
      },
    }),
    selected_ids: monkey({
      cursors: {
        subscriber_list: ['settings', 'subscribers', 'subscriber_list'],
      },
      get: (state) => {
        const {subscriber_list} = state;
        const selected_subscribers = subscriber_list.filter((subscriber) =>
          subscriber.selected
        );
        const selected_ids = selected_subscribers.map((subscriber) =>
          subscriber.id
        );
        return selected_ids;
      },
    }),
    unsubscribe_ids: monkey({
      cursors: {
        subscriber_list: ['settings', 'subscribers', 'subscriber_list'],
      },
      get: (state) => {
        const {subscriber_list} = state;
        const selected_subscribers = subscriber_list.filter((subscriber) =>
          (subscriber.selected && !(subscriber.unsubscribed))
        );
        const selected_ids = selected_subscribers.map((subscriber) =>
          subscriber.id
        );
        return selected_ids;
      },
    }),
    bulk_add: false,
    bulk_remove: false,
    dropzone_add: {
      hover_state: false,
      hover_timeout: false,
      loading_state: false,
      loaded_state: false,
      filename: "",
    },
    dropzone_remove: {
      hover_state: false,
      hover_timeout: false,
      loading_state: false,
      loaded_state: false,
      filename: "",
    },
    subscriber_add_textarea_value: "",
    subscriber_remove_textarea_value: "",
    file_subscriber_add_list: [],
    file_subscriber_remove_list: [],
    file_subscriber_add_count: 0,
    file_subscriber_remove_count: 0,
    subscriber_add_count: 0,
    subscriber_remove_count: 0,
    added_count: 0,
    removed_count: 0,
    subscriber_add_list: [],
    subscriber_remove_list: [],
    add_filename: "",
  },
}

export default settings;