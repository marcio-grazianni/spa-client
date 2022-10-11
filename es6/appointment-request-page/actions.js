import tree from './state'
import axios from 'axios'
import qs from 'qs'
import { isValidPhoneNumber } from 'react-phone-number-input'

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

export function submitNewPatient(tree, is_new) {
    tree.select('booking', 'is_new_patient').set(!!is_new);
    tree.select('booking', 'booking_step').set(2);
}

let checkAppointmentInfo = (name, email, phone, appointment_type) => {
  let errors = false;
  if (name === '') {
    errors = true;
    tree.select('booking', 'appointment_info', 'name', 'error').set('Name is required');
  }
  if ((email === '') || !(isValidEmailAddress(email))) {
    errors = true;
    tree.select('booking', 'appointment_info', 'email', 'error').set('Valid email is required');
  }
  if (!phone || !isValidPhoneNumber(phone)) {
    errors = true;
    tree.select('booking', 'appointment_info', 'phone_number', 'error').set('Phone number is required');
  }
  if (appointment_type === '') {
    errors = true;
    tree.select('booking', 'appointment_info', 'appointment_type', 'error').set('Please select a value');
  }
  return !(errors);
}

export function changePatientName(tree, name) {
  tree.select('booking', 'appointment_info', 'name', 'value').set(name);
  tree.commit();
  if (tree.get('booking', 'appointment_info', 'name', 'error')) {
    if (name) {
      tree.select('booking', 'appointment_info', 'name', 'error').set(false);
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

export function changeAppointmentType(tree, appointment_type) {
  tree.select('booking', 'appointment_info', 'appointment_type', 'value').set(appointment_type);
  tree.commit();
}

export function appointmentInfoSubmit(tree) {
  const is_new_patient = tree.get('booking', 'is_new_patient');
  const name = tree.get('booking', 'appointment_info', 'name', 'value');
  const email = tree.get('booking', 'appointment_info', 'email', 'value');
  const phone_number = tree.get('booking', 'appointment_info', 'phone_number', 'value');
  const appointment_type = tree.get('booking', 'appointment_info', 'appointment_type', 'value');
  const account_id = tree.get('account_id');
  if (checkAppointmentInfo(name, email, phone_number, appointment_type)) {
    tree.select('sending').set(true);
    tree.commit();
    axios.post(`/appointments/submit-request/`, qs.stringify({
        csrfmiddlewaretoken: Django.csrf_token,
        account_id: account_id,
        is_new_patient: is_new_patient,
        patient_name: name,
        patient_email: email,
        patient_phone: phone_number,
        appointment_type: appointment_type
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
    tree.select('booking', 'appointment_info', 'last_name', 'value').set('');
    tree.select('booking', 'appointment_info', 'first_name', 'value').set('');
    tree.select('booking', 'appointment_info', 'phone_number', 'value').set('');
    tree.select('booking', 'appointment_info', 'email', 'value').set('');
    tree.select('booking', 'booking_step').set(2);
}

export function initialLoad(tree) {
  tree.select('loading').set(false);
  tree.commit();
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

export function confirmAppointment(tree) {
    tree.select('appointment', 'action_pending').set(true);
    alert('Confirmed!');
    tree.select('appointment', 'action_completed').set(true);
    tree.select('appointment', 'action_pending').set(false);
}
