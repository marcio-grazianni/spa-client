import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeLocationInputValue, addLocationInput} from '../actions'

@branch({
  location_inputs: ['location_inputs'],
})
class LocationPrompt extends Component {
  componentDidMount() {
  }
  _changeValue(e) {
    this.props.dispatch(
      changeLocationInputValue,
      e.currentTarget.name,
      e.currentTarget.value,
    );
  }
  _submitLocationPrompt(e) {
    e.preventDefault();
    debugger
  }
  _addLocationInput() {
    this.props.dispatch(
      addLocationInput
    );
  }
  _renderLocationPrompt() {
    const {location_inputs} = this.props;
    const LocationInputComponents = location_inputs.map((location) =>
      <div className='input-wrapper' key={location.name}>
        <label>{location.label}:</label>
        <input
          type='text'
          name={location.name}
          value={location.value}
          onChange={::this._changeValue}
        />
      </div>
    );
    return (
    <div className="contact-wrapper location-wrapper">
      <div className='logo'>
        <img src={Django.static('images/SV_EnvelopeNew3.svg')} />
      </div>
      <h3>Add Locations</h3>
      <form onSubmit={::this._submitLocationPrompt}>
        {LocationInputComponents}
        <div className='add-more' onClick={::this._addLocationInput}>
          <i className='fa fa-plus-circle'></i> Add additional
        </div>
        <button type='submit' className='btn btn-confirm'>
          Submit
        </button>
      </form>
    </div>
    );
  }
  render() {
    return (
      ::this._renderLocationPrompt()
    );
  }
}

export { LocationPrompt };