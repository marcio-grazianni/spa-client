import axios from 'axios'

Django.pollingInterval = null;
Django.stopPolling = function() {
    if (Django.pollingInterval) {
        clearInterval(Django.pollingInterval);
        Django.pollingInterval = null;
    }
};

let load_message_list = (tree, account_id, callback) => {
    let wrapped_callback = () => {
        if(callback) {
            callback();
        }
    }
    axios({
        method: 'get',
        url: `/api/message_threads/?account_id=${account_id}&page_size=100`
    }).then((response) => {
        if(response.data) {
            tree.select('messages').select('message_thread_list').set(response.data.results);
        }
        wrapped_callback();
    });
}

let search_message_list = (tree, account_id, query, callback) => {
    let wrapped_callback = () => {
        if(callback) {
            callback();
        }
    }
    axios({
        method: 'get',
        url: `/api/message_threads/?account_id=${account_id}&search=${query}&page_size=100`
    }).then((response) => {
        if(response.data) {
            tree.select('messages').select('message_thread_list').set(response.data.results);
        }
        wrapped_callback();
    });
}

let load_or_search_message_list = (tree, account_id, callback) => {
    let query = tree.get('messages', 'search_query');
    if(query) {
        search_message_list(tree, account_id, query, callback)
    } else {
        load_message_list(tree, account_id, callback);
    }
}

function refreshMessageList(tree, message_thread_id) {
    axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/messages/`
    }).then((response) => {
        if (response.data) {
            const message_list = response.data.messages;
            tree.select('messages', 'message_thread_messages', message_thread_id).set(message_list);
            tree.select('messages', 'message_list').set(message_list);
        }
    });
}

function refreshMiniProfile(tree, message_thread_id) {
    axios({
        method: 'get',
        url: `/api/message_threads/${message_thread_id}/mini_profile/`
    }).then((response) => {
        if (response.data) {
            const mini_profile = response.data.mini_profile;
            tree.select('messages', 'message_thread_contacts', message_thread_id).set(mini_profile);
            tree.select('messages', 'mini_profile').set(mini_profile);
        }
    });
}

function setActiveMessageThread(tree, uuid) {
    const current_active_thread = tree.get('messages', 'active_message_thread');
    if(current_active_thread == uuid) {
        return;
    }
    tree.select('messages', 'active_message_thread').set(uuid);
    tree.select('messages', 'message_thread', 'selected_filter').set('all');
    const current_filter = tree.get('messages', 'selected_filter');
    if(current_filter) {
        tree.select('messages', 'last_thread_by_section', current_filter).set(uuid);
    }
}

function terminalTransactionCompleted(tree) {
    tree.select('appointpal', 'invoice_stepper', 'payment_method').set('');
    tree.select('appointpal', 'invoice_stepper', 'sent_to_terminal').set(false);
    const message_thread_id = tree.get('messages', 'active_message_thread');
    let do_select = null;
    if(message_thread_id) {
        do_select = () => {
            setActiveMessageThread(tree, message_thread_id);
            refreshMessageList(tree, message_thread_id);
            refreshMiniProfile(tree, message_thread_id);
        }
    } else {
        do_select = () => {
            const displayed_message_threads = tree.select('messages').get('displayed_message_threads');
            const top_item = displayed_message_threads[0];
            const selected_item_id = top_item && top_item.uuid;
            if(selected_item_id) {
                setActiveMessageThread(tree, selected_item_id);
                refreshMessageList(tree, selected_item_id);
                refreshMiniProfile(tree, selected_item_id);
            }
        }
    }
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if (!selected_id) {
        selected_id = account_id;
    }
    load_or_search_message_list(tree, selected_id, do_select);
}

function validateRecurringPayment(tree) {
    const payment_term = tree.get('appointpal', 'invoice_builder', 'payment_term');
    if ('full' !== payment_term) {
        const recipient = tree.get('appointpal', 'invoice_builder', 'recipient');
        if (!recipient || !recipient.card_number) {
            tree.select('alpha_alert').set({
                body: 'No card on file - must pay in full.',
                alert_type: 'error'
            });
            return false;
        }
    }
    return true;
}

function validateLineItems(tree) {
    let line_items = tree.get('appointpal', 'invoice_builder', 'line_items');
    if(0 === line_items.length) {
        tree.select('alpha_alert').set({
            body: 'Invoice must have at least one line item',
            alert_type: 'error'
        });
        return false;
    }
    const payment_term = tree.get('appointpal', 'invoice_builder', 'payment_term');
    if('sub' === payment_term && 1 !== line_items.length) {
        tree.select('alpha_alert').set({
            body: 'A subscription can only have one line item.',
            alert_type: 'error'
        });
        return false;
    }
    for (var line_item of line_items) {
        if(!line_item.description) {
          tree.select('alpha_alert').set({
            body: 'Please enter some text in each "Item" field.',
            alert_type: 'error'
          });
          return false;
        }
        if(!line_item.amount || line_item.amount <= 0.0) {
          tree.select('alpha_alert').set({
            body: 'Please enter a positive dollar amount in each "Price" field.',
            alert_type: 'error'
          });
          return false;
        }
        if(null == line_item.discount || line_item.discount < 0.0) {
          tree.select('alpha_alert').set({
            body: 'Please enter a positive dollar amount in each "Discount" field.',
            alert_type: 'error'
          });
          return false;
        }
    }

    let subtotal_amount = tree.get('appointpal', 'invoice_builder', 'subtotal_amount');
    if(!subtotal_amount || subtotal_amount <= 0) {
        tree.select('alpha_alert').set({
            body: 'Invoice total must be a positive dollar amount.',
            alert_type: 'error'
        });
        return false;
    }

    return true;
}

function createInvoiceErrorHandler(tree, error) {
    console.log(error);
}

function createInvoice(tree, callback, onError, status) {
    if(!validateRecurringPayment(tree)) {
        return;
    }
    let line_items = tree.get('appointpal', 'invoice_builder', 'line_items');
    if(!validateLineItems(tree)) {
        return;
    }
    if(!status) {
        status = 1; //Created
    }
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if (!selected_id) {
      selected_id = account_id;
    }
    const recipient = tree.get('appointpal', 'invoice_builder', 'recipient');
    const provider = tree.get('appointpal', 'invoice_builder', 'provider');
    const subtotal = tree.get('appointpal', 'invoice_builder', 'subtotal_amount');
    const tax_rate = tree.get('appointpal', 'invoice_builder', 'tax_rate');
    const tax_amount = tree.get('appointpal', 'invoice_builder', 'tax_amount');
    const total_amount = tree.get('appointpal', 'invoice_builder', 'total_amount');
    const invoice_date = tree.get('appointpal', 'invoice_builder', 'invoice_date');
    const due_date = tree.get('appointpal', 'invoice_builder', 'due_date');
    const payment_term = tree.get('appointpal', 'invoice_builder', 'payment_term');
    let transform_line_item = (line_item, index) => {
        return {
            "service_rendered": {
                "name": line_item.description,
                "quantity": line_item.quantity,
                "date_of_service": invoice_date
            },
            "order": index,
            "unit_price": line_item.amount,
            "discount": line_item.discount,
            "subtotal": line_item.quantity * line_item.amount,
            "tax_rate": tax_rate,
            "tax_amount": line_item.quantity * line_item.amount * tax_rate,
            "total_amount": (1 + tax_rate) * line_item.quantity * line_item.amount
        }
    }
    line_items = line_items.map(transform_line_item);
    let client_id = null;
    if(recipient) {
        client_id = recipient.contact_id;
        selected_id = recipient.account_id;
    }
    axios({
        method: 'post',
        url: '/api/invoices/',
        data: {
            "account": selected_id,
            "client": client_id,
            "provider": provider ? provider.id : null,
            "status": status,
            "invoice_date": invoice_date,
            "due_date": due_date,
            "subtotal": subtotal,
            "tax_rate": tax_rate,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "line_items": line_items,
            "payment_term": payment_term
        },
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        tree.select('appointpal', 'invoice').set(response.data);
        if (callback) {
          callback(tree, response);
        }
       })
      .catch((error) => {
        if (onError) {
          onError(tree, error);
        }
      });
}

function createAndSaveInvoice(tree, callback, onError) {
    const status = 2; // Saved
    createInvoice(tree, callback, onError, status);
}

function saveInvoice(tree, callback, onError) {
    const status = 2; // Saved
    updateInvoice(tree, callback, onError, status)
}

function updateInvoice(tree, callback, onError, status) {
    if(!validateRecurringPayment(tree)) {
        return;
    }
    let line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    if(!validateLineItems(tree)) {
        return;
    }
    if(!status) {
        status = tree.get('appointpal', 'invoice', 'status');
    }
    const invoice_id = tree.get('appointpal', 'invoice', 'id');
    const subtotal = tree.get('appointpal', 'invoice_builder', 'subtotal_amount');
    const tax_rate = tree.get('appointpal', 'invoice_builder', 'tax_rate');
    const tax_amount = tree.get('appointpal', 'invoice_builder', 'tax_amount');
    const total_amount = tree.get('appointpal', 'invoice_builder', 'total_amount');
    const invoice_date = tree.get('appointpal', 'invoice_builder', 'invoice_date');
    const due_date = tree.get('appointpal', 'invoice_builder', 'due_date');
    const payment_term = tree.get('appointpal', 'invoice_builder', 'payment_term');
    let transform_line_item = (line_item, index) => {
        return {
            "service_rendered": {
                "name": line_item.description,
                "quantity": line_item.quantity,
                "date_of_service": invoice_date
            },
            "order": index,
            "unit_price": line_item.amount,
            "discount": line_item.discount,
            "subtotal": line_item.quantity * line_item.amount,
            "tax_rate": tax_rate,
            "tax_amount": line_item.quantity * line_item.amount * tax_rate,
            "total_amount": (1 + tax_rate) * line_item.quantity * line_item.amount
        }
    }
    line_items = line_items.map(transform_line_item);
    axios({
        method: 'patch',
        url: '/api/invoices/' + invoice_id + '/',
        data: {
            "status": status,
            "invoice_date": invoice_date,
            "due_date": due_date,
            "subtotal": subtotal,
            "tax_rate": tax_rate,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "line_items": line_items,
            "payment_term": payment_term
        },
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        if (status > 1) {
            const message_thread_id = tree.get('messages', 'active_message_thread');
            refreshMessageList(tree, message_thread_id);
        }
        tree.select('appointpal', 'invoice').set(response.data);
        if (callback) {
          callback(tree, response);
        }
       })
      .catch((error) => {
        if (onError) {
          onError(tree, error);
        }
      }
    );
}

export function saveAsDraft(tree, callback) {
    const account_id = tree.get('account', 'account_id');
    const invoice = tree.get('appointpal', 'invoice');
    const message_thread_id = tree.get('messages', 'active_message_thread');
    const create_or_update = invoice ? saveInvoice : createAndSaveInvoice;
    let wrapped_callback = (tree, response) => {
        if(callback) {
            callback(tree);
        }
        tree.select('appointpal', 'invoice_builder', 'dirty').set(false);
        tree.select('appointpal', 'confirmation').set(false);
        tree.select('alert').set({
           body: 'Invoice Saved as Draft',
           alert_type: 'success'
        });
        refreshMessageList(tree, message_thread_id);
    }
    create_or_update(tree, wrapped_callback, createInvoiceErrorHandler);
}

export function buildStepComplete(tree) {
    if(!validateRecurringPayment(tree)) {
        return false;
    }
    const line_items = tree.select('appointpal', 'invoice_builder', 'line_items').get();
    if(!validateLineItems(tree)) {
        return;
    }
    const invoice = tree.select('appointpal', 'invoice').get();
    if(!invoice) {
        let callback = (t, response) => {
            t.select('alpha_alert').set(false);
            t.select('appointpal', 'invoice_builder', 'dirty').set(false);
            t.select('appointpal', 'invoice_stepper', 'step').set(2);
        };
        createInvoice(tree, callback, createInvoiceErrorHandler);
    } else {
        // if invoice already saved, do not overwrite yet
        tree.select('alpha_alert').set(false);
        tree.select('appointpal', 'invoice_stepper', 'step').set(2);
    }
}

function simulatePOSCompletion(tree) {
    const invoice_id = tree.get('appointpal', 'invoice', 'id');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/complete/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        tree.select('appointpal', 'invoice').set(response.data);
       })
      .catch((error) => {
        console.log(error);
      });
}

function useStoredCardSelected(tree) {
    const invoice_id = tree.get('appointpal', 'invoice', 'id');
    const message_thread_id = tree.get('messages', 'active_message_thread');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/use-stored-card/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        tree.select('appointpal', 'invoice').set(response.data);
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
        if(message_thread_id) {
          let do_select = () => {
            setActiveMessageThread(tree, message_thread_id);
            refreshMessageList(tree, message_thread_id);
            refreshMiniProfile(tree, message_thread_id);
          }
          const account_id = tree.get('account', 'account_id');
          let selected_id = tree.get('account', 'selected_account_id');
          if (!selected_id) {
            selected_id = account_id;
          }
          load_or_search_message_list(tree, selected_id, do_select);
        }
      })
      .catch((error) => {
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
        refreshMessageList(tree, message_thread_id);
        console.log(error);
      });
}

function checkForInvoiceCompletion(tree, invoice_id) {
    axios({
        method: 'get',
        url: '/api/invoices/' + invoice_id + '/'
    }).then((response) => {
        if(response.status === 200) {
          tree.select('appointpal', 'invoice').set(response.data);
          let status = response.data.status;
          if(status > 2) {
              terminalTransactionCompleted(tree);
              Django.stopPolling();
          }
        } else {
           console.log(response.data);
           Django.stopPolling();
        }
    }).catch((error) => {
        console.log(error);
        Django.stopPolling();
    });
}

function swipeInsertCardSelected(tree) {
    const invoice_id = tree.get('appointpal', 'invoice', 'id');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/send-to-terminal/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        if(response.status === 200) {
          tree.select('appointpal', 'invoice').set(response.data);
          tree.select('appointpal', 'invoice_stepper', 'sent_to_terminal').set(true);
          let pollInvoice = function() {
              checkForInvoiceCompletion(tree, invoice_id);
          };
          Django.stopPolling();
          Django.pollingInterval = setInterval(pollInvoice, 5000);
        } else {
          console.log(response.data);
        }
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
       })
      .catch((error) => {
        console.log(error);
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
      });
}

function sendInvoiceSelected(tree) {
    const account_id = tree.get('account', 'account_id');
    const invoice_id = tree.get('appointpal', 'invoice', 'id');
    const message_thread_id = tree.get('messages', 'active_message_thread');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/send-invoice/',
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        let do_select = () => {
            setActiveMessageThread(tree, message_thread_id);
            refreshMessageList(tree, message_thread_id);
            refreshMiniProfile(tree, message_thread_id);
        }
        tree.select('appointpal', 'invoice').set(response.data);
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
        load_or_search_message_list(tree, account_id, do_select);
      })
      .catch((error) => {
        tree.select('appointpal', 'invoice_stepper', 'step').set(3);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(false);
        console.log(error);
      });}

export function paymentMethodSelected(tree, method) {
    const dirty = tree.get('appointpal', 'invoice_builder', 'dirty');
    let selectMethod = () => {
        tree.select('appointpal', 'invoice_builder', 'dirty').set(false);
        tree.select('appointpal', 'invoice_stepper', 'payment_method').set(method);
        tree.select('appointpal', 'invoice_stepper', 'method_selected').set(true);
        if ('use-stored-card' === method) {
            useStoredCardSelected(tree);
        } else if ('swipe-insert-card' === method) {
            swipeInsertCardSelected(tree);
        } else if ('send-invoice' === method) {
            sendInvoiceSelected(tree);
        }
    }
    if(dirty) {
        updateInvoice(tree, selectMethod);
    } else {
        selectMethod();
    }
}