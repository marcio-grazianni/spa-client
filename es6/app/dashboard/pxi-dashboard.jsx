import React, {Component} from 'react'
import {TopSection} from './pxi/top-section'
import {BottomSection} from './pxi/bottom-section'


class PXIDashboard extends Component {
  renderPXIDashboard() {
    return (
      <div className='main-container'>
        <TopSection />
        <BottomSection />
      </div>
    );
  }
  render() {
    return ::this.renderPXIDashboard();
  }
}

export { PXIDashboard };