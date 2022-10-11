import Baobab from 'baobab';

const tree = new Baobab({
  loading: true,
  loading_testimonials: true,
  review: false,
  review_step: 1,
  selected_smile: false,
  hovered_smile: false,
  question_two_answer: null,
  review_complete: false,
  review_completed: false,
  review_content: "",
  review_name: "",
  review_email: "",
  additional_feedback_uuid: Django.additional_feedback_uuid,
  testimonial_list: Django.testimonials || [],
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
  appointment: {
      action: Django.appointment_action,
      action_pending: false,
      action_completed: Django.appointment_action_completed
  },
  booking: {
      booking_step: Django.booking_step || 0,
      sending: false,
      is_new_patient: false,
      appointment_info: {
          name: {
              value: "",
              error: false
          },
          phone_number: {
              value: "",
              error: false
          },
          email: {
              value: "",
              error: false
          },
          appointment_type: {
              value: "",
              error: false
          }
      }
    }
});

export default tree;