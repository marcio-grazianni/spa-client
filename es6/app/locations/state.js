import {monkey} from 'baobab'
import moment from 'moment'

const locations = {
  selected_top_menu: 'leaderboard',
  start_date: moment().subtract(90, 'days'),
  end_date: moment().subtract(0, 'days'),
  markers: [],
  rank: 1,
  active_field: 'rating',
  location_list: [],
  current_location: monkey({
    cursors: {
      location_list: ['locations', 'location_list'],
      rank: ['locations', 'rank'],
    },
    get: (state) => {
      let current_locations = state.location_list.filter((location) => {
        return (location.rank === state.rank);
      });
      return current_locations[0];
    }
  }),
}

export default locations;