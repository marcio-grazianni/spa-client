import {monkey} from 'baobab'

const update = {
  accounts: [],
  select_account_options: monkey({
    cursors: {
      accounts: ['update', 'accounts'],
    },
    get: (state) => {
      return state.accounts.map((account) => {
        return [account.id, account.name];
      });
    },
  }),
  update_form: {
    vertical_options: Django.vertical_options,
    onboarding_step_options: [
      [0, 'Intro'],
      [1, 'Industry Selection'],
      [2, 'Account Info'],
      [3, 'Payment'],
      [5, 'Welcome Screen'],
      [6, 'Tutorial'],
      [7, 'Onboarding Complete'],
    ],
    payment_options: [
      [0, 'Unpaid'],
      [1, 'Paid plan'],
      [2, 'Lite plan'],
    ],
    review_source_slugs: Django.review_source_slugs,
    select_account: {
      value: "",
      error: false,
    },
    name: {
      value: "",
      error: false,
    },
    slug: {
      slug: "",
      error: false,
    },
    vertical: {
      value: 1,
      error: false,
    },
    url: {
      value: "",
      error: false,
    },
    payment: {
      value: 0,
      error: false,
    },
    sub_accounts: [],
    // logo: {
    //   value: "",
    //   error: false,
    //   preview: false,
    //   format: false,
    // },
    // location_name: {
    //   value: "",
    //   error: false,
    // },
    // location_address: {
    //   value: "",
    //   error: false,
    // },
    // username: {
    //   value: "",
    //   error: false,
    // },
    // first_name: {
    //   value: "",
    //   error: false,
    // },
    // last_name: {
    //   value: "",
    //   error: false,
    // },
    // phone: {
    //   value: "",
    //   error: false,
    // },
    // onboarding_step: {
    //   value: 5,
    //   error: false,
    // },
    
  },
};

export default update;