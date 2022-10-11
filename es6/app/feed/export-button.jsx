import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {toggleFeatureLock, exportFeed} from './actions'

@branch({
  paid_account: ['account', 'paid_account'],
  grandfathered: ['account', 'grandfathered'],
})
class ExportButton extends Component {
  _export () {
    //TODO: Implement export feature
    if (!this.props.paid_account && !this.props.grandfathered) {
      this.props.dispatch(toggleFeatureLock);
      return false
    }
    this.props.dispatch(exportFeed);
  }
  _renderExportButton () {
    return (
      <button
        type='button'
        className='btn btn-confirm btn-export'
        onClick={::this._export}
      >
        Export
      </button>
    );
  }
  render() {
    return (
      ::this._renderExportButton()
    );
  }
}

export { ExportButton };