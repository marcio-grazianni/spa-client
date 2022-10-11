import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {InputBox} from '../UI/input-box'
import {InputDropdown} from '../UI/input-dropdown'
import {LogoUpload} from './logo-upload'
import {changeValue, saveCompanyInfo} from './actions'

@branch({
  company_name: ['settings', 'inputs', 'company_name'],
  company_url: ['settings', 'inputs', 'company_url'],
  company_tz: ['settings', 'inputs', 'company_tz'],
  reply_to: ['settings', 'inputs', 'reply_to'],
  tax_rate: ['settings', 'inputs', 'tax_rate']
})
class CompanyInfo extends Component {
  _changeValue(value, input_id) {
    this.props.dispatch(
      changeValue,
      value,
      input_id
    )
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(saveCompanyInfo)
  }
  _renderCompanyInfo() {
    const {company_name, company_url, company_tz, reply_to, tax_rate} = this.props;

    // TODO: don't store config info in the global Django library (get rid of that jquery dependancy!!!)
    return (
      <div className="settingsContent" id="account">
        <form className="form-horizontal" id="account" onSubmit={::this._handleSubmit}>
          <h3>Company Info</h3>
          <fieldset id="CompanyInfo">
            <InputBox
              id="company_name"
              title="Company Name"
              tooltip="If you wish to change
              your company name,
              please email us at
              contact@appointpal.com"
              disabled={true}
              input_type="text"
              value={company_name.value}
              changeValue={::this._changeValue}
            />
            <LogoUpload />
            <InputBox
              id="company_url"
              title="Website"
              tooltip="Add your website URL to
              your email/mobile surveys"
              disabled={false}
              input_type="text"
              value={company_url.value}
              error={company_url.error}
              changeValue={::this._changeValue}
            />
            <InputDropdown
              id="company_tz"
              title="Time Zone"
              tooltip="Please select your time zone."
              disabled={false}
              value={company_tz.value}
              Options={Django.timezones}
              changeValue={::this._changeValue}
            />
            <InputBox
              id="tax_rate"
              title="Tax Rate"
              tooltip="Please set a default tax rate for transactions."
              disabled={false}
              value={tax_rate.value}
              input_type="number"
              min={0.0}
              step={0.25}
              changeValue={::this._changeValue}
            />
            <button type="submit" className='btn btn-confirm btn-save'>
              Save Changes
            </button>
            <div className="control-group">
              <label>Terms:</label>
              <div className="controls" style={{margin: "9px 0px 5px 0px"}}>
                <a href="https://www.appointpal.com/provider-terms-baa" target="_blank">
                  Click to view in a separate window <i className="fa fa-external-link" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </fieldset>
        </form>
    </div>
    );
  }
  render() {
    return (
      ::this._renderCompanyInfo()
    );
  }
}

export { CompanyInfo };