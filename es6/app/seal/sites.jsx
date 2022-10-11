import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Link} from 'react-router-component'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import {toggleUpgradePrompt} from '../actions'
import {toggleExpandedSection} from './actions'
import sourceConfig from '../config/review-sources'
import defaultSources from '../config/default-sources'


@branch({
  generators: ['generators'],
  current_sources: ['settings', 'review_sites', 'current_sources'],
  paid_account: ['account', 'paid_account'],
  vertical: ['account', 'vertical'],
})
class ReviewSites extends Component {
  _onSiteClick() {
    this.props.dispatch(toggleUpgradePrompt);
  }
  _renderReviewSites() {
    const {generators, current_sources, paid_account, vertical} = this.props;
    let SiteComponents = [];
    let default_sources = [];
    // TO DO: Factor these out into component functions
    if (!paid_account) {
      if (vertical) {
        default_sources = defaultSources[vertical.replace(/-/g, "")];
      }
      SiteComponents = default_sources.map((slug) => {
        const config_info = sourceConfig[slug.replace(/-/g, "")];
        const {icon, color} = config_info;
        return (
          <a key={slug} onClick={::this._onSiteClick}>
            <span
              className={classnames('icon', slug, 'locked')}
              style={{background: color}}
            >
              {icon}
            </span>
          </a>
        )
      });
      const sv_config = sourceConfig['subscribervoice'];
      let SVComponent =
        <a key='subscribervoice' onClick={::this._onSiteClick}>
          <span
            className='icon subscribervoice sv-unpaid'
            style={{background: sv_config.color}}
          >
            {sv_config.icon}
          </span>
        </a>
      SiteComponents.push(SVComponent);
    } else {
      if (generators) {
        SiteComponents = current_sources.map((obj) => {
          const config_info = sourceConfig[obj.slug.replace(/-/g, "")];
          const {icon, color} = config_info;
          if (obj.url !== "" && obj.active) {
            return (
              <Link key={obj.slug} href='/settings/'>
                <span
                  data-tip
                  data-for="review-generators"
                  data-place="top"
                  data-effect="solid"
                  className={`icon ${obj.slug}`}
                  style={{background: color}}
                >
                  {icon}
                </span>
              </Link>
            );
          } else {
            return null;
          }
        });
        // Always include SV as a source at the end
        SiteComponents = SiteComponents.slice(0,4);
        const sv_config = sourceConfig['subscribervoice'];
        let SVComponent =
          <Link key="subscribervoice" href='/settings/'>
            <span
              data-tip
              data-for="review-generators"
              data-place="top"
              data-effect="solid"
              className='icon subscribervoice'
              style={{background: sv_config.color}}
            >
              {sv_config.icon}
            </span>
          </Link>
        SiteComponents.push(SVComponent);
      }
    }
    return(
      <div className='button-wrapper'>
        {
         (SiteComponents.length > 0) &&
          <div>
            {SiteComponents}
            <ReactTooltip id="review-generators" multiline>
              <span>Add new review sources and change the display order
              <br/>in the review sources section of settings.</span>
            </ReactTooltip>
          </div>
        }
        {
          (SiteComponents.length === 0) &&
          <div className='no-sites'>
            <h4>You haven't added any review sources</h4>
            <Link className='btn btn-next' href='/settings/'>Add Source</Link>
          </div>
        }
      </div>
    )
  }
  render() {
    return (
      ::this._renderReviewSites()
    );
  }
}

@branch({
  expanded: ['seal', 'expanded', 'sites'],
  generators: ['generators'],
})
class Sites extends Component {
  _expandSites() {
    this.props.dispatch(
      toggleExpandedSection,
      'sites'
    )
  }
  _renderSites() {
    const {expanded, generators} = this.props;
    let expanded_icon;
    if (expanded) {
      expanded_icon = <i className='fa fa-chevron-down'></i>
    } else {
      expanded_icon = <i className='fa fa-chevron-up'></i>
    }
    return(
      <li className='sites'>
        <label className='edit-label' onClick={::this._expandSites}>
          <span className='section-name'><i className='fa fa-power-off'></i>Review Sources</span>
          <span className='toggle-section'>{expanded_icon}</span>
        </label>
        {
          (expanded) &&
          <ReviewSites />
        }
      </li>
    )
  }
  render() {
    return (
      ::this._renderSites()
    );
  }
}

export { Sites };