import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import Joyride from 'react-joyride'
import {toggleReviewInvitePrompt} from './actions'
import {completeTutorial} from './onboarding/actions'

@branch({
  vertical_config: ['account', 'vertical_config'],
  vertical: ['account', 'vertical'],
  tutorial_active: ['account', 'tutorial_active'],
  paid_account: ['account', 'paid_account']
})
class Tutorial extends Component {
  _tutorialCallback(e) {
    // making sure we always navigate to page of current tutorial step
    // when we are changing tutorial step
    if ((e.action === 'start') && (e.type === 'step:before')) {
      this.props.navigate(e.step.routerHref);
    }
    if (e.action === 'mouseenter') {
      this.props.navigate(e.step.routerHref);
    }
    if ((e.action === 'next') && (e.type === 'step:before')) {
      this.props.navigate(e.step.routerHref);
    }
    if ((e.action === 'back') && (e.type === 'tooltip:before')) {
      this.props.navigate(e.step.routerHref);
    }
    if ((e.action === 'skip') && (e.type === 'step:after')) {
      this.props.navigate('/patients/');
      this.props.dispatch(
        completeTutorial
      );
    }
    if ((e.action !== 'skip') && (e.type === 'finished')) {
      this.props.navigate('/patients/');
      this.props.dispatch(
        completeTutorial
      );
    }
  }
  render() {
    const {vertical} = this.props;
    const tutorial_style = {
      backgroundColor: '#3A465E',
      borderRadius: 5,
      width: '500px',
      beacon: {
        inner: '#4192b6',
        outer: '#76B3CE',
      },
      close: {
        display: 'none',
      },
      header: {
        border: 'none',
        fontWeight: 600,
        paddingBottom: '2px',
        color: '#fff',
      },
      main: {
        padding: '0px',
        fontSize: '14px',
        fontWeight: 300,
        color: '#fff',
      },
      footer: {
        marginTop: '15px',
      },
    }

    let steps = [
      {
        feature: 'patients',
        title: 'Patient Support Portal',
        text: 'All of your appointment matches are displayed here in the patient support portal. Coordinate new appointment requests, initiate payments, send review invites, and maintain a complete picture of every patient interaction. You can also customize your implementation with dozens of EHR/PMS integrations.',
        selector: '#nav-messaging',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/patients/',
        style: tutorial_style
      },
      {
        feature: 'dashboard',
        title: 'Dashboard',
        text: `See all revenue generated through the platform and your overall provider reputation from a single centralized location. AppointPal's Provider Experience Index (PXI) is used to match prospective patients with the highest quality providers. Monitor what prospective patients see online as they’re being connected to your practice.`,
        selector: '#nav-dashboard',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/dashboard/',
        style: tutorial_style
      },
      {
        feature: 'feed',
        title: 'Feed',
        text: 'View all of your payments and reviews as they happen.',
        selector: '#nav-feed',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/feed/',
        style: tutorial_style
      },
      {
        feature: 'leaderboard',
        title: 'Leaderboard',
        text: 'See which staff members are most helpful in assisting patients with appointments.',
        selector: '#nav-leaderboard',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/leaderboard/',
        style: tutorial_style
      },
      {
        feature: 'activity',
        title: 'Activity',
        text: 'See the current status of payments, invoices, and reviews activity as they happen.',
        selector: '#nav-activity',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/activity/',
        style: tutorial_style
      },
      {
        feature: 'reports',
        title: 'Reports',
        text: 'Monitor reports that help correlate your online reputation and overall financial performance.',
        selector: '#nav-reports',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/reports/',
        style: tutorial_style
      },
      {
        feature: 'widget',
        title: 'Widget',
        text: 'Add the website widget to your site to generate more new appointments.',
        selector: '#nav-widget',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/widget/',
        style: tutorial_style
      },
      {
        feature: 'settings',
        title: 'Settings',
        text: 'Update your password and manage account info.',
        selector: '#nav-settings',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/settings/',
        style: tutorial_style
      },
      {
        feature: 'team',
        title: 'Team',
        text: 'Send email invites to colleagues you would like to add to your team.',
        selector: '#nav-team',
        position: 'right',
        type: 'hover',
        isFixed: true,
        routerHref: '/team/',
        style: tutorial_style
      },
      {
        feature: 'payments',
        title: 'Get paid fast',
        text: 'Payments are seamlessly integrated to ensure you get paid on time for each appointment you receive through AppointPal.',
        selector: 'span.location-info span.location-name',
        position: 'bottom',
        type: 'hover',
        isFixed: true,
        routerHref: '/patients/',
        style: tutorial_style
      }
    ]
    const {auto_start} = this.props;
    const finalCopy = 'Activate Payments';
    return(
      <Joyride
        ref="joyride"
        autoStart={auto_start}
        steps={steps}
        locale={{back: 'Back', close: 'Close', last: finalCopy, next: 'Next', skip: 'Skip Tutorial'}}
        run={true}
        debug={true}
        showSkipButton={false}
        callback={::this._tutorialCallback}
        disableOverlay={true}
        type="continuous"
      />
    );
  }
}

export {Tutorial};
