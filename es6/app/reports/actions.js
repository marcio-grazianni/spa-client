import axios from 'axios'
import moment from 'moment'

export function initialLoad(tree) {
  tree.select('reports').select('is_loading').set(true);
  tree.select('reports', 'report_list').set([]);
  tree.commit();

  let start = tree.select('reports').get('start_date').format('YYYYMMDDHHmmss');
  let end = tree.select('reports').get('end_date').format('YYYYMMDDHHmmss');

  const account_id = tree.get('account', 'account_id');
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
    method: 'get',
    url: `/dashboard/get-reports/?account_id=${selected_id}&start=${start}&end=${end}&provider_id=${provider_id}`
  }).then((response) => {
    if(response.data) {
      tree.select('reports', 'report_list').set(response.data);
    }
    tree.select('reports').select('is_loading').set(false);
  });
}

export function changeRange(tree, start_date, end_date) {
  tree.select('reports').select('is_loading').set(true);
  tree.select('reports', 'report_list').set([]);
  tree.commit();

  tree.select('reports').select('start_date').set(moment(start_date));
  tree.select('reports').select('end_date').set(moment(end_date));
  tree.commit();

  let start = moment(start_date).format('YYYYMMDDHHmmss');
  let end = moment(end_date).format('YYYYMMDDHHmmss');
  
  const account_id = tree.get('account', 'account_id');
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
    method: 'get',
    url: `/dashboard/get-reports/?account_id=${selected_id}&start=${start}&end=${end}&provider_id=${provider_id}`
  }).then((response) => {
    if(response.data) {
      tree.select('reports', 'report_list').set(response.data);
    }
    tree.select('reports').select('is_loading').set(false);
  });
}

export function expandReport(tree, reportId) {
  tree.select('reports', 'expanded').set(reportId)
}

export function closeExpandedReport(tree) {
  tree.select('reports', 'expanded').set(false)
}
