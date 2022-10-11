import axios from 'axios'
import moment from 'moment'
import { isValidPhoneNumber } from 'react-phone-number-input'

let validateEmail = (emailAddress) => /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(emailAddress);

let pending_request = null;

export function changeRange(tree, start_date, end_date) {
  tree.select('activity').select('start_date').set(moment(start_date));
  tree.select('activity').select('end_date').set(moment(end_date));
  const section = tree.get('activity', 'selected_top_menu');
  fetchDataForSection(tree, section);
}

export function issueSearchQuery(tree, value, callback) {
  if (pending_request) {
    clearTimeout(pending_request);
  }
  let async_call = () => callback(tree);
  pending_request = setTimeout(async_call, 200);
}

export function initialLoad(tree) {
  tree.select('activity', 'selected_top_menu').set('contacts');
}

export function onChangeSection(tree) {
  const selected = tree.get('activity', 'selected_top_menu');
  tree.select('activity', 'search_query').set("");
  tree.select('activity', selected, 'search_query').set("");
  tree.select('alert').set(false);
}

export function exportTable(tree, table) {
  if('invoices' === table) {
    exportInvoices(tree);
  } else if ('payments' === table) {
    exportPayments(tree);
  } else if ('review_invites' === table) {
    exportReviewInvites(tree);
  }
}

export function onSearchInput(tree, query, table) {
    tree.select('activity', 'search_query').set(query);
    tree.select('activity', table, 'search_query').set(query);
    tree.select('activity', table, 'page').set(0);
    let callback = null;
    if('invoices' === table) {
        callback = onFetchInvoices;
    } else if ('payments' === table) {
        callback = onFetchPayments;
    } else if ('review_invites' === table) {
        callback = onFetchReviewInvites;
    } else if ('contacts' === table) {
        callback = onFetchContacts;
    } else if ('appointments' === table) {
        callback = onFetchAppointments;
    } else if ('appointment_requests' === table) {
        callback = onFetchAppointmentRequests;
    }
    issueSearchQuery(tree, query, callback);
}

function fetchDataForSection(tree, section) {
    if('invoices' === section) {
        onFetchInvoices(tree);
    } else if ('payments' === section) {
        onFetchPayments(tree);
    } else if ('review_invites' === section) {
        onFetchReviewInvites(tree);
    } else if ('contacts' === section) {
        onFetchContacts(tree);
    } else if ('plans' === section) {
        onFetchPlans(tree);
    } else if ('subscriptions' === section) {
        onFetchSubscriptions(tree);
    } else if ('appointments' === section) {
        onFetchAppointments(tree);
    } else if ('appointment_requests' === section) {
        onFetchAppointmentRequests(tree);
    }
}

export function onFilterSelected(tree, filter, section) {
    tree.select('activity', section, 'status_filter').set(filter);
    tree.select('activity', section, 'page').set(0);
    fetchDataForSection(tree, section);
}

export function onPageChange(tree, page, section) {
   if (!section) {
       section = 'review_invites';
   }
  tree.select('activity', section, 'page').set(page);
}

export function onPageSizeChange(tree, page_size, page, section) {
    if (!section) {
       section = 'review_invites';
   }
  tree.select('activity', section, 'page_size').set(page_size);
}

export function onSortedChange(tree, new_sorted, column, shift_key, section) {
   if (!section) {
    section = 'review_invites';
  }
  let sort_key = new_sorted[0];
  let ordering = sort_key.id;
  if ('queued_at' === ordering) {
      ordering = 'created_at';
  } else if ('name' === ordering && 'appointment_requests' !== section) {
      ordering = 'client_name';
  } else if ('description' === ordering) {
      ordering = 'invoice_number';
  } else if ('contact_name' === ordering) {
      ordering = 'contact__last_name';
  } else if ('provider_name' === ordering) {
      ordering = 'provider__last_name';
  }
  if (sort_key.desc) {
      ordering = '-' + ordering;
  }
  tree.select('activity', section, 'sorted').set(new_sorted);
  tree.select('activity', section, 'ordering').set(ordering);
}

export function changeFiltered(tree, value, section) {
    if (!section) {
       section = 'review_invites';
   }
  tree.select('activity', section, 'filtered').set(value);
}

export function onFetchReviewInvites(tree) {
  tree.select('activity', 'review_invites', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'review_invites', 'page');
  const page_size = tree.get('activity', 'review_invites', 'page_size');
  const ordering = tree.get('activity', 'review_invites', 'ordering');
  const filtered = tree.get('activity', 'review_invites', 'filtered');
  const search_query = tree.get('activity', 'search_query');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');

  axios({
      method: 'get',
      url: `/api/review_invites/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&recipient=${filtered}&search=${search_query}&start_date=${start}&end_date=${end}&provider=${provider_id}`
  }).then((response) => {
      tree.select('activity', 'review_invites', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'review_invites', 'invite_list').set(response.data.results);
          tree.select('activity', 'review_invites', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'review_invites', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'review_invites', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.details;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function exportReviewInvites(tree) {
  tree.select('activity', 'review_invites', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'review_invites', 'page');
  const page_size = tree.get('activity', 'review_invites', 'page_size');
  const ordering = tree.get('activity', 'review_invites', 'ordering');
  const filtered = tree.get('activity', 'review_invites', 'filtered');
  const search_query = tree.get('activity', 'search_query');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  window.location = `/api/review_invites/export.csv?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&recipient=${filtered}&search=${search_query}&start_date=${start}&end_date=${end}`;
  tree.select('activity', 'review_invites', 'loading').set(false);
  return;
}


export function onFetchPayments(tree) {
  tree.select('activity', 'payments', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'payments', 'page');
  const page_size = tree.get('activity', 'payments', 'page_size');
  const ordering = tree.get('activity', 'payments', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'payments', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');

  axios({
      method: 'get',
      url: `/api/transactions/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}&provider=${provider_id}`
  }).then((response) => {
      tree.select('activity', 'payments', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'payments', 'payment_list').set(response.data.results);
          tree.select('activity', 'payments', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'payments', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'payments', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function exportPayments(tree) {
  tree.select('activity', 'payments', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'payments', 'page');
  const page_size = tree.get('activity', 'payments', 'page_size');
  const ordering = tree.get('activity', 'payments', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'payments', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  window.location = `/api/transactions/export.csv?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}`;
  tree.select('activity', 'payments', 'loading').set(false);
}

export function onFetchInvoices(tree) {
  tree.select('activity', 'invoices', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'invoices', 'page');
  const page_size = tree.get('activity', 'invoices', 'page_size');
  const ordering = tree.get('activity', 'invoices', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'invoices', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  axios({
      method: 'get',
      url: `/api/invoices/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}&provider=${provider_id}`

  }).then((response) => {
      tree.select('activity', 'invoices', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'invoices', 'invoice_list').set(response.data.results);
          tree.select('activity', 'invoices', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'invoices', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'invoices', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function exportInvoices(tree) {
  tree.select('activity', 'invoices', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'invoices', 'page');
  const page_size = tree.get('activity', 'invoices', 'page_size');
  const ordering = tree.get('activity', 'invoices', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'invoices', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  window.location = `/api/invoices/export.csv?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}`;
  tree.select('activity', 'invoices', 'loading').set(false);
}


export function openInvoiceEditor(tree, invoice_id) {
    axios({
        method: 'get',
        url: `/api/invoices/${invoice_id}/`
    }).then((response) => {
        if (response.data) {
            const status = response.data.status;
            const client = response.data.client;
            const provider = response.data.provider;
            const recipient = {
                contact_id: client.id,
                name: client.full_name,
                email: client.email,
                phone: client.formatted_phone,
                card_number: client.card_number
            }
            tree.select('appointpal', 'invoice_builder', 'recipient').set(recipient);
            tree.select('appointpal', 'invoice_builder', 'provider').set(provider);
            tree.select('appointpal', 'invoice_builder', 'number').set(response.data.invoice_number);
            tree.select('appointpal', 'invoice_builder', 'invoice_date').set(response.data.invoice_date);
            tree.select('appointpal', 'invoice_builder', 'due_date').set(response.data.due_date);
            tree.select('appointpal', 'invoice_builder', 'payment_term').set(response.data.payment_term);
            let line_items = [];
            response.data.line_items.forEach((item) => {
                line_items.push({
                    description: item.service_rendered.name,
                    quantity: item.service_rendered.quantity,
                    amount: item.unit_price,
                    discount: item.discount,
                })
            })
            tree.select('appointpal', 'invoice_builder', 'line_items').set(line_items);
            tree.select('appointpal', 'invoice').set(response.data);
            if (status > 2) {
                tree.select('appointpal', 'invoice_builder', 'read_only').set(true);
                tree.select('appointpal', 'invoice_editor', 'visible').set(true);
            } else {
                tree.select('appointpal', 'invoice_stepper', 'step').set(1);
            }
        }
    }).catch((error) => {
        tree.select('activity', 'invoices', 'loading').set(false);
        let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
        if(error.response.data) {
            errorMsg = error.response.data.detail;
        }
        tree.select('alert').set({
            body: errorMsg,
            alert_type: 'error'
        });
        window.scrollTo(0, 0);
    });
}

let cancel_invoice_callback = null;

export function cancelInvoiceConfirm(tree, invoice_id, callback) {
    tree.select('activity', 'invoices', 'selected').set(invoice_id);
    tree.select('confirmation').set('cancel');
    cancel_invoice_callback = callback;
}

export function cancelInvoice(tree) {
    const invoice_id = tree.get('activity', 'invoices', 'selected');
    if(!invoice_id) {
        console.log('No invoice to cancel.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/cancel/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        if(cancel_invoice_callback) {
          cancel_invoice_callback();
          cancel_invoice_callback = null;
        }
        tree.select('activity', 'invoices', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Invoice Successfully Canceled',
            alert_type: 'success'
        })
    })
    .catch((error) => {
      console.log(error);
    });
}

let delete_invoice_callback = null;

export function deleteInvoiceConfirm(tree, invoice_id, callback) {
    tree.select('activity', 'invoices', 'selected').set(invoice_id);
    tree.select('confirmation').set('delete');
    delete_invoice_callback = callback;
}

export function deleteInvoice(tree) {
    const invoice_id = tree.get('activity', 'invoices', 'selected');
    if(!invoice_id) {
        console.log('No invoice to delete.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'delete',
        url: '/api/invoices/' + invoice_id + '/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        if(delete_invoice_callback) {
          delete_invoice_callback();
          delete_invoice_callback = null;
        }
        tree.select('activity', 'invoices', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Invoice Successfully Deleted',
            alert_type: 'success'
        })
    })
    .catch((error) => {
      console.log(error);
    });
}

let refund_payment_callback = null;

export function refundPaymentConfirm(tree, transaction, callback) {
    tree.select('activity', 'payments', 'selected').set(transaction);
    tree.select('confirmation').set('refund');
    refund_payment_callback = callback;
}

export function refundPayment(tree) {
    const transaction = tree.get('activity', 'payments', 'selected');
    if(!transaction) {
        console.log('No payment to refund.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/transactions/' + transaction.id + '/refund/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        tree.select('activity', 'payments', 'selected').set(null);
        tree.select('confirmation').set(false);
        if(response.status === 200) {
          if(refund_payment_callback) {
            refund_payment_callback();
            refund_payment_callback = null;
          }
          tree.select('alert').set({
              body: 'Successfully issued refund',
              alert_type: 'success'
          });
        } else {
          let body = response.body.message || 'Could not issue refund';
          tree.select('alert').set({
              body: body,
              alert_type: 'error'
          })
        }
    })
    .catch((error) => {
      tree.select('activity', 'payments', 'selected').set(null);
      tree.select('confirmation').set(false);
      let body = 'Something went wrong!';
      tree.select('alert').set({
        body: body,
        alert_type: 'error'
      });
      console.log(error);
    });
}

let cancel_plan_callback = null;

export function cancelPlanConfirm(tree, recurring_invoice_id, callback) {
    tree.select('activity', 'plans', 'selected').set(recurring_invoice_id);
    tree.select('confirmation').set('cancelPlan');
    cancel_plan_callback = callback;
}

export function cancelPlan(tree) {
    const recurring_invoice_id = tree.get('activity', 'plans', 'selected');
    if(!recurring_invoice_id) {
        console.log('No payment plan to cancel.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/payment_plans/' + recurring_invoice_id + '/cancel/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        if(cancel_plan_callback) {
          cancel_plan_callback();
          cancel_plan_callback = null;
        }
        tree.select('activity', 'plans', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Payment Plan Successfully Canceled',
            alert_type: 'success'
        })
    })
    .catch((error) => {
      console.log(error);
    });
}

let cancel_appointment_callback = null;

export function cancelAppointmentConfirm(tree, appointment_id, callback) {
    tree.select('activity', 'appointments', 'selected').set(appointment_id);
    tree.select('confirmation').set('cancelAppointment');
    cancel_appointment_callback = callback;
}

export function cancelAppointment(tree) {
    const appointment_id = tree.get('activity', 'appointments', 'selected');
    if(!appointment_id) {
        console.log('No appointment to cancel.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/appointments/' + appointment_id + '/cancel/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        if(cancel_appointment_callback) {
          cancel_appointment_callback();
          cancel_appointment_callback = null;
        }
        tree.select('activity', 'appointments', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Appointment Successfully Canceled',
            alert_type: 'success'
        })
    })
    .catch((error) => {
      console.log(error);
    });
}

export function confirmAppointment(tree, appointment_id, callback) {
    if(!appointment_id) {
        console.log('No appointment to confirm.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/appointments/' + appointment_id + '/confirm/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        if(callback) {
          callback();
        }
        tree.select('activity', 'appointments', 'selected').set(null);
        tree.select('alert').set({
            body: 'Appointment Confirmed',
            alert_type: 'success'
        })
    })
    .catch((error) => {
      console.log(error);
    });
}


export function resendInvoiceConfirm(tree, invoice_id, callback) {
    tree.select('activity', 'invoices', 'selected').set(invoice_id);
    tree.select('confirmation').set('resend');
}

export function resendInvoice(tree) {
    const invoice_id = tree.get('activity', 'invoices', 'selected');
    if(!invoice_id) {
        console.log('No invoice to resend.');
        return
    }
    const account_id = tree.get('account', 'account_id');
    axios({
        method: 'post',
        url: '/api/invoices/' + invoice_id + '/send-invoice/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        tree.select('activity', 'invoices', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Invoice Successfully Re-sent',
            alert_type: 'success'
        })
    })
    .catch((error) => {
        tree.select('activity', 'invoices', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Failed to resend invoice.',
            alert_type: 'error'
        });
        console.log(error);
    });
}

export function resendReceiptConfirm(tree, transaction_id) {
    tree.select('activity', 'payments', 'selected').set(transaction_id);
    tree.select('confirmation').set('resendReceipt');
}

export function resendReceipt(tree) {
    const transaction_id = tree.get('activity', 'payments', 'selected');
    if(!transaction_id) {
        console.log('No payment selected.');
        return
    }
    axios({
        method: 'post',
        url: '/api/transactions/' + transaction_id + '/resend-receipt/',
        headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
        tree.select('activity', 'payments', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Receipt Successfully Re-sent',
            alert_type: 'success'
        })
    })
    .catch((error) => {
        tree.select('activity', 'invoices', 'selected').set(null);
        tree.select('confirmation').set(false);
        tree.select('alert').set({
            body: 'Failed to resend receipt.',
            alert_type: 'error'
        });
        console.log(error);
    });
}

export function onFetchContacts(tree) {
  tree.select('activity', 'contacts', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'contacts', 'page');
  const page_size = tree.get('activity', 'contacts', 'page_size');
  const ordering = tree.get('activity', 'contacts', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'contacts', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  axios({
      method: 'get',
      url: `/api/contacts/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}`
  }).then((response) => {
      tree.select('activity', 'contacts', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'contacts', 'contact_list').set(response.data.results);
          tree.select('activity', 'contacts', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'contacts', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'contacts', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function onFetchAppointmentRequests(tree) {
  tree.select('activity', 'appointment_requests', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'appointment_requests', 'page');
  const page_size = tree.get('activity', 'appointment_requests', 'page_size');
  const ordering = tree.get('activity', 'appointment_requests', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let selected_id = tree.get('account', 'selected_account_id');
  let status_filter = tree.get('activity', 'appointment_requests', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  if (!selected_id) {
    selected_id = account_id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  axios({
      method: 'get',
      url: `/api/appointment_requests/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}`
  }).then((response) => {
      tree.select('activity', 'appointment_requests', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'appointment_requests', 'appointment_request_list').set(response.data.results);
          tree.select('activity', 'appointment_requests', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'appointment_requests', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'appointment_requests', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function onFetchAppointments(tree) {
  tree.select('activity', 'appointments', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'appointments', 'page');
  const page_size = tree.get('activity', 'appointments', 'page_size');
  const ordering = tree.get('activity', 'appointments', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'appointments', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  const start_date = tree.select('activity').select('start_date').get();
  const end_date = tree.select('activity').select('end_date').get();
  const start = moment(start_date).format('YYYY-MM-DD');
  const end = moment(end_date).format('YYYY-MM-DD');
  axios({
      method: 'get',
      url: `/api/appointments/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&start_date=${start}&end_date=${end}&provider=${provider_id}`
  }).then((response) => {
      tree.select('activity', 'appointments', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'appointments', 'appointment_list').set(response.data.results);
          tree.select('activity', 'appointments', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'appointments', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('activity', 'appointments', 'loading').set(false);
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function onFetchPlans(tree) {
  tree.select('activity', 'plans', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'plans', 'page');
  const page_size = tree.get('activity', 'plans', 'page_size');
  const ordering = tree.get('activity', 'plans', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'plans', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  axios({
      method: 'get',
      url: `/api/payment_plans/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&provider=${provider_id}`
  }).then((response) => {
      tree.select('activity', 'plans', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'plans', 'recurring_invoice_list').set(response.data.results);
          tree.select('activity', 'plans', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'plans', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'plans', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}

export function onFetchSubscriptions(tree) {
  tree.select('activity', 'subscriptions', 'loading').set(true);
  const account_id = tree.get('account', 'account_id');
  const page = tree.get('activity', 'subscriptions', 'page');
  const page_size = tree.get('activity', 'subscriptions', 'page_size');
  const ordering = tree.get('activity', 'subscriptions', 'ordering');
  const search_query = tree.get('activity', 'search_query');
  let status_filter = tree.get('activity', 'subscriptions', 'status_filter');
  if('ALL' === status_filter) {
      status_filter = '';
  }
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  let provider_id = "";
  const provider = tree.get('account', 'selected_provider');
  if(provider) {
    provider_id = provider.id;
  }
  axios({
      method: 'get',
      url: `/api/payment_plans/?account_id=${selected_id}&page=${page+1}&page_size=${page_size}&ordering=${ordering}&search=${search_query}&effective_status=${status_filter}&provider=${provider_id}&subscriptions_only=true`
  }).then((response) => {
      tree.select('activity', 'subscriptions', 'loading').set(false);
      if (response.data) {
          tree.select('activity', 'subscriptions', 'subscription_list').set(response.data.results);
          tree.select('activity', 'subscriptions', 'summary_statistics').set(response.data.extras);
          tree.select('activity', 'subscriptions', 'pages').set(response.data.pages);
      }
  }).catch((error) => {
      tree.select('activity', 'subscriptions', 'loading').set(false);
      let errorMsg = 'Uh oh. Something went wrong. Please try again or contact us at contact@appointpal.com if the problem persists.';
      if(error.response.data) {
          errorMsg = error.response.data.detail;
      }
      tree.select('alert').set({
          body: errorMsg,
          alert_type: 'error'
      });
      window.scrollTo(0, 0);
  });
}


export function archiveContact(tree, contact) {
    let body = {
        status: 3
    };
    axios({
        method: 'put',
        url: '/api/contacts/' + contact.id + '/',
        data: body,
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        onFetchContacts(tree);
        tree.select('alert').set({
          body: 'Archived successfully',
          alert_type: 'success'
        });
      })
      .catch((error) => {
        let body = 'Something went wrong!';
        const orphan = error.response && error.response.data && error.response.data.orphan;
        if(orphan) {
          body = '<div class="subtitle"> Contact has an active dependent:</div>&nbsp;&nbsp;' +  orphan.name + '<br><div class="subtitle">Cannot archive contact with active dependents.</div>';
        } else if(error.response && error.response.data) {
          body = error.response.data[0];
        }
        tree.select('alert').set({
          body: body,
          alert_type: 'error'
        });
    });
}

export function restoreContact(tree, contact) {
    let body = {
        status: 2
    };
    axios({
        method: 'put',
        url: '/api/contacts/' + contact.id + '/',
        data: body,
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        onFetchContacts(tree);
        tree.select('alert').set({
          body: 'Restored successfully',
          alert_type: 'success'
        });
      })
      .catch((error) => {
        let body = 'Something went wrong!';
        if(error.response && error.response.data) {
          body = error.response.data[0];
        }
        tree.select('alert').set({
          body: body,
          alert_type: 'error'
        });
      }
    );
}

export function closeAppointmentRequest(tree, appointment_request_message) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
      method: 'post',
      url: `/api/appointment_requests/${appointment_request_message.id}/close/?account_id=${selected_id}`,
      headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
      onFetchAppointmentRequests(tree);
      tree.select('alert').set({
        body: 'Closed successfully',
        alert_type: 'success'
      });
    })
    .catch((error) => {
      let body = 'Something went wrong!';
      if(error.response && error.response.data) {
        body = error.response.data[0];
      }
      tree.select('alert').set({
        body: body,
        alert_type: 'error'
      });
    }
  );
}

export function openAppointmentRequest(tree, appointment_request_message) {
  const account_id = tree.get('account', 'account_id');
  let selected_id = tree.get('account', 'selected_account_id');
  if (!selected_id) {
    selected_id = account_id;
  }
  axios({
      method: 'post',
      url: `/api/appointment_requests/${appointment_request_message.id}/open/?account_id=${selected_id}`,
      headers: {"X-CSRFToken": Django.csrf_token()},
    })
    .then((response) => {
      onFetchAppointmentRequests(tree);
      tree.select('alert').set({
        body: 'Opened successfully',
        alert_type: 'success'
      });
    })
    .catch((error) => {
      let body = 'Something went wrong!';
      if(error.response && error.response.data) {
        body = error.response.data[0];
      }
      tree.select('alert').set({
        body: body,
        alert_type: 'error'
      });
    }
  );
}

export function closeManageClientPrompt(tree) {
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'manage_client_prompt').set(false);
}

export function clearManageClientForm(tree) {
  tree.select('appointpal', 'client_form', 'editing').set(null);
  tree.select('appointpal', 'client_form', 'edit_callback').set(null);
  tree.select('appointpal', 'client_form', 'merge_callback').set(null);
  tree.select('appointpal', 'client_form', 'first_name', 'value').set("");
  tree.select('appointpal', 'client_form', 'first_name', 'error').set(false);
  tree.select('appointpal', 'client_form', 'last_name', 'value').set("");
  tree.select('appointpal', 'client_form', 'last_name', 'error').set(false);
  tree.select('appointpal', 'client_form', 'mobile', 'value').set("");
  tree.select('appointpal', 'client_form', 'mobile', 'error').set(false);
  tree.select('appointpal', 'client_form', 'email', 'value').set("");
  tree.select('appointpal', 'client_form', 'email', 'error').set(false);
  tree.select('appointpal', 'client_form', 'dob', 'value').set("");
  tree.select('appointpal', 'client_form', 'dob', 'error').set(false);
  tree.select('appointpal', 'client_form', 'address', 'value').set("");
  tree.select('appointpal', 'client_form', 'address', 'error').set(false);
  tree.select('appointpal', 'client_form', 'city', 'value').set("");
  tree.select('appointpal', 'client_form', 'city', 'error').set(false);
  tree.select('appointpal', 'client_form', 'state', 'value').set("");
  tree.select('appointpal', 'client_form', 'state', 'error').set(false);
  tree.select('appointpal', 'client_form', 'zip', 'value').set("");
  tree.select('appointpal', 'client_form', 'zip', 'error').set(false);
  tree.select('appointpal', 'client_form', 'allow_duplicates', 'value').set(false);
  tree.select('appointpal', 'client_form', 'allow_duplicates', 'error').set(false);
  tree.select('appointpal', 'client_form', 'has_duplicate').set(null);
  tree.select('appointpal', 'client_form', 'guarantor_id').set(null);
  tree.select('appointpal', 'client_form', 'external_id').set(null);
  tree.select('appointpal', 'client_form', 'sync_in_progress').set(false);
  tree.commit();
}

export function mergePending(tree) {
    const account_id = tree.get('account', 'account_id');
    let selected_id = tree.get('account', 'selected_account_id');
    if(!selected_id) {
        selected_id = account_id;
    }
    let contact_id = tree.get('appointpal', 'client_form', 'editing');
    if(!contact_id) {
        tree.select('alert').set({
            body: 'No pending contact to merge.',
            alert_type: 'error'
        });
        return;
    }
    const existing_id = tree.get('appointpal', 'client_form', 'has_duplicate');
    if(!existing_id) {
        tree.select('alert').set({
            body: 'No existing contact to merge.',
            alert_type: 'error'
        });
        return;
    }
    axios({
      method: 'post',
      url: '/api/contacts/' + contact_id + '/merge-pending/',
      data: {
        'account_id': selected_id,
        'existing_id': existing_id
      },
      headers: {"X-CSRFToken": Django.csrf_token()}
    }).then((response) => {
      if(response.data.message_thread_id) {
        onFetchContacts(tree);
        tree.select('alert').set({
          body: 'Successfully merged contact',
          alert_type: 'success'
      });
    } else {
        tree.select('alert').set({
            body: 'Failed to merge contact',
            alert_type: 'error'
        })
    }
    clearManageClientForm(tree);
  }).catch((error) => {
    let body = 'Something went wrong!';
    if(error.response && error.response.data) {
        body = error.response.data[0];
    }
    tree.select('alert').set({
        body: body,
        alert_type: 'error'
    });
  });
}

export function editContact(tree, guarantor_id) {
    const contact_id = tree.select('appointpal', 'client_form', 'editing').get();
    let valid = true;
    let first = tree.get('appointpal', 'client_form', 'first_name', 'value');
    if (!first) {
        tree.select('appointpal', 'client_form', 'first_name', 'error').set('Please enter a first name');
        valid = false;
    }
    let last = tree.get('appointpal', 'client_form', 'last_name', 'value');
    if (!last) {
        tree.select('appointpal', 'client_form', 'last_name', 'error').set('Please enter a last name');
        valid = false;
    }
    let mobile = tree.get('appointpal', 'client_form', 'mobile', 'value');
    let email = tree.get('appointpal', 'client_form', 'email', 'value');
    if(!mobile && !email) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter phone number or email');
        valid = false;
    }
    if (mobile && !isValidPhoneNumber(mobile)) {
        tree.select('appointpal', 'client_form', 'mobile', 'error').set('Please enter a valid phone number');
        valid = false;
    }
    if (email && !validateEmail(email)) {
        tree.select('appointpal', 'client_form', 'email', 'error').set('Please enter a valid email');
        valid = false;
    }
    if (!valid) {
        return;
    }
    let dob = tree.get('appointpal', 'client_form', 'dob', 'value');
    let address = tree.get('appointpal', 'client_form', 'address', 'value');
    let city = tree.get('appointpal', 'client_form', 'city', 'value');
    let state = tree.get('appointpal', 'client_form', 'state', 'value');
    let zip = tree.get('appointpal', 'client_form', 'zip', 'value');
    let body = {
      first_name: first,
      last_name: last,
      phone_number: mobile ? mobile : null,
      email: email,
      dob: dob ? dob : null,
      street_address: address,
      city: city,
      state: state,
      zip_code: zip,
      guarantor: guarantor_id
    };
    axios({
        method: 'put',
        url: '/api/contacts/' + contact_id + '/',
        data: body,
        headers: {"X-CSRFToken": Django.csrf_token()},
      })
      .then((response) => {
        clearManageClientForm(tree);
        tree.select('alert').set({
          body: 'Success!',
          alert_type: 'success'
        });
        onFetchContacts(tree);
      })
      .catch((error) => {
        const error_data = error.response && error.response.data;
        if(error_data && error_data.existing) {
            const duplicate = error_data.existing;
            tree.select('appointpal', 'client_form', 'has_duplicate').set(duplicate.subscriber_id);
            tree.select('appointpal', 'client_form', 'guarantor_id').set(duplicate.subscriber_id);
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  duplicate.name + '<br><div class="subtitle">Merge new contact with</div>&nbsp;' +  duplicate.name + '<div class="subtitle">, or make dependent?</div>',
                alert_type: 'warning',
                promotion_buttons: true
            });
        } else if (error_data && error_data.duplicate) {
            const duplicate = error_data.duplicate;
            tree.select('alert').set({
                body: '<div class="subtitle"> Found existing contact with same email or phone:</div>&nbsp;&nbsp;' +  duplicate.name + '<br><div class="subtitle">Make contact a dependent of</div>&nbsp;' +  duplicate.name + '?',
                alert_type: 'warning',
                dependent_buttons: 'edit'
            });
        } else {
          let body = 'Something went wrong!';
          if(error.response && error.response.data) {
              body = error.response.data[0];
          }
          tree.select('alert').set({
              body: body,
              alert_type: 'error'
          });
        }
     });
    closeManageClientPrompt(tree);
}

export function toggleEditContactPrompt(tree, contact) {
  tree.select('appointpal', 'client_form', 'editing').set(contact.id);
  tree.select('appointpal', 'client_form', 'external_id').set(contact.external_id);
  tree.select('appointpal', 'client_form', 'edit_callback').set(editContact);
  tree.select('appointpal', 'client_form', 'merge_callback').set(mergePending);
  tree.select('appointpal', 'client_form', 'guarantor_id').set(contact.guarantor);
  tree.select('appointpal', 'client_form', 'first_name', 'value').set(contact.first_name || '');
  tree.select('appointpal', 'client_form', 'last_name', 'value').set(contact.last_name || '');
  tree.select('appointpal', 'client_form', 'mobile', 'value').set(contact.phone_number || '');
  tree.select('appointpal', 'client_form', 'email', 'value').set(contact.email || '');
  tree.select('appointpal', 'client_form', 'dob', 'value').set(contact.dob || '');
  tree.select('appointpal', 'client_form', 'address', 'value').set(contact.street_address || '');
  tree.select('appointpal', 'client_form', 'city', 'value').set(contact.city || '');
  tree.select('appointpal', 'client_form', 'state', 'value').set(contact.state || '');
  tree.select('appointpal', 'client_form', 'zip', 'value').set(contact.zip_code || '');
  let currentState = tree.get('manage_client_prompt');
  tree.select('alpha_alert').set(false);
  tree.select('appointpal', 'manage_client_prompt').set(!currentState);
}
