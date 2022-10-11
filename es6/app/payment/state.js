import {monkey} from 'baobab'
import moment from 'moment'
const payment = {
  payment_step: 0,
  selected_industry: null,
  selected_plan: 'standard',
  billing_cycle: 'monthly',
  hovered_plan: null,
  selected_card: 'saved',
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

export default payment;