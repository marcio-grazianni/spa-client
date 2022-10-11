import axios from 'axios'
import moment from 'moment'

function toCurrency(numberString) {
    let number = parseFloat(numberString);
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function initialLoad(tree) {
  let start = tree.select('leaderboard').get('start_date').format('YYYYMMDDHHmmss');
  let end = tree.select('leaderboard').get('end_date').format('YYYYMMDDHHmmss');
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
    method: 'get',
    url: `/get-leaderboard/?start=${start}&end=${end}&account_id=${selected_id}`
  }).then((response) => {
    const leaderboard = response.data;
    let leaderboard_sorted = leaderboard.slice(0);
    leaderboard_sorted.sort((a, b) => {
      if ((b['payments_succeeded'] - a['payments_succeeded']) === 0) {
        if ((b['invoices_paid'] - a['invoices_paid']) === 0) {
          return b['invoices_pending'] - a['invoices_pending'];
        }
        return b['invoices_paid'] - a['invoices_paid'];
      }
      return b['payments_succeeded'] - a['payments_succeeded'];
    });
    let user_list = leaderboard_sorted.map((user, i) => {
      return {
        rank: (i+1),
        name: user['name'],
        invoices_created: `${toCurrency(user['invoices_created'])}`,
        invoices_paid: `${toCurrency(user['invoices_paid'])}`,
        invoices_pending: `${toCurrency(user['invoices_pending'])}`,
        payments_succeeded: `${toCurrency(user['payments_succeeded'])}`,
        previous_node: user['previous_node'],
        series: user['series'],
        max: user['max'],
      }
    });
    tree.select('leaderboard', 'user_list').set(user_list);
  });
}

export function changeRange(tree, start_date, end_date) {

  tree.select('leaderboard').select('start_date').set(moment(start_date));
  tree.select('leaderboard').select('end_date').set(moment(end_date));
  tree.commit();
  let start = start_date.format('YYYYMMDDHHmmss');
  let end = end_date.format('YYYYMMDDHHmmss');
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }

  axios({
    method: 'get',
    url: `/get-leaderboard/?start=${start}&end=${end}&account_id=${selected_id}`
  }).then((response) => {
    const leaderboard = response.data;
    let leaderboard_sorted = leaderboard.slice(0);
    leaderboard_sorted.sort((a, b) => {
      if ((b['payments_succeeded'] - a['payments_succeeded']) === 0) {
        if ((b['invoices_paid'] - a['invoices_paid']) === 0) {
          return b['invoices_pending'] - a['invoices_pending'];
        }
        return b['invoices_paid'] - a['invoices_paid'];
      }
      return b['payments_succeeded'] - a['payments_succeeded'];
    });
    let user_list = leaderboard_sorted.map((user, i) => {
      return {
        rank: (i+1),
        name: user['name'],
        invoices_created: `${toCurrency(user['invoices_created'])}`,
        invoices_paid: `${toCurrency(user['invoices_paid'])}`,
        invoices_pending: `${toCurrency(user['invoices_pending'])}`,
        payments_succeeded: `${toCurrency(user['payments_succeeded'])}`,
        previous_node: user['previous_node'],
        series: user['series'],
        max: user['max'],
      }
    });
    tree.select('leaderboard', 'user_list').set(user_list);
  });
}

export function changeField(tree, fieldId) {
  tree.select('leaderboard', 'active_field').set(fieldId);
}

export function setActive(tree, rank) {
  tree.select('leaderboard', 'rank').set(rank);
}

export function changeMouseOver(tree, rank, index, hover_state) {
  tree.select('leaderboard')
    .select('user_list', {rank}, 'series', {index}, 'hover')
    .set(hover_state)
}
