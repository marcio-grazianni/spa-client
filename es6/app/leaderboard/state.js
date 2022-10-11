import {monkey} from 'baobab'
import moment from 'moment'

const leaderboard = {
  start_date: moment().subtract(90, 'days'),
  end_date: moment().subtract(0, 'days'),
  rank: 1,
  active_field: 'payments_succeeded',
  user_list: [],
  current_user: monkey({
    cursors: {
      user_list: ['leaderboard', 'user_list'],
      rank: ['leaderboard', 'rank'],
    },
    get: (state) => {
      let current_users = state.user_list.filter((user) => {
        return (user.rank === state.rank);
      });
      return current_users[0];
    }
  }),
}

export default leaderboard;