import React, {Component} from 'react'

class SourceIcon extends Component {
  render() {
    const {slug, ext} = this.props
    return <img src={Django.static(`images/source-icons/${slug}.${ext}`)} />
  }
}

const sourceConfig = {
  Amex: {
    name: 'American Express',
    icon: <SourceIcon ext="png" slug="cc-amex" />,
    color: '#3675c2',
  },
  Discover: {
    name: 'Discover',
    icon: <SourceIcon ext="png" slug="cc-discover" />,
    color: '#ef5d30',
  },
  Mastercard: {
    name: 'Mastercard',
    icon: <SourceIcon ext="png" slug="cc-mastercard" />,
    color: '#db4034',
  },
  Visa: {
    name: 'Visa',
    icon: <SourceIcon ext="png" slug="cc-visa-blue" />,
    color: '#dddddd',
  },
  appointpal: {
    name: 'AppointPal',
    icon: <SourceIcon ext="svg" slug="appointpal" />,
    color: '#5b138d',
  }
};

export default sourceConfig;