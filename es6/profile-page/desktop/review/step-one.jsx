import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {setHoverState, selectSmile} from '../../actions'

@branch({
  loading: ['loading'],
})
class Smile extends Component {
  _selectSmile() {
    if (!this.props.loading) {
      this.props.dispatch(
        selectSmile,
        this.props.value
      );
    }
  }
  _setHoveredSmile(e) {
    this.props.dispatch(
      setHoverState,
      this.props.value,
      true
    )
  }
  _unsetHoveredSmile(e) {
    this.props.dispatch(
      setHoverState,
      this.props.value,
      false
    )
  }
  _renderSmile() {
    const {value} = this.props;
    return(
      <div className='smile col-xs-2'>
        <div className='box'>
          <div
            className='img-wrapper'
            onClick={::this._selectSmile}
            onTouchStart={::this._selectSmile}
            onMouseEnter={::this._setHoveredSmile}
            onMouseLeave={::this._unsetHoveredSmile}
          >
            <div className='inner-wrapper'>
              <img src={Django.static(`images/smiles/smile-${value}.svg`)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSmile()
    );
  }
}

@branch({
  account_name: ['account_name'],
  hovered_smile: ['hovered_smile'],
  vertical: ['vertical'],
})
class StepOne extends Component {
  _renderStepOne() {
    const {account_name, hovered_smile, vertical} = this.props;

    // TODO: create a constants/config file for all configurable text arrays
    const HoverResponses = [{'response': "Very Poor", 'description': "I absolutely wouldn't recommend to a friend"}, {'response': "Poor", 'description': "I wouldn't recommend to a friend"}, {'response': "OK", 'description': "unlikely I would recommend to a friend"}, {'response': "Good", 'description': "I would recommend to a friend"}, {'response': "Great", 'description': "I would absolutely recommend to a friend"}];
    let SmileComponents = Array(5).fill().map((_,value) => {
      return (
        <Smile value={value} key={value} />
      )
    });
    return(
      <div className='validation-question question-one'>
        {
          (vertical === 'healthcare') &&
          <h3>Please rate your visit with {account_name}.</h3>
        }
        {
          !(vertical === 'healthcare') &&
          <h3>Please rate your experience with {account_name}.</h3>
        }
        <div className='smiles-wrapper'>
          <div className='smiles row around-xs'>
            {SmileComponents}
          </div>
        </div>
        <div className='hover-text-wrapper'>
          {
            (hovered_smile !== false) &&
            <label><b>{HoverResponses[hovered_smile]['response']}:</b> {HoverResponses[hovered_smile]['description']}</label>
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStepOne()
    );
  }
}

export { StepOne };
