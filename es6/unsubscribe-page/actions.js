import tree from './state'
import axios from 'axios'
import qs from 'qs'

export function changeReceiveStatus(tree, payload) {
  if (payload === 'receive') {
    tree.select('receive').set(true);
  } else {
    tree.select('receive').set(false);
  }
}

export function submitForm(tree) {
  const receive = tree.get('receive');
  if (!receive) {
    axios.post(`/subscriber-unsubscribe/${tree.get('subscriber_list_id')}/${tree.get('subscriber_id')}/confirm/`, qs.stringify({
      csrfmiddlewaretoken: Django.csrf_token,
    }))
    .then((response) => {
      tree.select('confirmed').set(true);
    })
    .catch((error) => {
      debugger
    })
  } else {
    tree.select('confirmed').set(true);
  }
}
