export function showFeedLock(tree) {
  tree.select('feed', 'feed_lock_prompt', 'visible').set(true);
}

export function toggleFeatureLock(tree) {
  tree.select('feed', 'feature_lock').set(true);
}

export function onChangeSection(tree) {
  tree.select('alert').set(false);
}
