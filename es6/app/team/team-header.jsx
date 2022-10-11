import React, {Component} from 'react'
import {SectionHeader} from '../UI/section-header'

class TeamHeader extends Component {
  _renderTeamHeader() {
    return (
      <SectionHeader
        id="team"
        icon="fa-user-plus"
        title="Team"
        datePickerEnabled={false}
      />
    );
  }
  render() {
    return (
      ::this._renderTeamHeader()
    );
  }
}

export { TeamHeader };