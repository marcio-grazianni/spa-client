import tree from './state'
import qs from 'qs'

export function initialLoad(tree) {
}

export function closeAlert(tree, alpha) {
  if (alpha) {
    tree.select('alpha_alert').set(false);
  }
  tree.select('alert').set(false);
}
