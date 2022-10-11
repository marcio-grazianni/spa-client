import React, {Component} from 'react'
import {SectionHeader} from '../UI/section-header'

class SealHeader extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderSealHeader() {
    return (
      <SectionHeader
        id="seal"
        icon="fa-code"
        title="Seal"
        datePickerEnabled={false}
      />
    );
  }
  render() {
    return (
      ::this._renderSealHeader()
    );
  }
}

export { SealHeader };