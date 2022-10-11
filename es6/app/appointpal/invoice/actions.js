export function toggleDatePicker(tree) {
    $('.clickable-date').toggle();
}

export function handleDueDateChange(tree, value) {
  tree.select('appointpal', 'invoice_builder', 'due_date').set(value);
  tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function handleLineItemDescriptionChange(tree, idx, value) {
    const line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    const line_item = line_items[idx];
    let new_line_item = {
        description: value,
        quantity: line_item.quantity,
        amount: line_item.amount,
        discount: line_item.discount,
    };
    tree.select('appointpal', 'invoice_builder', 'line_items').splice([idx, 1, new_line_item]);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function handleLineItemQuantityChange(tree, idx, value) {
    const line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    const line_item = line_items[idx];
    let new_line_item = {
        description: line_item.description,
        quantity: value,
        amount: line_item.amount,
        discount: line_item.discount,
    };
    tree.select('appointpal', 'invoice_builder', 'line_items').splice([idx, 1, new_line_item]);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function handleLineItemAmountChange(tree, idx, floatValue, maskedValue) {
    const line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    const line_item = line_items[idx];
    let new_line_item = {
        description: line_item.description,
        quantity: line_item.quantity,
        amount: floatValue,
        discount: line_item.discount,
    };
    tree.select('appointpal', 'invoice_builder', 'line_items').splice([idx, 1, new_line_item]);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function handleLineItemDiscountChange(tree, idx, floatValue, maskedValue) {
    const line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    const line_item = line_items[idx];
    let new_line_item = {
        description: line_item.description,
        quantity: line_item.quantity,
        amount: line_item.amount,
        discount: floatValue,
    };
    tree.select('appointpal', 'invoice_builder', 'line_items').splice([idx, 1, new_line_item]);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function removeLineItem(tree, idx) {
    tree.select('appointpal', 'invoice_builder', 'line_items').splice([idx, 1]);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}

export function addLineItem(tree) {
    tree.select('appointpal', 'invoice_builder', 'line_items').push({
        description: '',
        quantity: 1,
        amount: 0.00,
        discount: 0.00,
    })
}

export function paymentTermChanged(tree, term) {
    tree.select('appointpal', 'invoice_builder', 'payment_term').set(term);
    tree.select('appointpal', 'invoice_builder', 'dirty').set(true);
}
