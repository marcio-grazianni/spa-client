const uploadCSV = {
  accounts: [],
  review_source_slugs: Django.review_source_slugs,
  vertical_options: Django.vertical_options,
  owner: {
    value: Django.owner_options[0][0],
    error: false,
  },
  owner_options: Django.owner_options,
  success_prompts: [],
  error_prompts: [],
};

export default uploadCSV;