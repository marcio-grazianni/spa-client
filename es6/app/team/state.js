import {monkey} from 'baobab'

const team = {
  team_lockout: false,
  user_list_saved: [],
  user_list: [],
  user_ids_saved: monkey({
    cursors: {
      user_list_saved: ['team', 'user_list_saved'],
    },
    get: (state) => {
      return state.user_list_saved.map((user_obj) =>
        user_obj.id
      );
    },
  }),
  user_ids: monkey({
    cursors: {
      user_list: ['team', 'user_list'],
    },
    get: (state) => {
      return state.user_list.map((user_obj) =>
        user_obj.id
      );
    },
  }),
  unsaved_changes: monkey({
    cursors: {
      user_list_saved: ['team', 'user_list_saved'],
      user_list: ['team', 'user_list'],
      user_ids_saved: ['team', 'user_ids_saved'],
      user_ids: ['team', 'user_ids'],
    },
    get: (state) => {
      let unsaved_changes = {};
      unsaved_changes['to_remove_ids'] = [];
      unsaved_changes['to_cancel_ids'] = [];
      unsaved_changes['to_admin_ids'] = [];
      unsaved_changes['to_non_admin_ids'] = [];
      const removed_ids = state.user_ids_saved.filter((id) =>
        state.user_ids.indexOf(id) < 0
      );
      // Seperate removed_ids into 2 types
      // We have to_remove_ids for active
      // to_cancel_ids for pending invites
      removed_ids.forEach((id) => {
        unsaved_changes.to_remove_ids.push(id);
      });
      state.user_list.forEach((user_obj) => {
        let user_obj_saved = state.user_list_saved.find(x => x.id === user_obj.id);
        if (user_obj.admin !== user_obj_saved.admin) {
          if (user_obj.admin) {
            unsaved_changes.to_admin_ids.push(user_obj.id);
          } else {
            unsaved_changes.to_non_admin_ids.push(user_obj.id);
          }
        }
      });
      return unsaved_changes;
    },
  }),
  sorted_user_list: monkey({
    cursors: {
      user_list: ['team', 'user_list'],
    },
    get: (state) => {
      let sorted_list = state.user_list.slice();

      sorted_list.sort((a, b) => {
        if (a.primary_user) {
          return 1;
        }
      });
      return sorted_list;
    },
  }),
  add_user_input: "",
  request_pending: false,
}

export default team;