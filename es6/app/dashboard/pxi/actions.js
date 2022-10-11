export function changeMouseOver(tree, index, hover_state) {
  tree.select('dashboard'). select('sxi', 'series', {index}, 'hover').set(hover_state);
}

export function changeBreakdownHover(tree, breakdown_id, hover_state) {
  tree.select('dashboard').select('breakdown_hover', breakdown_id).set(hover_state);
}

export function changeSelectedSource(tree, source) {
  tree.select('dashboard').select('selected_source').set(source);
}
