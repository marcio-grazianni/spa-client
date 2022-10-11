import tree from './state'
import axios from 'axios'
import qs from 'qs'

// TODO: create app-wide functions file for check functions such as this
let isValidEmailAddress = (email)  => {
  const pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  return pattern.test(email)
}

let checkForm = (content, name, email) => {
  let errors = false;
  if (content === '') {
    errors = true;
    tree.select('errors', 'content').set(true);
  }
  if (name === '') {
    errors = true;
    tree.select('errors', 'name').set(true);
  }
  if ((email === '') || !(isValidEmailAddress(email))) {
    errors = true;
    tree.select('errors', 'email').set(true);
  }
  return !(errors)
}

let checkAppointmentInfo = (last, first, email, phone) => {
  let errors = false;
  if (last === '') {
    errors = true;
    tree.select('booking', 'appointment_info', 'last_name', 'error').set('Last name is required');
  }
  if (first === '') {
    errors = true;
    tree.select('booking', 'appointment_info', 'first_name', 'error').set('First name is required');
  }
  if ((email === '') || !(isValidEmailAddress(email))) {
    errors = true;
    tree.select('booking', 'appointment_info', 'email', 'error').set('Valid email is required');
  }
  if (phone === '') {
    errors = true;
    tree.select('booking', 'appointment_info', 'phone_number', 'error').set('Phone number is required');
  }
  return !(errors);
}

export function initialLoad(tree) {
  // tree.select('loading_testimonials').set(true);
  // tree.select('loading').set(true);
  // tree.commit();
  // if we are going straight to review
  if (Django.review_active) {
    tree.select('review').set(true);
  }
  if (Django.rating) {
    // set selected smile 0 - 4
    tree.select('selected_smile').set(Django.rating - 1);
    if (Django.rating >= 4 && Django.review_active && (Django.review_generators.length >= 1)) {
      tree.select('review_step').set(2);
    } else {
      tree.select('review_step').set(3);
    }
  }
  tree.select('loading_testimonials').set(false);
  tree.select('loading').set(false);
  tree.commit();
  // const account_id = tree.get('account_id');
  // let req = request.post('/seal/get-testimonials/')
  //   .send(`account_id=${account_id}`)
  // .end(function(err, res) {
  //   if (!(err) && !(res.error) && (res.body)) {
  //     tree.select('testimonial_list').set(res.body);
  //     tree.select('loading_testimonials').set(false);
  //     tree.select('loading').set(false);
  //   }
  // });
  // let review_source_req = request.post('/seal/get-review-sources/')
  //   .send(`account_id=${account_id}`)
  // .end(function(err, res) {
  //   if (!(err) && !(res.error) && (res.body)) {
  //     tree.select('review_sources').set(res.body.review_feeds);
  //   }
  // });
}

export function toggleReview(tree) {
  tree.select('review').set(true);
}

export function setHoverState(tree, smile, hover_state) {
  if (hover_state) {
    // hovered smile is 1 + the index
    tree.select('hovered_smile').set(smile)
  } else {
    tree.select('hovered_smile').set(false)
  }
}

export function selectSmile(tree, smile) {
  tree.select('loading').set(true);
  tree.commit();
  // smile value = smile index + 1
  const smile_value = smile + 1;
  const account_id = tree.get('account_id');
  const review = Django.review_active;
  const review_sources = tree.get('review_sources');
  const profile_invite_id = tree.get('profile_id');
  const review_invite_id = tree.get('review_invite_id');
  tree.select('selected_smile').set(smile);
  tree.select('hovered_smile').set(false);
  const csrf = Django.csrf_token;
  axios.post('/feedback/give-feedback-new/', qs.stringify({
    csrfmiddlewaretoken: Django.csrf_token,
    review: smile_value,
    account_id: account_id,
    profile_invite_id,
    review_invite_id,
  }))
  .then((response) => {
    tree.select('additional_feedback_uuid').set(response.data.uuid);
    tree.select('loading').set(false);
    if (smile_value >= 4 && review && (review_sources.length >= 1)) {
      tree.select('review_step').set(2);
    } else {
      tree.select('review_step').set(3);
    }
  })
  .catch((error) => {
    debugger
  })
}

export function toggleStepThree(tree) {
  tree.select('review_step').set(3);
}

export function changeContent(tree, content) {
  tree.select('review_content').set(content);
  tree.commit();
  tree.select('errors', 'content').set(false)
}

export function changeName(tree, name) {
  tree.select('review_name').set(name);
  tree.commit();
  tree.select('errors', 'name').set(false)
}

export function changeEmail(tree, email) {
  tree.select('review_email').set(email);
  tree.commit();
  if (tree.get('errors', 'email')) {
    if (isValidEmailAddress(email)) {
      tree.select('errors', 'email').set(false)
    }
  }
}

export function submit(tree) {
  const smile_value = tree.get('selected_smile') + 1;
  const comments = tree.get('review_content');
  const name = tree.get('review_name');
  const email = tree.get('review_email');
  const testimonial = ((smile_value >= 4) && (comments.length >= 75));
  const uuid = tree.get('additional_feedback_uuid');
  const profile_invite_id = tree.get('profile_id');
  const review_invite_id = tree.get('review_invite_id');
  if (checkForm(comments, name, email)) {
    tree.select('loading').set(true);
    tree.commit();
    axios.post(`/feedback/additional-feedback/${uuid}/`, qs.stringify({
      csrfmiddlewaretoken: Django.csrf_token,
      testimonial,
      comments,
      name,
      email,
      profile_invite_id,
      review_invite_id,
    }))
    // .then((response) => {
    //   debugger
    // })
    // .catch((error) => {
    //   debugger
    // })

    // let req = request.post(`/feedback/additional-feedback/${uuid}/`)
    //   .send(`testimonial=${testimonial}`)
    //   .send(`comments=${content}`)
    //   .send(`name=${name}`)
    //   .send(`email=${email}`)
    // .end(function(err, res) {
    //   // TODO: write error handler
    //   if ((err) || (res.error)) {
    //     debugger
    //   }
    // });
    tree.select('loading').set(false);
    tree.select('review').set(false);
    tree.select('review_complete').set(true);
    tree.select('review_completed').set(true);
  }
}

export function closeReviewComplete(tree) {
  tree.select('review_complete').set(false);
  // Not sure if should reset review... do we want people to leave multiple?
  tree.select('review_step').set(1);
  tree.select('review_content').set('');
  tree.select('review_name').set('');
  tree.select('review_email').set('');
}

export function closeAlert(tree, alpha) {
  if (alpha) {
    tree.select('alpha_alert').set(false);
  }
  tree.select('alert').set(false);
}

/* Book Appointment Form */

export function closeBooking(tree) {
    tree.select('booking', 'booking_step').set(0);
}

export function bookAppointment(tree) {
    tree.select('booking', 'booking_step').set(1);
}

export function submitNewPatient(tree, is_new) {
    tree.select('booking', 'is_new_patient').set(!!is_new);
    tree.select('booking', 'booking_step').set(2);
}

export function changeLastName(tree, name) {
  tree.select('booking', 'appointment_info', 'last_name', 'value').set(name);
  tree.commit();
  if (tree.get('booking', 'appointment_info', 'last_name', 'error')) {
    if (name) {
      tree.select('booking', 'appointment_info', 'last_name', 'error').set(false);
    }
  }
}

export function changeFirstName(tree, name) {
  tree.select('booking', 'appointment_info', 'first_name', 'value').set(name);
  tree.commit();
  if (tree.get('booking', 'appointment_info', 'first_name', 'error')) {
    if (name) {
      tree.select('booking', 'appointment_info', 'first_name', 'error').set(false);
    }
  }
}

export function changePatientEmail(tree, email) {
  tree.select('booking', 'appointment_info', 'email', 'value').set(email);
  tree.commit();
  if (tree.get('booking', 'appointment_info', 'email', 'error')) {
    if (isValidEmailAddress(email)) {
      tree.select('booking', 'appointment_info', 'email', 'error').set(false);
    }
  }
}

export function changePhoneNumber(tree, phone_number) {
  tree.select('booking', 'appointment_info', 'phone_number', 'value').set(phone_number);
  tree.commit();
  if (tree.get('booking', 'appointment_info', 'phone_number', 'error')) {
    if (phone_number) {
      tree.select('booking', 'appointment_info', 'phone_number', 'error').set(false);
    }
  }
}

export function changeTimeOfDay(tree, time_of_day) {
  tree.select('booking', 'appointment_info', 'time_of_day', 'value').set(time_of_day);
  tree.commit();
}

export function appointmentInfoSubmit(tree) {
  const is_new_patient = tree.get('booking', 'is_new_patient');
  const last_name = tree.get('booking', 'appointment_info', 'last_name', 'value');
  const first_name = tree.get('booking', 'appointment_info', 'first_name', 'value');
  const email = tree.get('booking', 'appointment_info', 'email', 'value');
  const phone_number = tree.get('booking', 'appointment_info', 'phone_number', 'value');
  const time_of_day = tree.get('booking', 'appointment_info', 'time_of_day', 'value');
  const account_id = tree.get('account_id');
  if (checkAppointmentInfo(last_name, first_name, email, phone_number)) {
    tree.select('sending').set(true);
    tree.commit();
    axios.post(`/book_appointment/`, qs.stringify({
        csrfmiddlewaretoken: Django.csrf_token,
        account_id: account_id,
        is_new_patient: is_new_patient,
        last_name: last_name,
        first_name: first_name,
        email: email,
        phone_number: phone_number,
        time_of_day: time_of_day
    }))
    .then((response) => {
      tree.select('sending').set(false);
      tree.select('booking', 'booking_step').set(3);
    })
    .catch((error) => {
      debugger
    })
  }
}

export function dismissAppointmentConfirmation(tree) {
    tree.select('booking', 'booking_step').set(0);
}
