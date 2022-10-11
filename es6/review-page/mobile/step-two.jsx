import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleStepThree} from '../actions'
import sourceConfig from '../../app/config/review-sources'

class ReviewButton extends Component {
  render() {
    const {slug, url} = this.props.review_source;
    let source_key = slug.replace(/-/g, "");
    const config_info = sourceConfig[source_key];
    const {icon, name, color} = config_info;
    return(
      <a
        className={`btn btn-next btn-${slug}`}
        referrerPolicy="no-referrer"
        href={url}
        target="_blank"
        style={{background: color}}
      >
        {icon}Review us on {name}
      </a>
    );
  }
}

@branch({
  review_sources: ['review_sources'],
})
class StepTwo extends Component {
  _toggleStepThree() {
    this.props.dispatch(toggleStepThree)
  }
  _renderStepTwo() {
    const {review_sources} = this.props;
    const ReviewButtonComponents = review_sources.map((review_source) =>
      <ReviewButton key={review_source.review_source_id} review_source={review_source} />
    );
    return(
      <div className='validation-question question-two'>
        <div>
          <h3>Great to hear! Please tell us about your experience.</h3>
          <div className='button-wrapper'>
            {ReviewButtonComponents}
              <button
                type='button'
                className='btn btn-next btn-appointpal'
                onClick={::this._toggleStepThree}
              >
                <img className='ap-icon' src={Django.static('images/appointpal/ap-white.svg')} />
                Review us on appointpal
              </button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStepTwo()
    );
  }
}

export { StepTwo };
