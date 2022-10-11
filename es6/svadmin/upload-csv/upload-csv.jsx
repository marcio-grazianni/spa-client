import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import {InputDropdown} from '../UI/input-dropdown'
import {Alert} from '../UI/alert'
import {handleSubmit, uploadCSV, changeOwner} from './actions'

@branch({
  success_prompts: ['uploadCSV', 'success_prompts'],
  error_prompts: ['uploadCSV', 'error_prompts'],
  owner: ['uploadCSV', 'owner'],
  owner_options: ['uploadCSV', 'owner_options'],
  alert: ['alert'],
})
class UploadCSV extends Component {
  _changeOwner(value, input_id) {
    this.props.dispatch(
      changeOwner,
      value,
    );
  }
  _onCSVDrop(files) {
    this.props.dispatch(
      uploadCSV,
      files
    )
  }
  _uploadCSV() {
    this.refs.dropzone.open()
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(handleSubmit);
  }
  render() {
    const {success_prompts, error_prompts, owner, owner_options, alert} = this.props;
    let prompts = [];
    success_prompts.forEach((prompt, index) => {
      prompts.push(<li key={`success-${index}`} className='success'>{prompt}</li>);
    });
    error_prompts.forEach((prompt, index) => {
      prompts.push(<li key={`error-${index}`} className='error'>{prompt}</li>);
    });
    return(
      <form onSubmit={::this._handleSubmit}>
        {
          alert &&
          <div className='alert-wrapper'>
            <Alert alert={alert} />
          </div>
        }
        <div className='control-group'>
          <ul className='prompts'>
          {prompts}
          </ul>
          <label>CSV:</label>
          <div className='controls'>
            <Dropzone onDrop={::this._onCSVDrop} ref="dropzone" style={{}}>
            </Dropzone>
            <button className='btn' type="button" onClick={::this._uploadCSV}>
                Upload CSV
            </button>
          </div>
          <InputDropdown
            id="owner"
            title="Hubspot Owner"
            disabled={false}
            value={owner.value}
            error={owner.error}
            Options={owner_options}
            changeValue={::this._changeOwner}
          />
        </div>
        <button type='submit' className='btn btn-confirm'>Submit</button>
      </form>
    );
  }
}


export { UploadCSV };
