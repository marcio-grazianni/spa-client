import {monkey} from 'baobab'
import moment from 'moment'
const dashboard = {
  payments_is_loading: true,
  pxi_is_loading: true,
  date_upgrade_prompt: false,
  selected_top_menu: Django.dashboard_selected_top_menu || 'payments',
  start_date: moment().subtract(10, 'days'),
  end_date: moment().subtract(0, 'days'),
  sxi: {
    average: -1,
    breakdown: {
      advocates: 0,
      neutral: 0,
      adversaries: 0
    }
  },
  payment_stats: {
    total: 0.0,
    succeeded: 0.0,
    failed: 0.0,
    refunded: 0.0,
    succeeded_pct: 50,
    failed_pct: 40,
    refunded_pct: 10
  },
  breakdown_hover: {
    advocates: false,
    neutral: false,
    adversaries: false,
  },
  payments_breakdown_hover: {
    succeeded: false,
    failed: false,
    refunded: false,
  },
  reviews_count: 0,
  actual_reviews_count: 0,
  overall_rating: -1,
  sessions: [],
  payments: [],
  star_breakdown: {
    star_1: 0,
    star_2: 0,
    star_3: 0,
    star_4: 0,
    star_5: 0,
  },
  item_breakdown: [],
  selected_source: null,
  source_breakdown: {},
  source_count: {},
  source_count_ordered: monkey({ // COMMENT COUNTS ORDERED
    cursors: {
      sources: ['sources'],
      source_count: ['dashboard', 'source_count'],
    },
    get: (state) => {
      // add subscribervoice to sources
      let sources = state.sources.slice();
      sources.unshift("subscribervoice");
      if (state.sources) {
        const SourceOrder = sources.map((source) => {
          if (state.source_count[source]) {
            return {slug: source, count: state.source_count[source]};
          } else {
            return {slug: source, count: 0};
          }
        });
        SourceOrder.sort((a, b) =>
          (b.count - a.count)
        );
        return SourceOrder;
      } else {
        return [];
      }
    },
  }),
  source_breakdown_count_ordered: monkey({ // REVIEW COUNTS ORDERED
    cursors: {
      sources: ['sources'],
      source_breakdown: ['dashboard', 'source_breakdown'],
    },
    get: (state) => {
      // add subscribervoice to sources
      let sources = state.sources.slice();
      sources.unshift("subscribervoice");
      if (state.sources) {
        const SourceOrder = sources.map((source) => {
          if (state.source_breakdown[source]) {
            return {slug: source, count: state.source_breakdown[source]['total']};
          } else {
            return {slug: source, count: 0};
          }
        });
        SourceOrder.sort((a, b) =>
          (b.count - a.count)
        );
        return SourceOrder;
      } else {
        return [];
      }
    },
  }),
  selected_payment_source: null,
  payment_source_breakdown: {},
  payment_source_count: {},
  payment_source_count_ordered: monkey({ // COMMENT COUNTS ORDERED
    cursors: {
      sources: ['payment_sources'],
      source_count: ['dashboard', 'payment_source_count'],
    },
    get: (state) => {
      let sources = state.sources.slice();
      if (state.sources) {
        const SourceOrder = sources.map((source) => {
          if (state.source_count[source]) {
            return {slug: source, count: state.source_count[source]};
          } else {
            return {slug: source, count: 0};
          }
        });
        SourceOrder.sort((a, b) =>
          (b.count - a.count)
        );
        return SourceOrder;
      } else {
        return [];
      }
    },
  }),
  payment_source_breakdown_count_ordered: monkey({ // REVIEW COUNTS ORDERED
    cursors: {
      sources: ['payment_sources'],
      source_breakdown: ['dashboard', 'payment_source_breakdown'],
    },
    get: (state) => {
      let sources = state.sources.slice();
      if (state.sources) {
        const SourceOrder = sources.map((source) => {
          if (state.source_breakdown[source]) {
            return {slug: source, count: state.source_breakdown[source]['total']};
          } else {
            return {slug: source, count: 0};
          }
        });
        SourceOrder.sort((a, b) =>
          (b.count - a.count)
        );
        return SourceOrder;
      } else {
        return [];
      }
    },
  }),
}

export default dashboard;