export function changeMouseOver(tree, index, hover_state) {
  tree.select('dashboard'). select('payment_stats', 'series', {index}, 'hover').set(hover_state);
}

export function changeBreakdownHover(tree, breakdown_id, hover_state) {
  tree.select('dashboard').select('payments_breakdown_hover', breakdown_id).set(hover_state);
}

export function changeSelectedSource(tree, source) {
  tree.select('dashboard').select('selected_payment_source').set(source);
}
