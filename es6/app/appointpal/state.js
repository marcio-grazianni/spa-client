import {monkey} from 'baobab'
import moment from 'moment'

const appointpal = {
  merchant_id: Django.merchant_id,
  intake_form_url: Django.intake_form_url,
  accepting_payments: Django.accepting_payments,
  confirmation: false,
  manage_client_prompt: false,
  invoice: null,
  sync_in_progress: false,
  client_form: {
    alert: false,
    editing: null,
    edit_callback: null,
    merge_callback: null,
    first_name: {
      value: "",
      error: false,
    },
    last_name: {
      value: "",
      error: false,
    },
    mobile: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
    dob: {
      value: "",
      error: false,
    },
    address: {
      value: "",
      error: false,
    },
    city: {
      value: "",
      error: false,
    },
    state: {
      value: "",
      error: false,
    },
    zip: {
      value: "",
      error: false,
    },
    allow_duplicates: {
      value: false,
      error: false,
    },
    has_duplicate: null,
    guarantor_id: null,
    external_id: null,
    sync_in_progress: false
  },
  upload_clients_prompt: false,
  upload_form: {
    dropzone: {
      hover_state: false,
      hover_timeout: false,
      loading_state: false,
      loaded_state: false,
      filename: "",
    },
    file_client_count: 0,
    client_count: 0,
    uploaded_count: 0,
    invalid_count: 0,
    client_list: [],
    filename: "",
    textarea_value: "",
    uploading: false
  },
  update_credit_card_prompt: false,
  credit_card: {
    transaction_setup_id: null,
  },
  activate_payments_prompt: false,
  activate_payments: {
      pending: false,
      requested: Django.onboarding_step > 5
  },
  activate_intake_prompt: false,
  activate_intake: {
      pending: false,
      requested: false
  },
  invoice_stepper: {
    step: 0,
    method_selected: false,
    payment_method: null,
    sent_to_terminal: false,
  },
  invoice_editor: {
    visible: false,
  },
  invoice_builder: {
    read_only: false,
    dirty: false,
    recipient: null,
    provider: null,
    number: null,
    line_items: [
        {
            description: '',
            quantity: 1,
            amount: 0.00,
            discount: 0.00
        }
    ],
    invoice_date: moment().format('YYYY-MM-DD'),
    due_date: moment().format('YYYY-MM-DD'),
    tax_rate: Django.default_tax_rate / 100.0,
    payment_term: 'full',
    subtotal_amount: monkey({
      cursors: {
        line_items: ['appointpal', 'invoice_builder', 'line_items']
      },
      get: (state) => {
        let sum = 0;
        for (var line_item of state.line_items) {
          let line_item_amount = line_item.amount || 0.00;
          let line_item_discount = line_item.discount || 0.00;
          sum += (line_item.quantity * line_item_amount - line_item_discount);
        }
        return sum.toFixed(2);
      }
    }),
    tax_amount: monkey({
      cursors: {
        subtotal_amount: ['appointpal', 'invoice_builder', 'subtotal_amount'],
        tax_rate: ['appointpal', 'invoice_builder', 'tax_rate']
      },
      get: (state) => {
        return (state.subtotal_amount * state.tax_rate).toFixed(2);
      }
    }),
    total_amount: monkey({
      cursors: {
        subtotal_amount: ['appointpal', 'invoice_builder', 'subtotal_amount'],
        tax_rate: ['appointpal', 'invoice_builder', 'tax_rate']
      },
      get: (state) => {
        return (state.subtotal_amount * (1 + state.tax_rate)).toFixed(2);
      }
    }),
  },
  tools: {
    header: {
      editing: false,
    },
    expanded: {
      scheduler: false,
      credit_card: false,
      invoice: true,
      review: false,
      intake: false,
      notes: false,
    },
    intake: {
        sending: false,
    },
    review: {
        sending: false,
    },
    notes: {
        saving: false,
        content: "",
    },
    invoice: {
        description: '',
        amount: 0.00,
        invoice_date: moment().format('YYYY-MM-DD'),
        due_date: moment().format('YYYY-MM-DD'),
        tax_rate: Django.default_tax_rate / 100.0,
        tax_amount: monkey({
          cursors: {
            subtotal_amount: ['appointpal', 'tools', 'invoice', 'amount'],
            tax_rate: ['appointpal', 'tools', 'invoice', 'tax_rate']
          },
          get: (state) => {
            return (state.subtotal_amount * state.tax_rate).toFixed(2);
          }
        }),
        total_amount: monkey({
          cursors: {
            subtotal_amount: ['appointpal', 'tools', 'invoice', 'amount'],
            tax_rate: ['appointpal', 'tools', 'invoice', 'tax_rate']
          },
          get: (state) => {
            return (state.subtotal_amount * (1 + state.tax_rate)).toFixed(2);
          }
        }),
    },
  },
}

export default appointpal;
