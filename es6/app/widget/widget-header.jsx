import React, {Component} from 'react'
import {SectionHeader} from '../UI/section-header'

class WidgetHeader extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderWidgetHeader() {
    return (
      <SectionHeader
        id="widget"
        icon="fa-code"
        title="Widget"
        datePickerEnabled={false}
      />
    );
  }
  render() {
    return (
      ::this._renderWidgetHeader()
    );
  }
}

export { WidgetHeader };