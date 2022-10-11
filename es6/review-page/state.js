import Baobab from 'baobab';

const tree = new Baobab({
  loading: true,
  loading_testimonials: true,
  review_step: 1,
  selected_smile: false,
  hovered_smile: false,
  review_complete: false,
  review_completed: false,
  review_content: "",
  review_name: "",
  review_email: "",
  additional_feedback_uuid: Django.additional_feedback_uuid,
  account_id: Django.account_id,
  account_name: Django.company_name,
  account_url: Django.company_url,
  account_logo: Django.company_logo,
  account_rating: Django.company_rating,
  active_date: Django.active_date,
  review_ct: Django.review_ct,
  location: Django.location,
  abbrev_location: Django.abbrev_location,
  full_location: Django.full_location,
  vertical: Django.vertical,
  errors: {
    content: false,
    name: false,
    email: false,
  },
  review_sources: Django.review_generators,
  profile_id: Django.profile_id,
  review_invite_id: Django.review_invite_id,
});

export default tree;