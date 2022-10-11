import {isValidEmailAddress} from '../common'
import tree from './state'
import axios from 'axios'
import qs from 'qs'

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

export function initialLoad(tree) {
  if (Django.rating) {
    // set selected smile 0 - 4
    tree.select('selected_smile').set(Django.rating - 1);
    if (Django.rating >= 4 && (Django.review_generators.length >= 1)) {
      tree.select('review_step').set(2);
    } else {
      tree.select('review_step').set(3);
    }
  }
  tree.select('loading_testimonials').set(false);
  tree.select('loading').set(false);
  tree.commit();
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
    if (smile_value >= 4 && (review_sources.length >= 1)) {
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
    tree.select('loading').set(false);
    tree.select('review_complete').set(true);
    tree.select('review_completed').set(true);
  }
}
