import moment from 'moment'

export function toggleExpandedSection(tree, section) {
  let sections = ['credit_card', 'invoice', 'review', 'notes', 'intake'];
  const currentState = tree.select('appointpal', 'tools', 'expanded', section).get();
  tree.select('appointpal', 'tools', 'expanded', section).set(!currentState);
  for (let s of sections) {
    if (s != section) {
      tree.select('appointpal', 'tools', 'expanded', s).set(false);
    }
  }
}

export function handleInvoiceAmountChange(tree, maskedValue, floatValue) {
    tree.select('appointpal', 'tools', 'invoice', 'amount').set(floatValue);
    tree.commit();
}

export function handleInvoiceDescriptionChange(tree, value) {
    tree.select('appointpal', 'tools', 'invoice', 'description').set(value);
    tree.commit();
}

export function handleInputChange(tree, section, name, value) {
    if('invoice' == section && 'tax_rate' == name) {
        value = value / 100.0;
    }
    tree.select('appointpal', 'tools', section, name).set(value);
    tree.commit();
}

export function openActivatePaymentsPrompt(tree) {
    tree.select('appointpal', 'activate_payments', 'requested').set(false);
    tree.select('appointpal', 'activate_payments_prompt').set(true);
}

export function startInvoice(tree) {
    const merchant_id = tree.get('appointpal', 'merchant_id');
    if(!merchant_id) {
        openActivatePaymentsPrompt(tree);
        return;
    }
    const mini_profile = tree.get('messages', 'mini_profile');
    const recipient = {
        account_id: mini_profile.account_id,
        contact_id: mini_profile.subscriber_id,
        name: mini_profile.name,
        email: mini_profile.email,
        phone: mini_profile.formatted_phone,
        card_number: mini_profile.card_number
    };
    const provider = tree.select('account', 'selected_provider').get();
    const description = tree.select('appointpal', 'tools', 'invoice', 'description').get();
    const amount = tree.select('appointpal', 'tools', 'invoice', 'amount').get();
    const invoice_date = tree.select('appointpal', 'tools', 'invoice', 'invoice_date').get();
    const due_date = tree.select('appointpal', 'tools', 'invoice', 'due_date').get();
    const tax_rate = tree.select('appointpal', 'tools', 'invoice', 'tax_rate').get();

    tree.select('appointpal', 'invoice_builder', 'recipient').set(recipient);
    tree.select('appointpal', 'invoice_builder', 'provider').set(provider);
    tree.select('appointpal', 'invoice_builder', 'line_items').set(
        [
            {
                description: description,
                quantity: 1,
                amount: amount,
                discount: 0.00
            }
        ]
    );
    tree.select('appointpal', 'invoice_builder', 'invoice_date').set(invoice_date);
    tree.select('appointpal', 'invoice_builder', 'due_date').set(due_date);
    tree.select('appointpal', 'invoice_builder', 'tax_rate').set(tax_rate);
    tree.select('appointpal', 'invoice_stepper', 'step').set(1);
    tree.commit();
    tree.select('appointpal', 'tools', 'invoice', 'description').set('');
    tree.select('appointpal', 'tools', 'invoice', 'amount').set(0.0);
    tree.select('appointpal', 'tools', 'invoice', 'invoice_date').set(moment().format('YYYY-MM-DD'));
    tree.select('appointpal', 'tools', 'invoice', 'due_date').set(moment().format('YYYY-MM-DD'));
}

export function changeMessageFilter(tree, filter) {
  tree.select('messages', 'message_thread', 'selected_filter').set(filter);
}
