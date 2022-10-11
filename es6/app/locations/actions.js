import axios from 'axios'
import moment from 'moment'

export function initialLoad(tree) {
  let start = tree.select('locations').get('start_date').format('YYYYMMDDHHmmss');
  let end = tree.select('locations').get('end_date').format('YYYYMMDDHHmmss');
  axios({
    method: 'post',
    url: '/dashboard/geojson/total/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'start': start,
      'end': end
    }
  }).then((response) => {
    if(response.data) {
      const marker_list = response.data.features;
      tree.select('locations', 'markers').set(marker_list);
      let locs_sorted = marker_list.slice(0);
      locs_sorted.sort((a, b) => {
        if (b['rating'] - a['rating'] === 0) {
          if ((b['review_count'] - a['review_count']) === 0) {
            return b['breakdown']['advocates'] - a['breakdown']['advocates'];
          }
          return b['review_count'] - a['review_count'];
        }
        return (b['rating'] - a['rating']);
      });
      let location_list = locs_sorted.map((loc, i) => {
        return {
          rank: (i + 1),
          name: loc['location_info']['name'],
          rating: loc['rating'],
          total_reviews: loc['review_count'],
          satisfaction: `${loc['breakdown']['advocates']}%`,
          previous_node: loc['previous_node'],
          series: loc['series'],
          max: loc['max'],
        }
      });
      tree.select('locations', 'location_list').set(location_list);
    }
  });
}

export function changeRange(tree, start_date, end_date) {
  tree.select('locations').select('start_date').set(moment(start_date));
  tree.select('locations').select('end_date').set(moment(end_date));
  tree.commit();
  let start = start_date.format('YYYYMMDDHHmmss');
  let end = end_date.format('YYYYMMDDHHmmss');
  axios({
    method: 'post',
    url: '/dashboard/geojson/total/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'start': start,
      'end': end
    }
  }).then((response) => {
    if(response.data) {
      const marker_list = response.data.features;
      tree.select('locations', 'markers').set(marker_list);
      let locs_sorted = marker_list.slice(0);
      locs_sorted.sort((a, b) => {
        if (b['rating'] - a['rating'] === 0) {
          if ((b['review_count'] - a['review_count']) === 0) {
            return b['breakdown']['advocates'] - a['breakdown']['advocates'];
          }
          return b['review_count'] - a['review_count'];
        }
        return (b['rating'] - a['rating']);
      });
      let location_list = locs_sorted.map((loc, i) => {
        return {
          rank: (i + 1),
          name: loc['location_info']['name'],
          rating: loc['rating'],
          total_reviews: loc['review_count'],
          satisfaction: `${loc['breakdown']['advocates']}%`,
          previous_node: loc['previous_node'],
          series: loc['series'],
          max: loc['max'],
        }
      });
      tree.select('locations', 'location_list').set(location_list);
    }
  });
}

export function changeField(tree, fieldId) {
  tree.select('locations', 'active_field').set(fieldId)
}

export function setActive(tree, rank) {
  tree.select('locations', 'rank').set(rank)
}

export function changeMouseOver(tree, rank, index, hover_state) {
  tree.select('locations')
    .select('location_list', {rank}, 'series', {index}, 'hover')
    .set(hover_state)
}

export function changeMarkerMouseOver(tree, id, hover_state) {
  tree.select('locations', 'markers', {id}, 'hover').set(hover_state);
}
