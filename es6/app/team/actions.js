import axios from 'axios'

// TODO: create app-wide functions file for check functions such as this
let isValidEmailAddress = (email)  => {
  const pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  return pattern.test(email)
}


export function initialLoad(tree) {
  axios({
    method: 'get',
    url: '/users/team-invites/current/details/'
  }).then((response) => {
    if(response.data) {
      tree.select('team', 'user_list').set(response.data);
      tree.select('team', 'user_list_saved').set(response.data);
    }
  });
}

export function addUserInputChange(tree, payload) {
  tree.select('team', 'add_user_input').set(payload);
  tree.commit();
}

export function adminChange(tree, user_id, payload) {
  tree.select('team', 'user_list', {id: user_id}, 'admin').set(payload);
}

export function removeUser(tree, user_id) {
  tree.select('team', 'user_list', {id: user_id}).unset();
}

export function addUser(tree) {
  /**
  tree.select('alert').set({
    body: 'Please <a href="mailto:contact@subscribervoice.com?subject=Add%20new%20user" target="_blank">contact us</a> to add additional users to your team.',
    alert_type: 'error'
  });
  return false;
  **/
  const add_user_input = tree.get('team', 'add_user_input');
  if (!isValidEmailAddress(add_user_input)) {
    tree.select('alert').set({
      body: 'Please make sure you enter a valid email address.',
      alert_type: 'error'
    });
    return false;
  }
  tree.select('team', 'request_pending').set(true);
  axios({
    method: 'post',
    url: '/users/team-invites/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'team_invite_email': encodeURIComponent(add_user_input)
    }
  }).then((response) => {
    if (200 === response.status && response.data) {
      const user_obj = {
        id: response.data,
        email: add_user_input,
        active: false,
        primary_contact: false,
        current_user: false,
      };
      tree.select('team', 'user_list').push(user_obj);
      tree.select('team', 'user_list_saved').push(user_obj);
      tree.select('team', 'add_user_input').set("");
      tree.select('alert').set({
        body: `Invite successfully sent to ${add_user_input}`,
        alert_type: 'success'
      });
    } else if (response.data) {
      let message = (response.data) ? response.data.error : 'We were unable to process your request.';
      tree.select('alert').set({
        body: `${message}`,
        alert_type: 'error'
      });
    }
  });
}

export function saveChanges(tree) {
  const unsaved_changes = tree.get('team', 'unsaved_changes');
  axios({
    method: 'post',
    url: '/users/team-invites/edit',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'users_removed': JSON.stringify(unsaved_changes.to_remove_ids),
      'invite_cancel_ids': JSON.stringify(unsaved_changes.to_cancel_ids),
      'users_to_admin': JSON.stringify(unsaved_changes.to_admin_ids),
      'users_to_non_admin': JSON.stringify(unsaved_changes.to_non_admin_ids)
    }
  }).then((response) => {
    tree.select('alert').set({
      body: 'Your changes have been successfully saved.',
      alert_type: 'success'
    });
  });
}

export function toggleTeamLock(tree) {
  tree.select('team', 'team_lock').set(true);
}
