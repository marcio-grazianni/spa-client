import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {closeReviewComplete} from '../actions'

@branch({})
class ReviewComplete extends Component {
  _closeReviewComplete() {
    this.props.dispatch(closeReviewComplete)
  }
  _renderReviewComplete() {
    let mainClass = classnames('survey-complete', 'appointpal');
    return(
      <div className={mainClass}>
        <div className='validation-survey'>
          <div className='validation-question question-three appointpal'>
            <h2>Thanks!</h2>
          </div>
          <div className='footer appointpal'>
            <p>Powered by <img src={Django.static('images/appointpal/banner-logo.svg')} /></p>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReviewComplete()
    );
  }
}

export { ReviewComplete };
