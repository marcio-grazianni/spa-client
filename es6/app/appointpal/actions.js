import axios from 'axios'
import moment from 'moment'

function validateInvoiceState(tree) {
    let recipient = tree.get('appointpal', 'invoice_builder', 'recipient');
    if(!recipient) {
        return false;
    }
    let line_items = tree.get('appointpal', 'invoice_builder', 'line_items');
    if(0 === line_items.length) {
        return false;
    }
    for (var line_item of line_items) {
        if(!line_item.description || line_item.amount <= 0.0) {
          return false;
        }
    }
    return true;
}

export function closeActivatePaymentsPrompt(tree) {
    tree.select('appointpal', 'activate_payments_prompt').set(false);
    tree.select('appointpal', 'activate_payments', 'requested').set(false);
}

export function activatePayments(tree) {
  tree.select('appointpal', 'activate_payments', 'pending').set(true);
  axios({
      method: 'post',
      url: '/activate-payments/',
      headers: {"X-CSRFToken": Django.csrf_token()}
  }).then((resposne) => {
    tree.select('appointpal', 'activate_payments', 'pending').set(false);
    tree.select('appointpal', 'activate_payments', 'requested').set(true);
    tree.commit();
  });
}

export function closeActivateIntakePrompt(tree) {
    tree.select('appointpal', 'activate_intake_prompt').set(false);
}

export function activateIntake(tree) {
  tree.select('appointpal', 'activate_intake', 'pending').set(true);
  axios({
      method: 'post',
      url: '/activate-intake/',
      headers: {"X-CSRFToken": Django.csrf_token()}
  }).then((response) => {
    tree.select('appointpal', 'activate_intake', 'pending').set(false);
    tree.select('appointpal', 'activate_intake', 'requested').set(true);
    tree.commit();
  });
}

export function toggleManageClientPrompt(tree) {
  let currentState = tree.get('manage_client_prompt');
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'manage_client_prompt').set(!currentState);
}

export function toggleAddClientPrompt(tree) {
  tree.select('appointpal', 'client_form', 'editing').set(null);
  tree.select('appointpal', 'client_form', 'first_name', 'value').set('');
  tree.select('appointpal', 'client_form', 'last_name', 'value').set('');
  tree.select('appointpal', 'client_form', 'mobile', 'value').set('');
  tree.select('appointpal', 'client_form', 'email', 'value').set('');
  tree.select('appointpal', 'client_form', 'dob', 'value').set('');
  tree.select('appointpal', 'client_form', 'address', 'value').set('');
  tree.select('appointpal', 'client_form', 'city', 'value').set('');
  tree.select('appointpal', 'client_form', 'state', 'value').set('');
  tree.select('appointpal', 'client_form', 'zip', 'value').set('');
  toggleManageClientPrompt(tree);
}

export function toggleEditClientPrompt(tree, mini_profile) {
  tree.select('appointpal', 'client_form', 'editing').set(mini_profile.subscriber_id);
  tree.select('appointpal', 'client_form', 'external_id').set(mini_profile.external_id);
  tree.select('appointpal', 'client_form', 'first_name', 'value').set(mini_profile.first_name);
  tree.select('appointpal', 'client_form', 'last_name', 'value').set(mini_profile.last_name);
  tree.select('appointpal', 'client_form', 'mobile', 'value').set(mini_profile.phone);
  tree.select('appointpal', 'client_form', 'email', 'value').set(mini_profile.email);
  tree.select('appointpal', 'client_form', 'dob', 'value').set(mini_profile.dob);
  tree.select('appointpal', 'client_form', 'address', 'value').set(mini_profile.address);
  tree.select('appointpal', 'client_form', 'city', 'value').set(mini_profile.city);
  tree.select('appointpal', 'client_form', 'state', 'value').set(mini_profile.state);
  tree.select('appointpal', 'client_form', 'zip', 'value').set(mini_profile.zip);
  toggleManageClientPrompt(tree);
}

function clearInvoiceStepperState(tree) {
    tree.select('alpha_alert').set(false);
    tree.select('appointpal', 'invoice_stepper', 'step').set(0);
    tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
    tree.select('appointpal', 'invoice_stepper', 'payment_method').set(null);
    tree.select('appointpal', 'invoice_stepper', 'sent_to_terminal').set(false);
}

function clearInvoiceBuilderState(tree) {
    tree.select('alpha_alert').set(false);
    tree.select('appointpal', 'invoice_builder', 'recipient').set(null);
    tree.select('appointpal', 'invoice_builder', 'provider').set(null);
    tree.select('appointpal', 'invoice_builder', 'number').set(null);
    tree.select('appointpal', 'invoice_builder', 'read_only').set(false);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(false);
    tree.select('appointpal', 'invoice_builder', 'invoice_date').set(moment().format('YYYY-MM-DD'));
    tree.select('appointpal', 'invoice_builder', 'due_date').set(moment().format('YYYY-MM-DD'));
    tree.select('appointpal', 'invoice_builder', 'payment_term').set('full');
    tree.select('appointpal', 'invoice_builder', 'line_items').set(
        [
            {
                description: '',
                quantity: 1,
                amount: 0.00,
                discount: 0.00
            }
        ]
    );
}

function sentToTerminal(tree) {
    let payment_method = tree.get('appointpal', 'invoice_stepper', 'payment_method');
    return ('swipe-insert-card' == payment_method);
}

function cancelInvoice(invoice) {
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice.id + '/cancel/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        console.log('Invoice ' + invoice.id + ' canceled.');
        Django.stopPolling();
      })
      .catch((error) => {
        console.log(error);
      });
}

function pullFromTerminal(tree, invoice) {
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice.id + '/pull-from-terminal/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        if(invoice.status < 2) {
            tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
        }
        console.log('Invoice ' + invoice.id + ' pulled back from terminal.');
        Django.stopPolling();
      })
      .catch((error) => {
        console.log(error);
      });
}

export function closeInvoiceStepper(tree, cancel) {
    tree.select('appointpal', 'confirmation').set(false);
    let invoice = tree.get('appointpal', 'invoice');
    let recipient = tree.get('appointpal', 'invoice_builder', 'recipient');
    if(invoice) {
        if(sentToTerminal(tree)) {
            pullFromTerminal(tree, invoice);
            tree.select('appointpal', 'invoice_stepper', 'sent_to_terminal').set(false);
        }
        if(1 === invoice.status && (cancel || !recipient)) {
            cancelInvoice(invoice);
        }
    }
    tree.select('appointpal', 'invoice').set(null);
    clearInvoiceStepperState(tree);
    clearInvoiceBuilderState(tree);
    if(Django.close_invoice_stepper_callback) {
        Django.close_invoice_stepper_callback();
        Django.close_invoice_stepper_callback = null;
    }
}

export function closeInvoiceStepperConfirm(tree) {
    let invoice = tree.get('appointpal', 'invoice');
    let dirty = tree.get('appointpal', 'invoice_builder', 'dirty');
    if ((!invoice || invoice.status === 1 || dirty) && validateInvoiceState(tree)) {
        tree.select('appointpal', 'confirmation').set(true);
    } else {
        closeInvoiceStepper(tree);
    }
}

export function confirmationDismiss(tree) {
    tree.select('appointpal', 'confirmation').set(false);
}

export function closeInvoiceEditor(tree) {
    tree.select('appointpal', 'invoice_editor', 'visible').set(false);
    tree.select('appointpal', 'invoice').set(null);
    clearInvoiceBuilderState(tree);
}

export function previousStep(tree) {
    let invoice = tree.get('appointpal', 'invoice');
    if(invoice && sentToTerminal(tree)) {
        pullFromTerminal(tree, invoice);
        tree.select('appointpal', 'invoice_stepper', 'sent_to_terminal').set(false);
    }
    let currentStep = tree.select('appointpal', 'invoice_stepper', 'step').get();
    if(currentStep == 3) {
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
        tree.select('appointpal', 'invoice_stepper', 'payment_method').set(null);
    }
    let previousStep = currentStep - 1;
    tree.select('appointpal', 'invoice_stepper', 'step').set(previousStep);
}
