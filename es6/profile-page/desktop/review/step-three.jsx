import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {changeContent, changeName, changeEmail, submit} from '../../actions'

@branch({
  review_content: ['review_content'],
  review_name: ['review_name'],
  review_email: ['review_email'],
  errors: ['errors'],
  loading: ['loading'],
})
class StepThreeNegative extends Component {
  _changeContent(e) {
    this.props.dispatch(
      changeContent,
      e.currentTarget.value
    )
  }
  _changeName(e) {
    this.props.dispatch(
      changeName,
      e.currentTarget.value
    )
  }
  _changeEmail(e) {
    this.props.dispatch(
      changeEmail,
      e.currentTarget.value
    )
  }
  _submit() {
    if (!this.props.loading) {
      this.props.dispatch(submit);
    }
  }
  _renderStepThreeNegative() {
    const {review_content, review_name, review_email, errors, loading} = this.props;
    const content_class = classnames('content-input', {error: errors.content});
    const name_class = classnames('name-input', {error: errors.name});
    const email_class = classnames('content-input', {error: errors.email});
    return(
      <div className='validation-question question-three'>
        <h3 className='form'>We're truly sorry to hear your experience wasn't better.<br/>How can we improve?</h3>
        <form className='testimonial-form'>
          {
            (!loading) &&
            <div>
              <textarea
                className={content_class}
                value={review_content}
                onChange={::this._changeContent}
                placeholder="Please write about your experience here..."
              />
              <input
                type='text'
                className={name_class}
                value={review_name}
                onChange={::this._changeName}
                placeholder="Your name"
              />
              <input
                type='email'
                className={email_class}
                value={review_email}
                onChange={::this._changeEmail}
                placeholder="Your email"
              />
              <span className='disclaimer'>
                Your email will never be displayed publicly
              </span>
            </div>
          }
          {
            (loading) &&
            <div className='loading'>
              <i className='fa fa-spin fa-spinner'></i>
            </div>
          }
        </form>
        <div className='button-wrapper'>
          <button
            type='button'
            className='btn btn-next'
            onClick={::this._submit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStepThreeNegative()
    );
  }
}

@branch({
  review_content: ['review_content'],
  review_name: ['review_name'],
  review_email: ['review_email'],
  errors: ['errors'],
  loading: ['loading'],
})
class StepThreePositive extends Component {
  _changeContent(e) {
    this.props.dispatch(
      changeContent,
      e.currentTarget.value
    )
  }
  _changeName(e) {
    this.props.dispatch(
      changeName,
      e.currentTarget.value
    )
  }
  _changeEmail(e) {
    this.props.dispatch(
      changeEmail,
      e.currentTarget.value
    )
  }
  _submit() {
    if (!this.props.loading) {
      this.props.dispatch(submit);
    }
  }
  _renderStepThreePositive() {
    const {review_content, review_name, review_email, errors, loading} = this.props;
    const content_class = classnames('content-input', {error: errors.content});
    const name_class = classnames('name-input', {error: errors.name});
    const email_class = classnames('content-input', {error: errors.email});
    return(
      <div className='validation-question question-three'>
        <h3>Great to hear! Please tell us about your experience.</h3>
        <form className='testimonial-form'>
          {
            (!loading) &&
            <div>
              <textarea
                className={content_class}
                value={review_content}
                onChange={::this._changeContent}
                placeholder="Write your review here..."
              />
              <input
                type='text'
                className={name_class}
                value={review_name}
                onChange={::this._changeName}
                placeholder="Your name"
              />
              <input
                type='email'
                className={email_class}
                value={review_email}
                onChange={::this._changeEmail}
                placeholder="Your email"
              />
              <span className='disclaimer'>
                Your email will never be displayed publicly
              </span>
            </div>
          }
          {
            (loading) &&
            <div className='loading'>
              <i className='fa fa-spin fa-spinner'></i>
            </div>
          }
        </form>
        <div className='button-wrapper'>
          <button
            type='button'
            className='btn btn-next'
            onClick={::this._submit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderStepThreePositive()
    );
  }
}

@branch({
  selected_smile: ['selected_smile']
})
class StepThree extends Component {
  _renderStepThree() {
    const {selected_smile} = this.props;
    return(
      <div className='validation-question question-three'>
        {
          (selected_smile < 3) &&
          <StepThreeNegative />
        }
        {
          (selected_smile >= 3) &&
          <StepThreePositive />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderStepThree()
    );
  }
}

export { StepThree };
