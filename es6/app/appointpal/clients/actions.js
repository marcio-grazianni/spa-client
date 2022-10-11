import axios from 'axios'
import { isValidPhoneNumber } from 'react-phone-number-input'

let validateEmail = (emailAddress) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(emailAddress);

let validateContact = (contact) => {
    if(!contact) {
        return false;
    }
    const row = contact.split(',');
    if(3 != row.length) {
        return false;
    }
    const email = row[1];
    if(email && !validateEmail(email)) {
        return false;
    }
    const phone = row[2];
    if(phone && !isValidPhoneNumber(phone)) {
        return false;
    }

    return row;
}

function refreshMessageList(tree, message_thread_id) {
    axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/messages/`
    }).then((response) => {
        if (response.data) {
            const message_list = response.data.messages;
            tree.select('messages', 'message_thread_messages', message_thread_id).set(message_list);
            tree.select('messages', 'message_list').set(message_list);
        }
    });
}

function refreshMiniProfile(tree, message_thread_id) {
    axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/mini_profile/`
    }).then((response) => {
        if (response.data) {
            const mini_profile = response.data.mini_profile;
            tree.select('messages', 'message_thread_contacts', message_thread_id).set(mini_profile);
            tree.select('messages', 'mini_profile').set(mini_profile);
        }
    });
}

function setActiveMessageThread(tree, uuid) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    if(current_active_thread === uuid) {
        return;
    }
    tree.select('messages', 'active_message_thread').set(uuid);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    const current_filter = tree.get('messages', 'selected_filter');
    if(current_filter) {
        tree.select('messages', 'last_thread_by_section', current_filter).set(uuid);
    }
}

function unsetActiveMessageThread(tree) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    tree.select('messages', 'active_message_thread').set(null);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    for(var section of ['all', 'open', 'closed']) {
        const last_thread_by_section = tree.get('messages', 'last_thread_by_section', section);
        if(current_active_thread == last_thread_by_section) {
            tree.select('messages', 'last_thread_by_section', section).set(null);
        }
    }
}

export function closeManageClientPrompt(tree) {
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'manage_client_prompt').set(false);
}

export function clearManageClientForm(tree) {
  tree.select('appointpal', 'client_form', 'editing').set(null);
  tree.select('appointpal', 'client_form', 'first_name', 'value').set("");
  tree.select('appointpal', 'client_form', 'first_name', 'error').set(false);
  tree.select('appointpal', 'client_form', 'last_name', 'value').set("");
  tree.select('appointpal', 'client_form', 'last_name', 'error').set(false);
  tree.select('appointpal', 'client_form', 'mobile', 'value').set("");
  tree.select('appointpal', 'client_form', 'mobile', 'error').set(false);
  tree.select('appointpal', 'client_form', 'email', 'value').set("");
  tree.select('appointpal', 'client_form', 'email', 'error').set(false);
  tree.select('appointpal', 'client_form', 'dob', 'value').set("");
  tree.select('appointpal', 'client_form', 'dob', 'error').set(false);
  tree.select('appointpal', 'client_form', 'address', 'value').set("");
  tree.select('appointpal', 'client_form', 'address', 'error').set(false);
  tree.select('appointpal', 'client_form', 'city', 'value').set("");
  tree.select('appointpal', 'client_form', 'city', 'error').set(false);
  tree.select('appointpal', 'client_form', 'state', 'value').set("");
  tree.select('appointpal', 'client_form', 'state', 'error').set(false);
  tree.select('appointpal', 'client_form', 'zip', 'value').set("");
  tree.select('appointpal', 'client_form', 'zip', 'error').set(false);
  tree.select('appointpal', 'client_form', 'has_duplicate').set(null);
  tree.select('appointpal', 'client_form', 'guarantor_id').set(null);
  tree.select('appointpal', 'client_form', 'external_id').set(null);
  tree.select('appointpal', 'client_form', 'sync_in_progress').set(false);
  tree.commit();
}

export function handleClientInputChange(tree, field, value) {
  tree.select('appointpal', 'client_form', field, 'error').set(false);
  tree.select('appointpal', 'client_form', field, 'value').set(value);
  tree.commit();
}

export function handleClientPhoneInputChange(tree, value) {
  tree.select('appointpal', 'client_form', 'mobile', 'error').set(false);
  tree.select('appointpal', 'client_form', 'mobile', 'value').set(value);
}

let load_message_list = (tree, account_id, callback) => {
  let wrapped_callback = () => {
    if(callback) {
      callback();
     }
  }
  axios({
      method: 'get',
      url: `/api/message_threads/?account_id=${account_id}&page_size=100`
  }).then((response) => {
      if(response.data) {
          tree.select('messages').select('message_thread_list').set(response.data.results);
      }
      wrapped_callback();
  });
}

export function cancelCreateClient(tree) {
  clearManageClientForm(tree);
  tree.select('alert').set(null);
}

export function createClient(tree, guarantor_id) {
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    let valid = true;
    let first = tree.get('appointpal', 'client_form', 'first_name', 'value');
    if (!first) {
        tree.select('appointpal', 'client_form', 'first_name', 'error').set('Please enter a first name');
        valid = false;
    }
    let last = tree.get('appointpal', 'client_form', 'last_name', 'value');
    if (!last) {
        tree.select('appointpal', 'client_form', 'last_name', 'error').set('Please enter a last name');
        valid = false;
    }
    let mobile = tree.get('appointpal', 'client_form', 'mobile', 'value');
    let email = tree.get('appointpal', 'client_form', 'email', 'value');
    if(!mobile && !email) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter phone number or email');
        valid = false;
    }
    if (mobile && !isValidPhoneNumber(mobile)) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter a valid phone number');
        valid = false;
    }
    if (email && !validateEmail(email)) {
        tree.select('appointpal', 'client_form', 'email', 'error').set('Please enter a valid email');
        valid = false;
    }
    if (!valid) {
        return;
    }
    let dob = tree.get('appointpal', 'client_form', 'dob', 'value');
    let address = tree.get('appointpal', 'client_form', 'address', 'value');
    let city = tree.get('appointpal', 'client_form', 'city', 'value');
    let state = tree.get('appointpal', 'client_form', 'state', 'value');
    let zip = tree.get('appointpal', 'client_form', 'zip', 'value');
    axios({
        method: 'post',
        url: '/api/contacts/',
        data: {
          "account": selected_id,
          "first_name": first,
          "last_name": last,
          "email": email,
          "phone_number": mobile,
          "dob": dob ? dob : null,
          "street_address": address,
          "city": city,
          "state": state,
          "zip_code": zip,
          "guarantor": guarantor_id
        },
        headers: {"X-CSRFToken": Django.csrf_token()}
      })
      .then((response) => {
        clearManageClientForm(tree);
        closeManageClientPrompt(tree);
        tree.select('alert').set({
            body: "Success!",
            alert_type: 'success'
          });
        let select_available_active = () => { //resets active message to top of list and turns off reply box
          tree.select('messages').select('selected_filter').set('all');
          tree.select('messages').select('reply_content').set('');
          tree.select('messages').select('reply_active').set(false);
          //get item at top of the displayed list and make it active
          const top_item = tree.select('messages').get('displayed_message_threads')[0];
          if (top_item) {
            setActiveMessageThread(tree, top_item.uuid);
            tree.commit();
          }
        };
        load_message_list(tree, selected_id, select_available_active);
       })
      .catch((error) => {
        const duplicate = error.response && error.response.data && error.response.data.duplicate;
        if(duplicate) {
            tree.select('appointpal', 'client_form', 'guarantor_id').set(duplicate.subscriber_id);
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  duplicate.name + '<br><div class="subtitle">Create contact as a dependent of</div>&nbsp;' +  duplicate.name + '?',
                alert_type: 'warning',
                dependent_buttons: 'add'
            });
        } else {
            let body = 'Something went wrong!';
            if(error.response && error.response.data) {
              body = error.response.data.non_field_errors[0];
            }
            tree.select('alert').set({
              body: body,
              alert_type: 'error'
            });
        }
    });
    closeManageClientPrompt(tree);
}

function refreshFeeds(tree) {
    tree.select('feed', 'payments', 'items').set([]);
    tree.select('feed', 'reviews', 'items').set([]);
}

export function updateClient(tree, guarantor_id) {
    let callback = tree.get('appointpal', 'client_form', 'edit_callback');
    if(callback) {
        callback(tree, guarantor_id);
        return;
    }
    let contact_id = tree.get('appointpal', 'client_form', 'editing');
    if(!contact_id) {
        createClient(tree, guarantor_id);
        return
    }
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    let message_thread_id = tree.get('messages', 'active_message_thread');
    let valid = true;
    let mini_profile = tree.get('messages', 'mini_profile');
    let first = tree.get('appointpal', 'client_form', 'first_name', 'value');
    if (!first) {
        tree.select('appointpal', 'client_form', 'first_name', 'error').set('Please enter a first name');
        valid = false;
    }
    let last = tree.get('appointpal', 'client_form', 'last_name', 'value');
    if (!last) {
        tree.select('appointpal', 'client_form', 'last_name', 'error').set('Please enter a last name');
        valid = false;
    }
    let mobile = tree.get('appointpal', 'client_form', 'mobile', 'value');
    let email = tree.get('appointpal', 'client_form', 'email', 'value');
    if(!mobile && !email) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter phone number or email');
        valid = false;
    }
    if (mobile && mobile != mini_profile.phone && !isValidPhoneNumber(mobile)) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter a valid phone number');
        valid = false;
    }
    if (email && !validateEmail(email)) {
        tree.select('appointpal', 'client_form', 'email', 'error').set('Please enter a valid email');
        valid = false;
    }
    if (!valid) {
        return;
    }
    let dob = tree.get('appointpal', 'client_form', 'dob', 'value');
    let address = tree.get('appointpal', 'client_form', 'address', 'value');
    let city = tree.get('appointpal', 'client_form', 'city', 'value');
    let state = tree.get('appointpal', 'client_form', 'state', 'value');
    let zip = tree.get('appointpal', 'client_form', 'zip', 'value');
    let body = {
      first_name: first,
      last_name: last,
      phone_number: mobile ? mobile : null,
      email: email,
      dob: dob ? dob : null,
      street_address: address,
      city: city,
      state: state,
      zip_code: zip,
      guarantor: guarantor_id || mini_profile.guarantor_id
    };
    axios({
        method: 'put',
        url: '/api/contacts/' + contact_id + '/',
        data: body,
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        let select_available_active = () => {
          tree.select('messages').select('reply_content').set('');
          setActiveMessageThread(tree, message_thread_id);
          refreshMessageList(tree, message_thread_id);
          refreshMiniProfile(tree, message_thread_id);
          refreshFeeds(tree);
          tree.commit();
        };
        load_message_list(tree, selected_id, select_available_active);
        clearManageClientForm(tree);
        closeManageClientPrompt(tree);
        tree.select('alert').set({
            body: 'Success!',
            alert_type: 'success'
          });
      })
      .catch((error) => {
        const error_data = error.response && error.response.data;
        if(error_data && error_data.existing) {
            const duplicate = error_data.existing;
            tree.select('appointpal', 'client_form', 'has_duplicate').set(duplicate.subscriber_id);
            tree.select('appointpal', 'client_form', 'guarantor_id').set(duplicate.subscriber_id);
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  duplicate.name + '<br><div class="subtitle">Merge new contact with</div>&nbsp;' +  duplicate.name + '<div class="subtitle">, or make dependent?</div>',
                alert_type: 'warning',
                promotion_buttons: true
            });
        } else if (error_data && error_data.duplicate) {
            const duplicate = error_data.duplicate;
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  duplicate.name + '<br><div class="subtitle">Make contact a dependent of</div>&nbsp;' +  duplicate.name + '?',
                alert_type: 'warning',
                dependent_buttons: 'edit'
            });
        } else if (error_data && error_data.conflict) {
            const conflict = error_data.conflict;
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  conflict.name + '<br><div class="subtitle">Cannot make dependent, as this would leave orphans.</div>',
                alert_type: 'error'
            });
        } else {
          let body = 'Something went wrong!';
          if(error.response && error.response.data) {
              body = error.response.data[0];
          }
          tree.select('alert').set({
              body: body,
              alert_type: 'error'
          });
        }
     });
    closeManageClientPrompt(tree);
}

export function syncClient(tree) {
    tree.select('appointpal', 'client_form', 'sync_in_progress').set(true);
    let contact_id = tree.get('appointpal', 'client_form', 'editing');
    let message_thread_id = tree.get('messages', 'active_message_thread');
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    axios({
        method: 'get',
        url: '/integrations/sync-contact/' + contact_id + '/'
      })
      .then((response) => {
        let select_available_active = () => {
          tree.select('messages').select('reply_content').set('');
          setActiveMessageThread(tree, message_thread_id);
          refreshMessageList(tree, message_thread_id);
          refreshMiniProfile(tree, message_thread_id);
          refreshFeeds(tree);
          tree.commit();
        };
        load_message_list(tree, selected_id, select_available_active);
        clearManageClientForm(tree);
        closeManageClientPrompt(tree);
        tree.select('alert').set({
            body: 'Success!',
            alert_type: 'success'
          });
    })
    .catch((error) => {
      clearManageClientForm(tree);
      closeManageClientPrompt(tree);
      tree.select('alert').set({
          body: 'Sync failed',
          alert_type: 'error'
      });
    });
}

export function mergePending(tree) {
    let callback = tree.get('appointpal', 'client_form', 'merge_callback');
    if(callback) {
        callback(tree);
        return;
    }
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    let contact_id = tree.get('appointpal', 'client_form', 'editing');
    if(!contact_id) {
        tree.select('alert').set({
            body: 'No pending contact to merge.',
            alert_type: 'error'
        });
        return;
    }
    const existing_id = tree.get('appointpal', 'client_form', 'has_duplicate');
    if(!existing_id) {
        tree.select('alert').set({
            body: 'No existing contact to merge.',
            alert_type: 'error'
        });
        return;
    }
    axios({
      method: 'post',
      url: '/api/contacts/' + contact_id + '/merge-pending/',
      data: {
        'account_id': selected_id,
        'existing_id': existing_id
      },
      headers: {"X-CSRFToken": Django.csrf_token()}
    }).then((response) => {
      if(response.data.message_thread_id) {
        const message_thread_id = response.data.message_thread_id;
        let select_available_active = () => {
          tree.select('messages').select('reply_content').set('');
          setActiveMessageThread(tree, message_thread_id);
          refreshMessageList(tree, message_thread_id);
          refreshMiniProfile(tree, message_thread_id);
          refreshFeeds(tree);
          tree.commit();
        }
        load_message_list(tree, selected_id, select_available_active);
        tree.select('alert').set({
          body: 'Successfully merged contact',
          alert_type: 'success'
      });
    } else {
        tree.select('alert').set({
            body: 'Failed to merge contact',
            alert_type: 'error'
        })
    }
    clearManageClientForm(tree);
  }).catch((error) => {
    let body = 'Something went wrong!';
    if(error.response && error.response.data) {
        body = error.response.data[0];
    }
    tree.select('alert').set({
        body: body,
        alert_type: 'error'
    });
  });
}

export function makeDependent(tree) {
    const guarantor_id = tree.get('appointpal', 'client_form', 'guarantor_id');
    updateClient(tree, guarantor_id);
}

export function confirmDeleteClient(tree) {
    tree.select('confirmation').set('deleteClient');
}

export function deleteClient(tree) {
    const contact_id = tree.get('messages', 'mini_profile', 'subscriber_id');
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    axios({
        method: 'delete',
        url: '/api/contacts/' + contact_id + '/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        unsetActiveMessageThread(tree);
        let select_available_active = () => { //resets active message to top of list and turns off reply box
              tree.select('messages').select('reply_content').set('');
              //get item at top of the displayed list and make it active
              const top_item = tree.select('messages').get('displayed_message_threads')[0];
              if (top_item) {
                setActiveMessageThread(tree, top_item.uuid);
                tree.commit();
              }
            };
        load_message_list(tree, selected_id, select_available_active);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Patient Deleted',
            alert_type: 'success'
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export function toggleUploadClientsPrompt(tree) {
  let currentState = tree.get('upload_clients_prompt');
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'upload_clients_prompt').set(!currentState);
}

export function closeUploadClientsPrompt(tree) {
  tree.select('appointpal', 'upload_form', 'uploading').set(false);
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'upload_clients_prompt').set(false);
  resetClientList(tree);
}

export function clientTextareaChange(tree, payload) {
  tree.select('appointpal', 'upload_form', 'textarea_value').set(payload);
  tree.commit();
}

export function toggleDropzoneHover(tree, hover_state) {
  let timeout = tree.get('appointpal', 'upload_form', 'dropzone', 'hover_timeout');
  if (timeout) {
    window.clearTimeout(timeout);
  }

  let time_delay;
  (hover_state) ? time_delay = 0 : time_delay = 5000;

  timeout = window.setTimeout(() =>
    tree.select('appointpal', 'upload_form', 'dropzone', 'hover_state').set(hover_state)
  , time_delay);

  tree.select('upload_form', 'dropzone', 'hover_timeout').set(timeout);
  tree.commit();
}

export function handleDrop(tree, payload) {
    tree.select('appointpal', 'upload_form', 'dropzone', 'hover_state').set(false);
    tree.select('appointpal', 'upload_form', 'dropzone', 'loading_state').set(true);
    tree.commit();

    // TODO: make this work for multiple files???
    // For now we just take the first file.
    const file = payload[0];
    const formData = new FormData();
    formData.append(file.name, file);

    axios({
        method: 'post',
        url: '/contact-file-parse/',
        data: formData,
        headers: {
            'X-CSRFToken': Django.csrf_token(),
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
      tree.select('appointpal', 'upload_form', 'dropzone', 'loading_state').set(false);
        if(response.data) {
            const valid_rows = response.data.valid_rows;
            const invalid_rows = response.data.invalid_rows;
            if (valid_rows && valid_rows.length > 0) {
                tree.select('appointpal', 'upload_form', 'dropzone', 'loaded_state').set(true);
                valid_rows.forEach((arr) => {arr.join('')});
                tree.select('appointpal', 'upload_form', 'file_client_count').set(valid_rows.length);
                tree.select('appointpal', 'upload_form', 'invalid_count').set(invalid_rows);
                tree.select('appointpal', 'upload_form', 'client_list').set(valid_rows);
                tree.select('appointpal', 'upload_form', 'filename').set(response.data.filename);
            } else {
                tree.select('alert').set({
                    body: 'File contained no new patients to upload.  (Duplicates are ignored.)',
                    alert_type: 'error'
                });
                closeUploadClientsPrompt(tree);
            }
        }
    });
}

export function resetClientList(tree, payload) {
  tree.select('appointpal', 'upload_form', 'client_count').set(0);
  tree.select('appointpal', 'upload_form', 'filename').set("");
  tree.select('appointpal', 'upload_form', 'dropzone', 'loading_state').set(false);
  tree.select('appointpal', 'upload_form', 'dropzone', 'loaded_state').set(false);
  tree.select('appointpal', 'upload_form', 'textarea_value').set("");
}

export function setNotUploadedError(tree) {
  tree.select('alert').set({
    body: 'You haven\'t added any clients.' ,
    alert_type: 'error'
  });
}

export function handleUpload(tree) {
  tree.select('appointpal', 'upload_form', 'uploading').set(true);
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if(!selected_id) {
    selected_id = account_id;
  }
  const textarea_value = tree.get('appointpal', 'upload_form', 'textarea_value');
  const possible_contacts = textarea_value.split("\n");
  let validated_contacts = [];
  for(var contact of possible_contacts) {
      let validated_contact = validateContact(contact);
      if(validated_contact) {
          validated_contacts.push(validated_contact);
      }
  }
  let client_list = tree.get('appointpal', 'upload_form', 'client_list');
  client_list = client_list.concat(validated_contacts);
  tree.select('appointpal', 'upload_form', 'client_count').set(client_list.length);
  tree.select('appointpal', 'upload_form', 'client_list').set(client_list);
  let select_available_active = () => { //resets active message to top of list and turns off reply box
      tree.select('messages').select('reply_content').set('');
      //get item at top of the displayed list and make it active
      const top_item = tree.select('messages').get('displayed_message_threads')[0];
      if (top_item) {
        setActiveMessageThread(tree, top_item.uuid);
        tree.commit();
        refreshMiniProfile(tree, top_item.uuid);
      }
    };
  axios({
    method: 'post',
    url: '/api/contacts/bulk_add/',
    data: {
        'account_id': selected_id,
        'contact_list': client_list,
    },
    headers: {"X-CSRFToken": Django.csrf_token()}
  })
  .then((response) => {
    const upload_count = response.data.created + response.data.updated;
    const noun = upload_count == 1 ? "record" : "records";
    closeUploadClientsPrompt(tree);
    tree.select('alert').set({
      body: `You've successfully imported ${upload_count} ${noun}.`,
      alert_type: 'success'
    });
    tree.select('appointpal', 'upload_form', 'uploaded_count').set(client_list.length);
    load_message_list(tree, selected_id, select_available_active);
   })
   .catch((error) => {
      closeUploadClientsPrompt(tree);
      tree.select('alert').set({
      body: "Something went wrong!",
      alert_type: 'error'
    });
  });
}

export function syncAllContacts(tree) {
    tree.select('appointpal', 'sync_in_progress').set(true);
    const account_id = tree.get('account', 'account_id');
    const message_thread_id = tree.get('messages', 'active_message_thread');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    axios({
        method: 'get',
        url: '/integrations/full-sync/',
        params: {
            account_id: selected_id
        }
      })
      .then((response) => {
        let select_available_active = () => {
          tree.select('messages').select('reply_content').set('');
          setActiveMessageThread(tree, message_thread_id);
          refreshMessageList(tree, message_thread_id);
          refreshMiniProfile(tree, message_thread_id);
          refreshFeeds(tree);
          tree.commit();
        };
        load_message_list(tree, selected_id, select_available_active);
        tree.select('alert').set({
            body: "Successfully sync'd patients",
            alert_type: 'success'
          });
        tree.select('appointpal', 'sync_in_progress').set(false);
      })
      .catch((error) => {
        tree.select('alert').set({
          body: "Sync failed.",
          alert_type: 'error'
        });
        tree.select('appointpal', 'sync_in_progress').set(false);
      });
}