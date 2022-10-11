import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import {Alert} from '../UI/alert'
import {confirmationToggle} from '../actions'
import {setNotUploadedError, subscriberAddTextareaChange, subscriberRemoveTextareaChange, toggleDropzoneHover, handleDrop, resetSubscriberList, handleAdd, handleRemove} from './actions'

class HoveredDropzone extends Component {
  render() {
    return(
      <div className='dropzone hover'>
        <div className='upload-hover'>
          <h4>Drop your file here</h4>
        </div>
      </div>
    );
  }
}

class LoadingDropzone extends Component {
  render() {
    return(
      <div className='dropzone'>
        <div className='upload-loading'>
          <div className='upload-file'>
            <i className='fa fa-spinner fa-spin'></i>
          </div>
          <div className='drag-prompt'>
            <label className='big-label'>
              Loading
            </label>
          </div>
        </div>
      </div>
    );
  }
}

@branch({
  file_subscriber_add_count: ['settings', 'subscribers', 'file_subscriber_add_count'],
  filename_add: ['settings', 'subscribers', 'filename_add'],
  file_subscriber_remove_count: ['settings', 'subscribers', 'file_subscriber_remove_count'],
  filename_remove: ['settings', 'subscribers', 'filename_remove'],
})
class LoadedDropzone extends Component {
  _resetSubscriberList() {
    this.props.dispatch(
      resetSubscriberList,
      this.props.bulk_type
    );
  }
  render() {
    const {file_subscriber_add_count, filename_add, file_subscriber_remove_count, filename_remove, bulk_type} = this.props;
    let file_subscriber_count;
    let filename;
    if (bulk_type === 'add') {
      file_subscriber_count = file_subscriber_add_count;
      filename = filename_add;
    } else {
      file_subscriber_count = file_subscriber_remove_count;
      filename = filename_remove;
    }
    let subscriber_display_str = '1 subscriber';
    if (file_subscriber_count > 1) {
      subscriber_display_str = `${file_subscriber_count} subscribers`;
    }
    return(
      <div className='dropzone'>
        <div className='upload-loaded'>
          <div className='upload-file'>
            <img src={Django.static("images/uploaded-file.svg")} />
          </div>
          <div className='drag-prompt loaded'>
            <label className='drag-label'>
              <b>{file_subscriber_count} subscribers</b> added from <b>{filename}</b>
            </label>
            <label className='select-label' onClick={::this._resetSubscriberList}>
              Remove
            </label>
          </div>
        </div>
      </div>
    );
  }
}

class DefaultDropzone extends Component {
  render() {
    return(
      <div className='dropzone'>
        <div className='upload-no-hover'>
          <div className='upload-file'>
            <img src={Django.static("images/upload-file.svg")} />
          </div>
          <div className='drag-prompt'>
            <label className='drag-label'>
              Or drag and drop a file with your subscribers here (CSV or XLS)
            </label>
            <label className='select-label' onClick={this.props.onSelectFile}>
              Or select the file from your computer
            </label>
          </div>
        </div>
      </div>
    );
  }
}

@branch({
  dropzone_add_state: ['settings', 'subscribers', 'dropzone_add'],
  dropzone_remove_state: ['settings', 'subscribers', 'dropzone_remove'],
})
class SubscriberDropzone extends Component {
  _onDrop(files) {
    this.props.dispatch(
      handleDrop,
      files,
    );
  }
  _onDragEnter() {
    this.props.dispatch(
      toggleDropzoneHover,
      true,
    );
  }
  _onDragLeave() {
    this.props.dispatch(
      toggleDropzoneHover,
      false,
    );
  }
  _onSelectFile() {
    this.refs.dropzone.open()
  }
  render() {
    const {dropzone_add_state, dropzone_remove_state, bulk_type} = this.props;
    let hover_state, loading_state, loaded_state, filename;
    if (bulk_type === 'add') {
      hover_state = dropzone_add_state.hover_state;
      loading_state = dropzone_add_state.loading_state;
      loaded_state = dropzone_add_state.loaded_state;
      filename = dropzone_add_state.filename;
    } else {
      hover_state = dropzone_remove_state.hover_state;
      loading_state = dropzone_remove_state.loading_state;
      loaded_state = dropzone_remove_state.loaded_state;
      filename = dropzone_remove_state.filename;
    }

    let DropzoneInner;
    if (hover_state) {
      DropzoneInner = <HoveredDropzone />
    } else if (loading_state) {
      DropzoneInner = <LoadingDropzone />
    } else if (loaded_state) {
      DropzoneInner = <LoadedDropzone bulk_type={bulk_type} />
    } else {
      DropzoneInner = <DefaultDropzone onSelectFile={::this._onSelectFile} />
    }
    return(
      <div onDragLeave={::this._onDragLeave}
        style={{
          height:'160px',
          width:'800px',
        }}
      >
        <Dropzone
          ref="dropzone"
          onDrop={::this._onDrop}
          onDragEnter={::this._onDragEnter}
          disableClick={true}
          multiple={false}
          accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.google-apps.spreadsheet"
          className='subscriber-dropzone'
          style={{
            height:'160px',
            width:'800px',
            zIndex: 997,
            position: 'relative',
          }}
        >
          {DropzoneInner}
        </Dropzone>
      </div>
    );
  }
}

@branch({
  add_textarea_value: ['settings', 'subscribers', 'subscriber_add_textarea_value'],
  remove_textarea_value: ['settings', 'subscribers', 'subscriber_remove_textarea_value'],
  uploaded_count: ['settings', 'subscribers', 'uploaded_count'],
  alert: ['alpha_alert'],
})
class BulkAddRemove extends Component {
  _onTextareaChange(e) {
    if (this.props.bulk_type === 'add') {
      this.props.dispatch(
        subscriberAddTextareaChange,
        e.currentTarget.value
      )
    } else {
      this.props.dispatch(
        subscriberRemoveTextareaChange,
        e.currentTarget.value
      )
    }
  }
  _addSubscribers() {
    const error = this.props.dispatch(handleAdd);
    if (!error) {
      this.props.dispatch(
        confirmationToggle,
        'add'
      );
    }
  }
  _removeSubscribers() {
    const error = this.props.dispatch(handleRemove);
    if (!error) {
      this.props.dispatch(
        confirmationToggle,
        'remove'
      );
    }
  }
  render() {
    const {add_textarea_value, remove_textarea_value, bulk_type, alert} = this.props;
    let textarea_value;
    if (bulk_type === 'add') {
      textarea_value = add_textarea_value;
    } else {
      textarea_value = remove_textarea_value;
    }
    return (
      <div className='upload-subscribers'>
        {
          (alert) &&
          <div className='alert-wrapper'>
            <Alert alert={alert} alpha={true} />
          </div>
        }
        {
          (bulk_type === 'add') &&
          <h2>Add Subscribers to Accelerator</h2>
        }
        {
          (bulk_type === 'remove') &&
          <h2>Remove Subscribers from Accelerator</h2>
        }
        <label className='paste-label'>Cut and paste your email subscribers (one address per line)</label>
        <textarea
          placeholder="subscriber@subscribervoice.com"
          value={textarea_value}
          onChange={::this._onTextareaChange}
        />
        <SubscriberDropzone bulk_type={bulk_type} />
        <div className='button-wrapper'>
          {
            (bulk_type === 'add') &&
            <button className="btn btn-confirm" onClick={::this._addSubscribers}>
              Add Subscribers
            </button>
          }
          {
            (bulk_type === 'remove') &&
            <button className="btn btn-confirm" onClick={::this._removeSubscribers}>
              Remove Subscribers
            </button>
          }
        </div>
      </div>
    );
  }
}

export { BulkAddRemove };