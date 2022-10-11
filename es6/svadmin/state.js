import Baobab from 'baobab'
import creation from './creation/state.js'
import uploadCSV from './upload-csv/state.js'
import update from './update/state.js'

const tree = new Baobab({
  alert: false,
  creation,
  uploadCSV,
  update,
});

export default tree;