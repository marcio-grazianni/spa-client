import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Dropzone from 'react-dropzone'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import {changeLogo} from './actions'

@branch({
  company_logo: ['settings', 'inputs', 'company_logo'],
})
class LogoUpload extends Component {
  _onDrop(files) {
    this.props.dispatch(
      changeLogo,
      files
    )
  }
  _uploadLogo() {
    this.refs.dropzone.open()
  }
  _renderLogoUpload() {
    const {error, company_logo} = this.props;
    const logo_wrapper_class = classnames("logoWrapper", {logo_error: company_logo.error});
    // Default to blank logo
    let logo_img = <img className="logo" />
    if (company_logo.preview) {
      // if preview is set we show logo preview
      logo_img = <img className="logo" src={company_logo.preview} />
    }
    else if (company_logo.value) {
      // otherwise we show the logo source...
      // TODO: don't hold media_url info in global variable... you know this
      logo_img = <img className="logo" src={Django.media_url + company_logo.value} />
    }
    return (
      <div className="control-group logo">
        <label>Logo: <span>
            <i className="fa fa-info-circle" data-tip data-for='logo-upload-tooltip' />
            <ReactTooltip id='logo-upload-tooltip' multiline effect='solid'>
              <span>Upload your company logo to further customize your email/mobile surveys.<br /> Recommended size is 180px x 100px; recommended format is jpeg or png.</span>
            </ReactTooltip>
          </span>
        </label>
        {
          (company_logo.error) &&
          <div className='errorHolder'>
            <span className='error'>{company_logo.error}</span>
          </div>
        }
        <Dropzone onDrop={::this._onDrop} ref="dropzone" style={{}}>
          <div className={logo_wrapper_class}>
            {logo_img}
          </div>
        </Dropzone>
        <button
          className="btn btn-confirm uploadLogo"
          onClick={::this._uploadLogo}
          type="button"
        >
          Upload Logo
        </button>
      </div>
    );
  }
  render() {
    return (
      ::this._renderLogoUpload()
    );
  }
}

export { LogoUpload };