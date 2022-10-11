import {monkey} from 'baobab'
import moment from 'moment'

const activity = {
  selected_top_menu: Django.activity_selected_top_menu || 'contacts',
  selected: "contacts",
  search_query: "",
  start_date: moment().subtract(365, 'days'),
  end_date: moment().subtract(0, 'days'),
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
  contacts: {
    loading: false,
    status_filter: "ALL",
    contact_list: [],
    summary_statistics: {
      total_contacts: null,
      pending_contacts: null,
      active_contacts: null,
      archived_contacts: null,
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
  plans: {
    loading: false,
    status_filter: "ALL",
    recurring_invoice_list: [],
    summary_statistics: {
      total_dollars: null,
      active_dollars: null,
      completed_dollars: null,
      canceled_dollars: null
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
  subscriptions: {
    loading: false,
    status_filter: "ALL",
    subscription_list: [],
    summary_statistics: {
      total_dollars: null,
      active_dollars: null,
      completed_dollars: null,
      canceled_dollars: null
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
  appointments: {
    loading: false,
    status_filter: "ALL",
    appointment_list: [],
    summary_statistics: {
      total_appointments: null,
      confirmed_appointments: null,
      cancelled_appointments: null,
      missed_appointments: null,
      completed_appointments: null
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
  appointment_requests: {
    loading: false,
    status_filter: "ALL",
    appointment_request_list: [],
    summary_statistics: {
      total_requests: null,
    },
    ordering: '-created_at',
    pages: -1,
    page: 0,
    page_size: 20,
    sorted: null,
    filtered: "",
    search_query: "",
    sort: "created_at",
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
        invite_list: ['activity', 'review_invites', 'invite_list']
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
        invite_list: ['activity', 'review_invites', 'invite_list'],
        search_query: ['activity', 'review_invites', 'search_query'],
        sort: ['activity', 'review_invites', 'sort'],
        sort_direction: ['activity', 'review_invites', 'sort_direction']
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
  }
}

export default activity;