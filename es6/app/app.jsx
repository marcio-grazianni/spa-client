import React, {Component} from 'react'
import {root, branch} from 'baobab-react/higher-order'
import {Locations as Router, Location, Link, NotFound} from 'react-router-component'
import tree from './state'
import {Tutorial} from './tutorial'
import {Dashboard} from './dashboard/dashboard'
import {Feed} from './feed/feed'
import {Testimonials} from './testimonials/testimonials'
import {Messaging} from './messaging/messaging'
import {Seal} from './seal/seal'
import {Widget} from './widget/widget'
import {Reports} from './reports/reports'
import {Locations} from './locations/locations'
import {Leaderboard} from './leaderboard/leaderboard'
import {Settings} from './settings/settings'
import {Team} from './team/team'
import {Activity} from './activity/activity'
import {initialLoad, handleNavigation, handleTutorialNavigation} from './actions'

class NotFoundPage extends Component { //Avoid Namespace Collision
 render() {
    return (
      <div>Not Found
      </div>
    );
  }
}

@branch({
  tutorial_active: ['account', 'tutorial_active'],
  tutorial_auto_start: ['account', 'tutorial_auto_start'],
  vertical_config: ['account', 'vertical_config'],
})
class App extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  _onBeforeNavigation() {
    this.props.dispatch(handleNavigation)
  }
  _tutorialNavigation(routerHref) {
    this.props.dispatch(
      handleTutorialNavigation,
      this.refs.router,
      routerHref,
    );
  }
  render() {
    const {tutorial_active, tutorial_auto_start} = this.props;
    const pages = [
      {
        handler: Dashboard,
        url: 'dashboard',
      },
      {
        handler: Feed,
        url: 'feed',
      },
      {
        handler: Messaging,
        url: 'messaging',
      },
      {
        handler: Messaging,
        url: 'patients',
      },
      {
        handler: Widget,
        url: 'widget',
      },
      {
        handler: Reports,
        url: 'reports',
      },
      {
        handler: Leaderboard,
        url: 'leaderboard',
      },
      {
        handler: Settings,
        url: 'settings',
      },
      {
        handler: Team,
        url: 'team',
      },
      {
        handler: Activity,
        url: 'activity'
      }
    ];
    let PageComponents = pages.map((page) => {
      return (
        <Location key={page.url} path={`/${page.url}/`} handler={page.handler} />
      );
    });
    PageComponents = PageComponents.filter((page) => {
      if (page) {
        return true;
      } else {
        return false;
      }
    });
    // add invite path and upgrade component
    PageComponents.push(<Location key='invite' path="/invite/(*)/" handler={Dashboard} />);
    PageComponents.push(<Location key='upgrade' path="/upgrade/" handler={Dashboard} />);
    // add special use case email setting
    PageComponents.push(<Location key='email-settings-invite' path="/email-settings/(*)/" handler={Settings} />);
    PageComponents.push(<Location key='email-settings' path="/email-settings/" handler={Settings} />);
    PageComponents.push(<NotFound key='not-found' handler={NotFoundPage} />);
    return(
      <div>
        {
          (tutorial_active) &&
          <Tutorial navigate={::this._tutorialNavigation} auto_start={tutorial_auto_start} />
        }
        <Router ref="router" onBeforeNavigation={::this._onBeforeNavigation}>
          {PageComponents}
        </Router>
      </div>
    );
  }
}

@root(tree)
class AppWrapper extends Component {
  _renderAppWrapper() {
    return(
      <App />
    );
  }
  render() {
    return(
      ::this._renderAppWrapper()
    );
  }
}

module.exports = AppWrapper;
