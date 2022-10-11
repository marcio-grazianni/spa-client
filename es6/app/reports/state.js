import {monkey} from 'baobab'
import moment from 'moment'

const reports = {
  selected_top_menu: 'all',
  start_date: moment().subtract(90, 'days'),
  end_date: moment().subtract(0, 'days'),
  is_loading: false,
  report_list: [],
  expanded: false,
  displayed: monkey({
    cursors: {
      report_list: ['reports', 'report_list'],
      selected: ['reports', 'selected_top_menu'],
    },
    get: (state) => {
      // TODO: actually do filtering here
      let filtered_list = state.report_list.slice(0);
      if (state.selected !== 'all') {
        filtered_list = filtered_list.filter((report) =>
          (report.report_type === state.selected)
        );
      }
      let sorted_list = filtered_list.slice(0);

      sorted_list.sort((a, b) => {
        if (moment(a.end_date).isBefore(moment(b.end_date))) {
          return 1;
        }
        else if (moment(a.end_date).isSame(moment(b.end_date))) {
          if (moment(a.start_date).isBefore(moment(b.start_date))) {
            return 1;
          }
          else {
            return -1;
          }
        }
        else {
          return -1;
        }
      });
      return sorted_list
    },
  }),
  current_report: monkey({
    cursors: {
      report_list: ['reports', 'report_list'],
      expanded: ['reports', 'expanded'],
    },
    get: (state) => {
      let expanded = state.report_list.filter((report) => {
        return report.id === state.expanded;
      });
      return expanded[0];
    },
  }),
  channel_breakdown: monkey({
    cursors: {
      current_report: ['reports', 'current_report'],
    },
    get: (state) => {
      let source_breakdown;
      let channel_breakdown;
      if (!state.current_report) {
        return [];
      }
      source_breakdown = state.current_report.data.source_breakdown;
      channel_breakdown = Object.entries(source_breakdown).map(([key, value]) => {
        return( 
          {
            slug: key,
            total_reviews: value.total,
            average: value.average
          }
        );
      }).filter((channel_obj) => channel_obj.total_reviews > 0);
      ;
      channel_breakdown.sort((a,b) => {
        return b.total_reviews - a.total_reviews;
      });
      return channel_breakdown
    },
  }),
}

export default reports;