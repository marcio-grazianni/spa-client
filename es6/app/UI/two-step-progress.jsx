import React, {Component} from 'react'
import classnames from 'classnames'

class ProgressCircle extends Component {
  render() {
    const {step, titles, active_step} = this.props;
    const circle_class = classnames('circle-wrapper', {incomplete: (step > active_step), active: (step <= active_step)});

    return(
      <div className={circle_class}>
        <div className='progress-circle'>
          {
            (step < active_step) &&
            <i className='fa fa-check'></i>
          }
          {
            (step >= active_step) &&
            <span>{step}</span>
          }
        </div>
        <label className='circle-label'>
          {titles[step - 1]}
        </label>
      </div>
    );
  }
}

class TwoStepProgress extends Component {
  render() {
    return(
      <div className='two-step-progress'>
        <ProgressCircle
          step={1}
          {...this.props}
        />
        <div className='divider first'>
        </div>
        <ProgressCircle
          step={2}
          {...this.props}
        />
    </div>
    );
  }
}

export { TwoStepProgress };
