import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {selectProvider} from '../actions'
import {DropDownToggle, DropDownMenu} from '../UI/drop-down'

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

@branch({
  account_name: ['account', 'account_name'],
  selected_provider: ['account', 'selected_provider'],
})
class ProviderToggleInner extends Component {
  render() {
    const {account_name, selected_provider} = this.props;
    let label = account_name;
    if (selected_provider) {
      label = selected_provider.name;
    }
    return (
      <div>
        <span className="provider-info">
          {label}
          <span className="caret-down">
            <i className='fa fa-caret-down'></i>
          </span>
        </span>
      </div>
    );
  }
}

@branch({
  account_name: ['account', 'account_name'],
  provider_list: ['account', 'providers'],
  visible: ['drop_down', 'provider_selector', 'visible'],
})
class ProviderSelector extends Component {
  _inputClick(e) {
    e.stopPropagation();
  }
  _deselectProvider() {
    this.props.dispatch(
      selectProvider,
      null
    );
  }
  _renderProviderSelector() {
    const { account_name, provider_list, visible } = this.props;
    let ProviderComponents = [];
    if (provider_list) {
      ProviderComponents = provider_list.map((provider) =>
        <ProviderMenuItem
          key={provider.id}
          {...provider}
        />
      );
    }
    return (
      <div className="provider-selector wrapper dropdown-wrapper open">
        <DropDownToggle id="provider_selector" className="provider-selector">
          <ProviderToggleInner />
        </DropDownToggle>
        {
          visible &&
          <DropDownMenu id="provider_selector" className="provider-selector" {...this.props}>
            <li onClick={::this._deselectProvider}>
              <div className="provider-menu-item">
                {account_name}
              </div>
            </li>
            {ProviderComponents}
          </DropDownMenu>
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {::this._renderProviderSelector()}
      </div>
    );
  }
}

export { ProviderSelector };