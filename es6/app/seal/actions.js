import axios from 'axios'

export function initialLoad(tree) {
  axios({
    method: 'get',
    url: '/seal/get-seal/'
  }).then((response) => {
    if(response.data) {
      tree.select('seal').select('message_seal').set(response.data);
    }
  }).catch((error) => {
    console.log(error);
  });
}

export function toggleExpandedSection(tree, section) {
  const currentState = tree.select('seal', 'expanded', section).get();
  tree.select('seal', 'expanded', section).set(!currentState);
}

export function changeEditForm(tree, option, payload) {
  tree.select('seal', 'message_seal', option).set(payload);
}

export function saveSeal(tree) {
  const id = tree.select('seal', 'message_seal').get('id');
  const format = tree.select('seal', 'message_seal').get('format');
  const icon = tree.select('seal', 'message_seal').get('icon');
  const border = tree.select('seal', 'message_seal').get('border');
  const call_to_action = tree.select('seal', 'message_seal').get('call_to_action');
  axios({
    method: 'post',
    url: '/seal/save-seal/',
    headers: {"X-CSRFToken": Django.csrf_token()},
    data: {
      'id': id,
      'format': format,
      'icon': icon,
      'border': border,
      'call_to_action': call_to_action
    }
  }).then((response) => {
    tree.select('confirmation').set(false);
    tree.select('alert').set({
      body: 'Changes to seal have been saved successfully! Make sure you add the new code to your email template.',
      alert_type: 'success'
    });
  }).catch((error) => {
    console.log(error);
  });
}

export function copyCode(tree) {
  const code = tree.select('seal').get('seal_code');
  let copyElement;
  let successful;
  try {
    copyElement = document.createElement('input');
    copyElement.setAttribute('type', 'text');
    copyElement.setAttribute('value', code);
    copyElement = document.body.appendChild(copyElement);
    copyElement.select();
    successful = document.execCommand('copy');
    document.body.removeChild(copyElement);
    if (successful) {
      tree.select('seal', 'copied').set(true);
      tree.select('alert').set({
        body: 'Seal code has been successfully copied to clipboard!',
        alert_type: 'success'
      });

      // TODO: write alerts for success and failure here.
    } else {
      tree.select('alert').set({
        body: 'Copying to clipboard not supported by your browser. Please select all code within the textarea and press CTRL+C',
        alert_type: 'error'
      });
    }
  } catch (err) {
    tree.select('alert').set({
      body: 'Copying to clipboard not supported by your browser. Please select all code within the textarea and press CTRL+C',
      alert_type: 'error'
    });
  }
}
