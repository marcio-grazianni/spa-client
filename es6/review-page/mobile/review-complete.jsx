import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({})
class ReviewComplete extends Component {
  _renderReviewComplete() {
    return(
      <div className='survey-complete'>
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
