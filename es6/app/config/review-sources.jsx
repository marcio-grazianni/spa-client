import React, {Component} from 'react'

class SourceIcon extends Component {
  render() {
    let Icon;
    const {fa, slug} = this.props
    if (this.props.fa) {
      Icon = <i className={`fa fa-${slug}`}></i>
    } else {
      Icon = <img src={Django.static(`images/source-icons/${slug}.svg`)} />
    }
    return Icon;
  }
}

const sourceConfig = {
  facebook: {
    name: 'Facebook',
    icon: <SourceIcon fa={true} slug="facebook" />,
    color: '#3b5998',
  },
  google: {
    name: 'Google',
    icon: <SourceIcon fa={true} slug="google" />,
    color: '#ea4335',
  },
  google_customer: {
    name: 'Google Customer',
    icon: <SourceIcon fa={true} slug="star" />,
    color: '#f4ac29',
  },
  yelp: {
    name: 'Yelp',
    icon: <SourceIcon fa={true} slug="yelp" />,
    color: '#d32323',
  },
  bbb: {
    name: 'BBB',
    icon: <SourceIcon slug="bbb" />,
    color: '#136796',
  },
  bbb_sv: {
    name: 'BBB',
    icon: <SourceIcon slug="bbb" />,
    color: '#136796',
  },
  trustpilot: {
    name: 'TrustPilot',
    icon: <SourceIcon slug="trustpilot" />,
    color: '#F5911A',
  },
  bizrate: {
    name: 'BizRate',
    icon: <SourceIcon slug="bizrate" />,
    color: '#0065b7',
  },
  resellerratings: {
    name: 'Reseller Ratings',
    icon: <SourceIcon slug="resellerratings" />,
    color: '#d33f97',
  },
  sitejabber: {
    name: 'SiteJabber',
    icon: <SourceIcon slug="sitejabber" />,
    color: '#ec6930',
  },
  yellowpages: {
    name: 'YP',
    icon: <SourceIcon slug="yellow-pages" />,
    color: '#ffd400',
  },
  superpages: {
    name: 'SuperPages',
    icon: <SourceIcon slug="superpages" />,
    color: '#1BB7F9',
  },
  tripadvisor: {
    name: 'TripAdvisor',
    icon: <SourceIcon slug="tripadvisor" />,
    color: '#589442',
  },
  opentable: {
    name: 'OpenTable',
    icon: <SourceIcon slug="opentable" />,
    color: '#da3743',
  },
  consumeraffairs: {
    name: 'ConsumerAffairs',
    icon: <SourceIcon slug="consumeraffairs" />,
    color: '#166ba1',
  },
  zillow: {
    name: 'Zillow',
    icon: <SourceIcon slug="zillow" />,
    color: '#0074e4',
  },
  zillow_mortgage: {
    name: 'Zillow Mortgage',
    icon: <SourceIcon slug="zillow" />,
    color: '#0074e4',
  },
  carscom: {
    name: 'Cars.com',
    icon: <SourceIcon slug="carscom" />,
    color: '#532380',
  },
  edmunds: {
    name: 'Edmunds',
    icon: <SourceIcon slug="edmunds" />,
    color: '#037de5',
  },
  cargurus: {
    name: 'CarGurus',
    icon: <SourceIcon slug="cargurus" />,
    color: '#0096FF',
  },
  dealerrater: {
    name: 'DealerRater',
    icon: <SourceIcon slug="dealerrater" />,
    color: '#e45825',
  },
  dealerratersales: {
    name: 'DealerRater',
    icon: <SourceIcon slug="dealerrater" />,
    color: '#e45825',
  },
  dealerraterservice: {
    name: 'DealerRater',
    icon: <SourceIcon slug="dealerrater" />,
    color: '#e45825',
  },
  g2crowd: {
    name: 'G2 Crowd',
    icon: <SourceIcon slug="g2crowd" />,
    color: '#486574',
  },
  getapp: {
    name: 'GetApp',
    icon: <SourceIcon slug="getapp" />,
    color: '#8ac24a',
  },
  capterra: {
    name: 'Capterra',
    icon: <SourceIcon slug="capterra" />,
    color: '#147cbf',
  },
  shopperapproved: {
    name: 'ShopperApproved',
    icon: <SourceIcon slug="shopperapproved" />,
    color: '#ff9000',
  },
  vitals: {
    name: 'Vitals',
    icon: <SourceIcon slug="vitals" />,
    color: '#3e1952',
  },
  zocdoc: {
    name: 'Zocdoc',
    icon: <SourceIcon slug="zocdoc" />,
    color: '#00214a',
  },
  healthgrades: {
    name: 'healthgrades',
    icon: <SourceIcon slug="healthgrades" />,
    color: '#0202ea',
  },
  ratemds: {
    name: 'RateMDs',
    icon: <SourceIcon slug="ratemds" />,
    color: '#539ea3',
  },
  senioradvisor: {
    name: 'SeniorAdvisor',
    icon: <SourceIcon slug="senioradvisor" />,
    color: '#9e7bae',
  },
  caring: {
    name: 'Caring.com',
    icon: <SourceIcon slug="caring" />,
    color: '#69af3a',
  },
  subscribervoice: {
    name: 'SubscriberVoice',
    icon: <SourceIcon slug="subscribervoice" />,
    color: '#4192b6',
  },
  realself: {
    name: 'RealSelf',
    icon: <SourceIcon slug="realself" />,
    color: '#ff8580',
  },
  appointpal: {
    name: 'AppointPal',
    icon: <SourceIcon slug="appointpal" />,
    color: '#5b138d',
  },
};

export default sourceConfig;
