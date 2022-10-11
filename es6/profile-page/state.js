import Baobab from 'baobab';

let state = {};
if(typeof Django != 'undefined') {
    state = {
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
      testimonial_count: Django.testimonial_count,
      testimonial_rating: Django.testimonial_rating,
      account_id: Django.account_id,
      account_name: Django.company_name,
      parent_name: Django.parent_name,
      account_url: Django.company_url,
      account_logo: Django.company_logo,
      account_rating: Django.company_rating,
      active_date: Django.active_date,
      review_ct: Django.review_ct,
      location: Django.location,
      abbrev_location: Django.abbrev_location,
      full_location: Django.full_location,
      vertical: Django.vertical,
      contact_phone_number: Django.contact_phone_number && ' at ' + Django.contact_phone_number,
      media_url: Django.media_url,
      blue_star_url: Django.static_url + 'images/testimonial-rating-a.svg',
      grey_star_url: Django.static_url + 'images/testimonial-rating-b.svg',
      sv_logo: Django.static_url + 'images/appointpal/banner-logo.svg',
      errors: {
        content: false,
        name: false,
        email: false
      },
      review_sources: Django.review_generators,
      profile_id: Django.profile_id,
      review_invite_id: Django.review_invite_id,
      booking: {
          booking_step: Django.booking_step || 0,
          sending: false,
          is_new_patient: false,
          appointment_info: {
              first_name: {
                  value: "",
                  error: false
              },
              last_name: {
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
              time_of_day: {
                  value: 2,
                  error: false
              }
          }
      },
      locations: {
          markers: [{
              id: Django.account_id,
              location_info: {
                  name: Django.location_name || null,
                  address: Django.location_address || null
              },
              position: {
                  lat: Django.location_latitude || null,
                  lng: Django.location_longitude || null
              }
          }]
      }
    };
}

const tree = new Baobab(state);

export default tree;
