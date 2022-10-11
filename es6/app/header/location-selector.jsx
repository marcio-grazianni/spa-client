import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {selectRelatedAccount, selectProvider} from '../actions'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'
import {StarRating} from '../UI/star-rating'

const noProvider = "--------------------";

@branch({})
class LocationMenuItem extends Component {
  _selectLocation() {
    this.props.dispatch(
      selectRelatedAccount,
      this.props.id,
    );
  }
  render() {
    const {name, rating} = this.props;
    return (
      <li onClick={::this._selectLocation}>
        <div className="location-menu-item">
          <i className="fa fa-location-arrow"></i> {name}
          {
            (rating >= 0) &&
            <div className='rating'>
              <StarRating rating={rating} />
              <span className='numeric-rating'>{rating.toFixed(1)}</span>
            </div>
          }
        </div>
      </li>
    )
  }
}


@branch({})
class ProviderMenuItem extends Component {
  _selectProvider() {
    const {id, full_name} = this.props;
    const provider = {
      'id': id,
      'name': full_name
    }
    this.props.dispatch(
      selectProvider,
      provider,
    );
  }
  render() {
    const {name} = this.props;
    return (
      <li onClick={::this._selectProvider}>
        <div className="provider-menu-item">
          {name}
        </div>
      </li>
    )
  }
}


class LocationToggleInner extends Component {
  render() {
    return (
        <span className="icon">
          <i className="fa fa-location-arrow"></i>
        </span>
    );
  }
}

@branch({
  account_name: ['account', 'account_name'],
  account_summary: ['account', 'account_summary'],
  selected_provider: ['account', 'selected_provider'],
})
class ProviderToggleInner extends Component {
  render() {
    const {selected_provider} = this.props;
    let label = noProvider;
    if (selected_provider) {
      label = selected_provider.name;
    }
    return (
        <div>
          <span className="provider-info">
            <span className="provider-icon">
              <i className="fa fa-user-md"></i>
            </span>
            {label}
            <span className="caret-down">
              <i className="fa fa-caret-down"></i>
            </span>
          </span>
        </div>
    );
  }
}

@branch({
  account_name: ['account', 'account_name'],
  account_summary: ['account', 'account_summary'],
  rating: ['account', 'rating'],
  location_list: ['account', 'related_accounts'],
  locations_visible: ['drop_down', 'location_selector', 'visible'],
  provider_list: ['account', 'providers'],
  providers_visible: ['drop_down', 'provider_selector', 'visible'],
})
class LocationSelector extends Component {
  _deselectProvider() {
    this.props.dispatch(
      selectProvider,
      null
    );
  }
  _inputClick(e) {
    e.stopPropagation();
  }
  _renderLocationSelector() {
    const {account_name, account_summary, rating, location_list, locations_visible, provider_list, providers_visible} = this.props;
    let name = account_name;
    if(account_summary) {
      name = account_summary.name;
    }
    let star_rating = rating;
    let LocationMenuItems = [];
    if (location_list) {
      LocationMenuItems = location_list.map((location) =>
        <LocationMenuItem
          key={location.id}
          {...location}
        />
      );
    }
    let ProviderMenuItems = [];
    if (provider_list) {
      ProviderMenuItems = provider_list.map((provider) =>
        <ProviderMenuItem
          key={provider.id}
          {...provider}
        />
      );
    }
    return (
      <div className="location-selector wrapper dropdown-wrapper open">
        <div className="multi-selector">
          {  LocationMenuItems.length > 0 &&
              <DropDownToggle id="location_selector" className="location-selector">
                <LocationToggleInner/>
              </DropDownToggle>
          }
          {  LocationMenuItems.length === 0 &&
              <LocationToggleInner/>
          }
          <span className="location-info">
            <span className="location-name">
              {name}
            </span>
            {
              (star_rating >= 0) &&
              <StarRating rating={star_rating} />
            }
            <DropDownToggle id="provider_selector" className="provider-selector">
              <ProviderToggleInner />
            </DropDownToggle>
          </span>
        </div>
        {
          locations_visible &&
          <DropDownMenu id="location_selector" className="location-selector" {...this.props}>
            {LocationMenuItems}
          </DropDownMenu>
        }
        {
          providers_visible &&
          <DropDownMenu id="provider_selector" className="provider-selector" {...this.props}>
            <li onClick={::this._deselectProvider}>
              <div className="provider-menu-item">
                {noProvider}
              </div>
            </li>
            {ProviderMenuItems}
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderLocationSelector()}
      </div>
    );
  }
}

export { LocationSelector };