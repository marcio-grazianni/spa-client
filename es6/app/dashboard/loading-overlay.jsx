import React, {Component} from 'react'

class LoadingOverlay extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className='loading-overlay'>
        <div className='img'>
          <i className='fa fa-spin fa-spinner'></i>
        </div>
      </div>
    );
  }
}

export { LoadingOverlay };