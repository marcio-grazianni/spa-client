import tree from './state'
import axios from 'axios'
import qs from 'qs'
import Papa from 'papaparse'

let validateRequired = (cursorArray) => {
  /* Checks if all required cursors are set and
  sets an error if any required
  items have been left blank */
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      cursor.select('error').set('This field is required.');
      error = true;
    }
  });
  return !error
}

let validateEmail = (cursorArray) => {
  let validate = (value) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);

  // Checks for valid Email and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid Email.');
      error = true;
    }
  });
  return !error
}

let validateURL = (cursorArray) => {
  let validate = (value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);

  // Checks for valid URL and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid URL.');
      error = true;
    }
  });
  return !error
}

let validatePhone = (cursorArray) => {
  let validate = (value) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);

  // Checks for valid phone number and sets error if not
  let error = false;
  cursorArray.forEach((cursor) => {
    if (cursor.get('value') === '') {
      // if we have no value then don't set error
      return false
    }
    if (!validate(cursor.get('value'))) {
      cursor.select('error').set('Please enter a valid phone number.');
      error = true;
    }
  });
  return !error
}

export function initialLoad(tree) {
  
}

export function changeOwner(tree, value) {
  tree.select('uploadCSV', 'owner', 'value').set(value);
  tree.commit()
}

function convertToSlug(text) {
  return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

// parses the csv should output how many accounts will be uploaded

// TODO: if required fields not given - tell which row/account

function formatAccounts(tree, accounts_raw) {
  const review_source_slugs = tree.get('uploadCSV', 'review_source_slugs');
  const vertical_options = tree.get('uploadCSV', 'vertical_options');
  let accounts_formatted = [];
  accounts_raw.forEach((row, index) => {
    let formatted_row = {};

    // account name setup
    if (row['account_name']) {
      formatted_row['name'] = row['account_name'];
    } else if (row['parent_name'] && row['location_name']){
      // if account_name was ommitted use parent name and location name
      formatted_row['name'] = `${row['parent_name']} ${row['location_name']}`;
    } else {
      // throw error if no account name need to supply a parent and location name
    }

    // review feed setup
    formatted_row['review_feeds'] = [];
    review_source_slugs.forEach((slug) => {
      if (row[slug]) {
        formatted_row['review_feeds'].push({
          source: slug,
          url: row[slug],
        });
      }
    });

    //review generator setup
    formatted_row['review_generators'] = [];
    review_source_slugs.forEach((slug) => {
      if (row[`generate_${slug}`]) {
        formatted_row['review_generators'].push({
          source: slug,
          url: row[`generate_${slug}`],
        });
      }
    });

    // does the account have a parent
    let has_parent = false;
    let parent_row_index;
    if (row['parent_name'] && row['parent_name'] !== 'NONE') {
      accounts_formatted.forEach((possible_parent_row, index) => {
        if (possible_parent_row['name'] === row['parent_name']) {
          parent_row_index = index;
          has_parent = true;
        }
      });
      // TODO: if parent wasnt found then throw some sort of warning for misspelling 
    }

    // primary contact setup
    formatted_row['primary_contact'] = {};
    formatted_row['primary_contact']['first_name'] = row['first_name'];
    formatted_row['primary_contact']['last_name'] = row['last_name'];

    if (row['requested_demo'] === 'yes') {
      formatted_row['requested_demo'] = true;
    } else {
      formatted_row['requested_demo'] = false;
    }

    if (row['opt_out_of_sequence'] === 'yes') {
      formatted_row['opt_out_of_sequence'] = true;
    } else {
      formatted_row['opt_out_of_sequence'] = false;
    }

    // sub account setup
    formatted_row['sub_accounts'] = [];

    //team members setup
    formatted_row['team_members'] = [];
    let more_team = true;
    let team_index = 1;
    while (more_team) {
      if (row[`team_${team_index}_username`]) {
        formatted_row['team_members'].push({
          'username': row[`team_${team_index}_username`],
          'email': row[`team_${team_index}_username`],
          'first_name': row[`team_${team_index}_first_name`],
          'last_name': row[`team_${team_index}_last_name`]
        });
        team_index += 1;
      } else {
        more_team = false;
      }
    }

    if (has_parent) {
      let parent_row = accounts_formatted[parent_row_index];
      let sub_account_index = parent_row['sub_accounts'].length + 1;

      // get parent slug
      let parent_slug;
      if (parent_row['slug']) {
        parent_slug = parent_row['slug'];
      } else {
        parent_slug = convertToSlug(row['parent_name']);
      }

      // if slug explicit
      if (row['slug']) {
        formatted_row['slug'] = row['slug'];
      } else if (row['account_name']){
        formatted_row['slug'] = convertToSlug(row['account_name'])
      } else { // else we use the parent slug with an index
        formatted_row['slug'] = `${parent_slug}-${sub_account_index}`;
      }

      // inherit parent url if not set
      if (row['url']) {
        formatted_row['url'] = row['url'];
      } else {
        formatted_row['url'] = parent_row['url'];
      }

      // vertical should always match parent
      formatted_row['vertical'] = parent_row['vertical'];

      // username setup
      if (row['username']) {
        formatted_row['primary_contact']['username'] = row['username'];
        formatted_row['primary_contact']['email'] = row['username'];
      } else { // default username/email to (parent name slug)-1@sv.com if not provided explicitly
        let username_slug = `${parent_slug}-${sub_account_index}`;
        formatted_row['primary_contact']['username'] = `${username_slug}@subscribervoice.com`;
        formatted_row['primary_contact']['email'] = `${username_slug}@subscribervoice.com`;
      }
      if (row['location_name'] && row['location_address']) {
        formatted_row['location'] = {
          name: row['location_name'],
          stated_address: row['location_address'],
        };
      } else { // if no location set to null and we will inherit parent location in backend
        formatted_row['location'] = null;
      }
      formatted_row['default_child'] = row['default_child'];
      if (row['market']) {
          formatted_row['market'] = parseInt(row['market']);
      } else {
          formatted_row['market'] = parent_row['market'];
      }
      accounts_formatted[parent_row_index]['sub_accounts'].push(formatted_row);
    } else {
      // slug is optional
      if (row['slug']) {
        formatted_row['slug'] = row['slug'];
      } else {
        formatted_row['slug'] = null;
      }
      // url
      formatted_row['url'] = row['url'];

      // vertical setup
      // default to healthcare.. or id 1
      formatted_row['vertical'] = 1;
      vertical_options.some((vertical_option) => {
        if (vertical_option[2] === 'healthcare') {
          formatted_row['vertical'] = vertical_option[0];
          return true;
        }
      });
      if (row['vertical']) { // if vertical is set
        vertical_options.some((vertical_option) => {
          if (vertical_option[1] === row['vertical'] || vertical_option[2] === row['vertical']) {
            formatted_row['vertical'] = vertical_option[0];
            return true;
          }
        });
      }

      // default username email
      if (row['username']) {
        formatted_row['primary_contact']['username'] = row['username'];
        formatted_row['primary_contact']['email'] = row['username'];
      } else {
        let account_slug = convertToSlug(row['account_name']);
        formatted_row['primary_contact']['username'] = `${account_slug}@subscribervoice.com`;
        formatted_row['primary_contact']['email'] = `${account_slug}@subscribervoice.com`;
      }

      // location setup
      if (row['location_name'] && row['location_address']) {
        formatted_row['location'] = {
          name: row['location_name'],
          stated_address: row['location_address'], 
        };
      } else { // if no location set use a default..
        formatted_row['location'] = {
          name: formatted_row['name'],
          stated_address: "United States", 
        };
      }
      if (row['market']) {
        formatted_row['market'] = parseInt(row['market']);
      } else {
        formatted_row['market'] = null;
      }
      accounts_formatted.push(formatted_row);
    }
  });
  return accounts_formatted;
}

export function uploadCSV(tree, files) {
  // we only accept the first file
  let accounts;
  const file = files[0];
  Papa.parse(file, {
    header: true,
    complete: function(results) {
      accounts = formatAccounts(tree, results.data);
      tree.select('uploadCSV', 'accounts').set(accounts);
    }
  });
}

export function handleSubmit(tree) {
  // just do row 2 for now
  const accounts = tree.get('uploadCSV', 'accounts');
  const owner_id = tree.get('uploadCSV', 'owner', 'value');
  accounts.forEach((row) => {
    let data = {
      "account": {
        "name": row['name'],
        "slug": row['slug'], // null for now
        "location": row['location'],
        "market": row['market'],
        "description": "", // no description for now
        "paid": true,
        "lite": false, // false for now
        "url": row['url'],
        "logo": null,
        "vertical": row['vertical'],
        "sub_accounts": row['sub_accounts'],
        "review_feeds": row['review_feeds'],
        "review_generators": row['review_generators'],
        "team_members": row['team_members'],
      },
      "admin": false, // false for now
      "phone": null, // null for now
      "onboarding_step": 1, // 1 for now
      "requested_demo": row['requested_demo'],
      "opt_out_of_sequence": row['opt_out_of_sequence'],
      "user": row['primary_contact'],
      "hubspot_owner": owner_id
    }
    axios({
      method: 'post',
      url: '/api/users/',
      data: data,
      headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
      if (response.data.profile_id) {
        tree.select('uploadCSV', 'success_prompts').push(`Account created for ${row['name']}. ${row['sub_accounts'].length} sub accounts created.`)
      } else {
        tree.select('uploadCSV', 'error_prompts').push(`Error creating account for ${row['name']} and it's ${row['sub_accounts'].length} sub accounts.`)
      }
    })
    .catch((error) => {
      tree.select('uploadCSV', 'error_prompts').push(`Error creating account for ${row['name']} and it's ${row['sub_accounts'].length} sub accounts.`)
      
    })
  });
}