import Baobab from 'baobab'
import activity from './activity/state.js'
import appointpal from './appointpal/state.js'
import dashboard from './dashboard/state.js'
import feed from './feed/state.js'
import testimonials from './testimonials/state.js'
import messages from './messaging/state.js'
import seal from './seal/state.js'
import reports from './reports/state.js'
import locations from './locations/state.js'
import leaderboard from './leaderboard/state.js'
import settings from './settings/state.js'
import team from './team/state.js'
import onboarding from './onboarding/state.js'
import payment from './payment/state.js'
import widget from './widget/state.js'

// TODO: create alternative to using Djangojs - don't want the jquery dependancy
const tree = new Baobab({
  loading: true,
  navigating: false,
  user: {
    profile_id: Django.profile_id,
    username: Django.user_email,
    first_name: Django.first_name,
    last_name: Django.last_name,
    phone_number: Django.phone_number,
    needs_password: Django.prompt_for_password,
    testimonial_confirm_enabled: true,
    admin: Django.user_admin,
  },
  account: {
    account_id: Django.account_id,
    account_name: Django.account_name,
    account_logo: Django.logo_url,
    account_url: "",
    account_slug: "",
    obfuscated_slug: Django.account_obfuscated_slug,
    paid_account: Django.paid_account,
    grandfathered: Django.grandfathered,
    rating: -1,
    onboarding_complete: Django.onboarding_complete,
    invites_remaining: null,
    email_invites_remaining: null,
    sms_invites_remaining: null,
    tutorial_active: Django.tutorial_active,
    tutorial_complete: false,
    tutorial_auto_start: true,
    onboarding_review_invite_lock: false,
    account_summary: Django.account_summary,
    related_accounts: Django.related_accounts,
    providers: Django.providers,
    selected_account_id: "",
    selected_provider: null,
    vertical: Django.vertical,
    vertical_config: Django.vertical_config,
    card_info: Django.card_info,
    settings_lock: Django.settings_lock,
    recurring_payments_enabled: Django.recurring_payments_enabled,
    nexhealth_integration_id: Django.nexhealth_integration_id
  },
  activity: activity,
  appointpal: appointpal,
  dashboard: dashboard,
  feed: feed,
  testimonials: testimonials,
  messages: messages,
  seal: seal,
  reports: reports,
  locations: locations,
  leaderboard: leaderboard,
  settings: settings,
  team: team,
  onboarding: onboarding,
  payment: payment,
  widget: widget,
  drop_down: {
    location_selector: {
      visible: false,
      active: false
    },
    user_menu: {
      visible: false,
      active: false
    },
    apps_menu: {
      visible: false,
      active: false
    },
    filter_menu: {
      visible: false,
      active: false
    },
    status_filter: {
      visible: false,
      active: false
    },
    table_selector: {
      visible: false,
      active: false
    },
    message_filter: {
      visible: false,
      active: false
    },
    provider_selector: {
      visible: false,
      active: false
    }
  },
  confirmation: false,
  alert: false,
  alpha_alert: false,
  upgrade_prompt: false,
  payment_prompt: false,
  upgrade_inputs: {
    first_name: Django.first_name,
    last_name: Django.last_name,
    email: Django.user_email,
    company_name: Django.account_name,
    phone_number: Django.phone_number,
  },
  contact_prompt: false,
  contact_inputs: {
    to_email: "contact@appointpal.com",
    subject: "",
    body: "",
  },
  location_prompt: false,
  location_inputs: [
    {
      label: "Address 1",
      name: "address_1",
      value: "",
    },
    {
      label: "Address 2",
      name: "address_2",
      value: "",
    },
    {
      label: "Address 3",
      name: "address_3",
      value: "",
    },
    {
      label: "Address 4",
      name: "address_4",
      value: "",
    },
  ],
  default_location_inputs: [
    {
      label: "Address 1",
      name: "address_1",
      value: "",
    },
    {
      label: "Address 2",
      name: "address_2",
      value: "",
    },
    {
      label: "Address 3",
      name: "address_3",
      value: "",
    },
    {
      label: "Address 4",
      name: "address_4",
      value: "",
    },
  ],
  review_invite_prompt: false,
  mini_accelerator: false,
  review_invite: {
    selected_account_id: "",
    contact: {
      value: "",
      error: false,
    },
    first_name: {
      value: "",
      error: false,
    },
    alert: false,
  },
  accelerator_invites: {
    contacts: {
      value: "",
      error: false,
    },
    alert: false,
  },
  sources: [],
  payment_sources: ["Amex", "Discover", "Mastercard", "Visa"],
  generators: [],
  appointpal_request_pending: false,
  review_invite_lock: false,
  request_introductions_sent: false
});

export default tree;