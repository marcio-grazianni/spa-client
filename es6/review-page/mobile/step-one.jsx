import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {selectSmile} from '../actions'

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
  _renderSmile() {
    const {value} = this.props;
    return(
      <div className='smile col-xs-2'>
        <div className='box'>
          <div
            className='img-wrapper'
            onClick={::this._selectSmile}
            onTouchStart={::this._selectSmile}
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
          <div className='smiles-inner-wrapper'>
            <div className='smiles row around-xs'>
              {SmileComponents}
            </div>
          </div>
          <div className='label-text-wrapper'>
            <div className='left'>
              <label>Very Poor</label>
            </div>
            <div className='right'>
              <label>Great</label>
            </div>
          </div>
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
