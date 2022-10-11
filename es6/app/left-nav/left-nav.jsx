import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import {Link} from 'react-router-component'

class NavLink extends Component {
  render() {
    const {title, url, icon} = this.props.link;
    const canonicalUrl = url === 'patients' ? 'messaging' : url;
    const iconClass = classnames("fa", icon);
    const linkClass = classnames("nav-link", {"current": (canonicalUrl == this.props.section)});
    const href = `/${url}/`;
    return (
      <li className={linkClass}>
        <Link id={`nav-${canonicalUrl}`} href={href}>
          <i className={iconClass} data-tip={title}></i>
          <ReactTooltip place="right" effect="solid" />
        </Link>
      </li>
    )
  }
}

@branch({
  vertical: ['account', 'vertical'],
  vertical_config: ['account', 'vertical_config'],
})
class LeftNav extends Component {
  render() {
    const {section, vertical, vertical_config} = this.props;
    const is_healthcare = 'healthcare' === vertical || 'cosmetic-surgery' === vertical;
    const links = [
      {
        title: 'Patients',
        url: is_healthcare ? 'patients' : 'messaging',
        icon: 'fa-users'
      },
      {
        title: 'Dashboard',
        url: 'dashboard',
        icon: 'fa-dashboard'
      },
      {
        title: 'Feed',
        url: 'feed',
        icon: 'fa-rss'
      },
      {
        title: 'Leaderboard',
        url: 'leaderboard',
        icon: 'fa-bar-chart'
      },
      {
        title: 'Activity',
        url: 'activity',
        icon: 'fa-tasks'
      },
      {
        title: 'Reports',
        url: 'reports',
        icon: 'fa-file-text-o'
      },
      {
        title: 'Widget',
        url: 'widget',
        icon: 'fa-code'
      },
      {
        title: 'Settings',
        url: 'settings',
        icon: 'fa-cogs'
      },
      {
        title: 'Team',
        url: 'team',
        icon: 'fa-user-plus'
      }
    ];
    let NavLinks = links.map((link) => {
      return (
        <NavLink
          key={link.url}
          link={link}
          section={section}
        />
      );
    });
    return (
      <div>
        <div className='account-nav-bg'></div>
        <div id="accountNav" className='newNav'>
          <a id="logo" href={'/messaging/'}>
            <img src={Django.static('images/appointpal/ap-white.svg')} />
          </a>
          <ul className="navigation">
            {NavLinks}
          </ul>
        </div>
      </div>
    );
  }
}

export { LeftNav };