import axios from 'axios'

export function initialLoad(tree) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
    method: 'get',
    url: '/appointments/widget-code/?account_id=' + selected_id,
  })
  .then((response) => {
    tree.select('widget', 'widget_code').set(response.data);
  });
}

export function toggleExpandedSection(tree, section) {
  const currentState = tree.select('widget', 'expanded', section).get();
  tree.select('widget', 'expanded', section).set(!currentState);
}

export function copyCode(tree) {
  const code = tree.select('widget', 'widget_code').get();
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
      tree.select('widget', 'copied').set(true);
      tree.select('alert').set({
        body: 'Widget code has been successfully copied to clipboard!',
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

export function configureScheduler() {
    nylas.scheduler.show({
    auth: {
      // Account access_token with active calendar scope
      accessToken: "dF8JZ86VhNHnZKC20WGfbLLYInHxSb",
    },
    style: {
      // Style the schdule editor
      tintColor: '#32325d',
      backgroundColor: 'white',
    },
    defaults: {
      event: {
        title: '30-min Coffee Meeting',
        duration: 30,
      },
    },
  });
}
