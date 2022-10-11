import {monkey} from 'baobab'
import moment from 'moment'
const onboarding = {
  set_password_url: null,
  onboarding_step: Django.onboarding_step,
  selected_industry: null,
  selected_plan: 'standard',
  billing_cycle: 'yearly',
  prices: {
    quarterly: 99,
    yearly: 79,
  },
  charges: {
    quarterly: 297,
    yearly: 948,
  },
  hovered_plan: null,
  account_info: {
    first_name: {
      value: Django.first_name,
      error: null,
    },
    last_name: {
      value: Django.last_name,
      error: null,
    },
    username: {
      value: Django.user_email,
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
    confirm_password: {
      value: "",
      error: null,
    },
    account_name: {
      value: Django.account_name,
      error: null,
    },
    phone_number: {
      value: Django.phone_number,
      error: null,
    },
    disable_fields: true,
    is_valid: false
  },
  email_invite_form: [
    {
      value: "",
      error: null,
    },
    {
      value: "",
      error: null,
    },
    {
      value: "",
      error: null,
    },
    {
      value: "",
      error: null,
    },
    {
      value: "",
      error: null,
    },
  ],
  card_form_ready: false,
}

export default onboarding;