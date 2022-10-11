import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Select from 'react-select'
import {changeEditForm} from '../actions'

@branch({
  message_seal: ['seal', 'message_seal']
})
class EditForm extends Component {
  _formatChange(payload) {
    this.props.dispatch(
      changeEditForm,
      'format',
      payload.value,
    )
  }
  _iconChange(payload) {
    this.props.dispatch(
      changeEditForm,
      'icon',
      payload.value,
    )
  }
  _borderChange(payload) {
    this.props.dispatch(
      changeEditForm,
      'border',
      payload.value,
    )
  }
  _CTAChange(payload) {
    this.props.dispatch(
      changeEditForm,
      'call_to_action',
      payload.value,
    )
  }
  _renderEditForm() {
    // TODO: Bring options into seperate config file
    const FormatOptions = [
      {value:"vertical", label:"Vertical Seal"},
      {value:"horizontal", label:"Horizontal Seal"},
    ]
    const IconOptions = [
      {value:"faces", label:"Happy | Sad"},
      {value:"thumbs", label:"Thumbs Up | Thumbs Down"},
    ]
    const BorderOptions = [
      {value:"border", label:"Display Border"},
      {value:"none", label:"Hide Border"},
    ]
    const CTAOptions = [
      {value:"How are we doing?", label:"How are we doing?"},
      {value:"Leave a review", label:"Leave a review"},
      {value:"Review us", label:"Review us"},
      {value:"Rate us", label:"Rate us"},
    ]
    const {format, icon, border, call_to_action} = this.props.message_seal;
    return(
      <div className='seal-builder-form'>
        <div className='input-wrapper'>
          <label>Format</label>
          <div className='onboarding-input'>
            <Select
              name='format-select'
              value={format}
              searchable={false}
              clearable={false}
              options={FormatOptions}
              onChange={::this._formatChange}
            />
          </div>
        </div>
        <div className='input-wrapper'>
          <label>Icon</label>
          <div className='onboarding-input'>
            <Select
              name='icon-select'
              value={icon}
              searchable={false}
              clearable={false}
              options={IconOptions}
              onChange={::this._iconChange}
            />
          </div>
        </div>
        <div className='input-wrapper'>
          <label>Border</label>
          <div className='onboarding-input'>
            <Select
              name='border-select'
              value={border}
              searchable={false}
              clearable={false}
              options={BorderOptions}
              onChange={::this._borderChange}
            />
          </div>
        </div>
        <div className='input-wrapper'>
          <label>Call to Action</label>
          <div className='onboarding-input'> 
            <Select
              name='CTA-select'
              value={call_to_action}
              searchable={false}
              clearable={false}
              options={CTAOptions}
              onChange={::this._CTAChange}
            />
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      ::this._renderEditForm()
    );
  }
}

export { EditForm };