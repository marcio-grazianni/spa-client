import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import {clientTextareaChange, toggleDropzoneHover, handleDrop, resetClientList, handleUpload} from './actions'

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
  file_client_count: ['appointpal', 'upload_form', 'file_client_count'],
  invalid_count: ['appointpal', 'upload_form', 'invalid_count'],
  filename: ['appointpal', 'upload_form', 'filename'],
})
class LoadedDropzone extends Component {
  _resetClientList() {
    this.props.dispatch(resetClientList);
  }
  render() {
    const {file_client_count, invalid_count, filename} = this.props;
    return(
      <div className='dropzone'>
        <div className='upload-loaded'>
          <div className='upload-file'>
            <img src={Django.static("images/uploaded-file.svg")} />
          </div>
          <div className='drag-prompt loaded'>
            <label className='drag-label'>
              <b>{file_client_count} patient(s)</b> added from <b>{filename}</b>
            </label>
            {
              (invalid_count > 0) &&
              <br/>
            }
            {
              (invalid_count == 1) &&
              <label className='drag-label'>
                <b>{invalid_count}</b> invalid record was ignored.
              </label>
            }
            {
              (invalid_count > 1) &&
              <label className='drag-label'>
                <b>{invalid_count}</b> invalid records were ignored.
              </label>
            }
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
              Drag and drop a file with your patient information in comma-separated format. All .xls, .xlsx or .csv files are supported.
            </label>
            <label className='drag-label'>
              Patient fields: first name<sup>*</sup>, last name<sup>*</sup>, email<sup>*</sup>, mobile phone number<sup>*</sup>, date of birth (MM/DD/YYYY), street address, city, state, zip code.
            </label>
            <label className='drag-label-disclaimer'>
              <sup>*</sup>Name and email OR phone number are required.
            </label>
          </div>
        </div>
      </div>
    );
  }
}

@branch({
  dropzone_state: ['appointpal', 'upload_form', 'dropzone'],
  uploading: ['appointpal', 'upload_form', 'uploading']
})
class ClientsDropzone extends Component {
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
  render() {
    const {uploading} = this.props;
    const {hover_state, loading_state, loaded_state, filename} = this.props.dropzone_state;

    let DropzoneInner;
    if (hover_state) {
      DropzoneInner = <HoveredDropzone />
    } else if (loading_state || uploading) {
      DropzoneInner = <LoadingDropzone />
    } else if (loaded_state && !uploading) {
      DropzoneInner = <LoadedDropzone />
    } else {
      DropzoneInner = <DefaultDropzone />
    }
    return(
      <div onDragLeave={::this._onDragLeave}
        style={{
          height:'190px',
          width:'100%',
        }}
      >
        <Dropzone
          ref="dropzone"
          onDrop={::this._onDrop}
          onDragEnter={::this._onDragEnter}
          disableClick={true}
          multiple={false}
          accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.google-apps.spreadsheet"
          className='clients-dropzone'
          style={{
            height:'190px',
            width:'100%',
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
  textarea_value: ['appointpal', 'upload_form', 'textarea_value'],
  uploaded_count: ['appointpal', 'upload_form', 'uploaded_count'],
})
class UploadClients extends Component {
  _onTextareaChange(e) {
    this.props.dispatch(
      clientTextareaChange,
      e.currentTarget.value
    )
  }
  render() {
    const {textarea_value} = this.props;
    return (
      <div className='upload-clients'>
        <ClientsDropzone />
      </div>
    );
  }
}

export { UploadClients };