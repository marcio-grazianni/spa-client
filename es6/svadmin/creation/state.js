const creation = {
  create_form: {
    vertical_options: Django.vertical_options,
    owner_options: Django.owner_options,
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
    name: {
      value: "SVADMINACCOUNTTEST",
      error: false,
    },
    slug: {
      value: "",
      error: false,
    },
    vertical: {
      value: 1,
      error: false,
    },
    url: {
      value: "http://www.subscribervoice.com/",
      error: false,
    },
    payment: {
      value: 0,
      error: false,
    },
    logo: {
      value: "",
      error: false,
      preview: false,
      format: false,
    },
    location_name: {
      value: "TESTLOCATION",
      error: false,
    },
    location_address: {
      value: "1230 E F St # A, Oakdale, CA 95361",
      error: false,
    },
    username: {
      value: "pear@subscribervoice.com",
      error: false,
    },
    first_name: {
      value: "TEST",
      error: false,
    },
    last_name: {
      value: "NAME",
      error: false,
    },
    phone: {
      value: "5087174792",
      error: false,
    },
    onboarding_step: {
      value: 5,
      error: false,
    },
    hubspot_contact: {
      value: true,
      error: false,
    },
    owner: {
      value: Django.owner_options[0][0],
      error: false,
    },
    sub_accounts: [],
  },
};

export default creation;