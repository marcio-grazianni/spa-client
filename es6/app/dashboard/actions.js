import axios from 'axios'
import moment from 'moment'

let sxiToRating = (sxi, decimals = 1) => {
  return Number(Math.round((sxi / 20)+'e'+decimals)+'e-'+decimals);
}

let selectHighestPaymentSourceCount = (tree) => {
  // if unpaid then we just select subscribervoice
  if (!tree.get('account', 'paid_account')) {
    tree.select('dashboard', 'selected_payment_source').set('appointpal');
    return true;
  }

  const payment_source_counts = tree.get('dashboard', 'payment_source_count_ordered');
  if (payment_source_counts.length === 0) {
    return false;
  }
  const highest_payment_source_slug = payment_source_counts[0]['slug'];
  tree.select('dashboard', 'selected_payment_source').set(highest_payment_source_slug);
}

let selectHighestReviewSourceCount = (tree) => {
  // if unpaid then we just select subscribervoice
  if (!tree.get('account', 'paid_account')) {
    tree.select('dashboard', 'selected_source').set('subscribervoice');
    return true;
  }

  const source_counts = tree.get('dashboard', 'source_breakdown_count_ordered');
  if (source_counts.length === 0) {
    return false;
  }
  const highest_source_slug = source_counts[0]['slug'];
  tree.select('dashboard', 'selected_source').set(highest_source_slug);
}


export function initialLoad(tree) {
  let start = moment(tree.select('dashboard').get('start_date'));
  let end = moment(tree.select('dashboard').get('end_date'));
  start = start.format('DD-MMM-YY');
  end = end.format('DD-MMM-YY');

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

  tree.select('dashboard').select('payments_is_loading').set(true);
  axios({
    method: 'post',
    url: '/dashboard/update-payments-dashboard-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start': start,
      'end': end
    }
  }).then((response) => {
    tree.select('dashboard').select('payments').set(response.data.payments_data);
    tree.select('dashboard').select('item_breakdown').set(response.data.item_breakdown);
    tree.select('dashboard').select('payment_source_count').set(response.data.payment_source_count);
    tree.select('dashboard', 'payment_stats', 'total').set(response.data.payments_breakdown.total_dollars);
    tree.select('dashboard', 'payment_stats', 'succeeded').set(response.data.payments_breakdown.succeeded_dollars);
    tree.select('dashboard', 'payment_stats', 'failed').set(response.data.payments_breakdown.failed_dollars);
    tree.select('dashboard', 'payment_stats', 'refunded').set(response.data.payments_breakdown.refunded_dollars);
    tree.select('dashboard', 'payment_stats', 'succeeded_pct').set(response.data.payments_breakdown.succeeded_pct);
    tree.select('dashboard', 'payment_stats', 'failed_pct').set(response.data.payments_breakdown.failed_pct);
    tree.select('dashboard', 'payment_stats', 'refunded_pct').set(response.data.payments_breakdown.refunded_pct);
    tree.select('dashboard', 'payment_stats', 'series').set(response.data.payments_series.series_data);
    tree.commit();

    selectHighestPaymentSourceCount(tree);
    tree.select('dashboard').select('payments_is_loading').set(false);
  }).catch((error) => {
    console.log(error);
  });

  tree.select('dashboard').select('pxi_is_loading').set(true);
  axios({
    method: 'post',
    url: '/dashboard/update-pxi-dashboard-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start': start,
      'end': end
    }
  }).then((response) => {
    tree.select('dashboard').select('sxi').set(response.data.sxi_data);
    tree.select('dashboard', 'reviews_count').set(response.data.total_sessions);
    tree.select('dashboard', 'actual_reviews_count').set(response.data.total_sessions_actual);
    tree.select('dashboard', 'external_reviews_count').set(response.data.total_external_reviews);
    tree.select('dashboard', 'overall_rating').set(sxiToRating(response.data.sxi_data.average));
    tree.select('dashboard', 'star_breakdown').set(response.data.star_breakdown);
    tree.select('dashboard', 'source_breakdown').set(response.data.source_breakdown);
    tree.select('dashboard', 'source_count').set(response.data.source_count);
    tree.select('dashboard').select('sessions').set(response.data.engagement_data);
    tree.commit();

    selectHighestReviewSourceCount(tree);
    tree.select('dashboard').select('pxi_is_loading').set(false);
  }).catch((error) => {
    console.log(error);
  });
}

export function changeRange(tree, start_date, end_date) {
  let paid_account = tree.get('account', 'paid_account');
  let grandfathered = tree.get('account', 'grandfathered');

  if (!paid_account && !grandfathered) {
    tree.select('dashboard', 'date_upgrade_prompt').set(true);
    return false;
  }
  tree.select('dashboard').select('start_date').set(moment(start_date));
  tree.select('dashboard').select('end_date').set(moment(end_date));
  tree.commit();

  refreshDashboards(tree);
}

export function refreshDashboards(tree) {
  tree.select('dashboard').select('payments_is_loading').set(true);
  tree.select('dashboard').select('pxi_is_loading').set(true);

  const start_date =  tree.get('dashboard', 'start_date');
  const end_date = tree.get('dashboard', 'end_date');

  const start = moment(start_date).format('DD-MMM-YY');
  const end = moment(end_date).format('DD-MMM-YY');

  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }

  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
    method: 'post',
    url: '/dashboard/update-payments-dashboard-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start': start,
      'end': end
    }
  }).then((response) => {
    tree.select('dashboard').select('payments').set(response.data.payments_data);
    tree.select('dashboard').select('item_breakdown').set(response.data.item_breakdown);
    tree.select('dashboard').select('payment_source_count').set(response.data.payment_source_count);
    tree.select('dashboard', 'payment_stats', 'total').set(response.data.payments_breakdown.total_dollars);
    tree.select('dashboard', 'payment_stats', 'succeeded').set(response.data.payments_breakdown.succeeded_dollars);
    tree.select('dashboard', 'payment_stats', 'failed').set(response.data.payments_breakdown.failed_dollars);
    tree.select('dashboard', 'payment_stats', 'refunded').set(response.data.payments_breakdown.refunded_dollars);
    tree.select('dashboard', 'payment_stats', 'succeeded_pct').set(response.data.payments_breakdown.succeeded_pct);
    tree.select('dashboard', 'payment_stats', 'failed_pct').set(response.data.payments_breakdown.failed_pct);
    tree.select('dashboard', 'payment_stats', 'refunded_pct').set(response.data.payments_breakdown.refunded_pct);
    tree.select('dashboard', 'payment_stats', 'series').set(response.data.payments_series.series_data);
    tree.commit();

    selectHighestPaymentSourceCount(tree);
    tree.select('dashboard').select('payments_is_loading').set(false);
  }).catch((error) => {
    console.log(error);
  });

  axios({
    method: 'post',
    url: '/dashboard/update-pxi-dashboard-data/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'account_id': selected_id,
      'provider_id': provider_id,
      'start': start,
      'end': end
    }
  }).then((response) => {
    tree.select('dashboard').select('sxi').set(response.data.sxi_data);
    tree.select('dashboard', 'reviews_count').set(response.data.total_sessions);
    tree.select('dashboard', 'actual_reviews_count').set(response.data.total_sessions_actual);
    tree.select('dashboard', 'external_reviews_count').set(response.data.total_external_reviews);
    tree.select('dashboard', 'overall_rating').set(sxiToRating(response.data.sxi_data.average));
    tree.select('dashboard', 'star_breakdown').set(response.data.star_breakdown);
    tree.select('dashboard', 'source_breakdown').set(response.data.source_breakdown);
    tree.select('dashboard', 'source_count').set(response.data.source_count);
    tree.select('dashboard').select('sessions').set(response.data.engagement_data);
    tree.commit();

    selectHighestReviewSourceCount(tree);
    tree.select('dashboard').select('pxi_is_loading').set(false);
  }).catch((error) => {
    console.log(error);
  });
}

export function onChangeSection(tree) {
  tree.select('alert').set(false);
}
