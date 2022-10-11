import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'

@branch({
  account_slug: ['account', 'obfuscated_slug']
})
class VerticalPreview extends Component {
  _renderVerticalPreview() {
    const {account_slug} = this.props;
    const widget_img_width = 150;
    const widget_padding_top = 20;
    const widget_padding_bottom = 20;
    const widget_url = Django.url('appointments:request_appointment', account_slug);
    return(
      <a
        href={widget_url}
        target='_blank'
        style={{
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            paddingTop: widget_padding_top,
            paddingBottom: widget_padding_bottom,
          }}
        >
        <img
          src={Django.static("images/appointpal/banner-logo-white.png")}
          style={{
            width: widget_img_width,
            maxWidth: widget_img_width,
          }}
          alt='Appointpal'
        />
        </div>
      </a>
    )
  }
  render() {
    return (
      ::this._renderVerticalPreview()
    );
  }
}

@branch({
})
class WidgetPreview extends Component {
  _getWidgetStyle() {
    const widget_style = {
      width: '180px',
      textAlign: 'center',
      position: 'relative',
      background: 'rgb(91, 19, 141)',
      borderRadius: '50px',
      MozBorderRadius: '50px',
      WebkitBorderRadius: '50px',
    }
    return widget_style
  }
  _renderWidgetPreview() {
    const {width} = this.props;
    const {format} = 'vertical';
    const widget_style = ::this._getWidgetStyle();
    const widget_width = width;
    return(
      <div className='seal-preview'
        style={{
          width: widget_width,
          top: '94px',
          right: '64px',
	      float: 'right',
        }}>
        <div
          style={widget_style}
        >
          <VerticalPreview />
        </div>
      </div>
    )
  }
  render() {
    return (
      ::this._renderWidgetPreview()
    );
  }
}

@branch({
})
class Preview extends Component {
  _renderPreview() {
    // TODO: get rid of the DjangoJS dependency
    const backgroundURL = Django.static('images/appointpal/widget-browser-bg.png');
    return(
      <div>
        <div className='seal-prompt'>
          <div className='top-info'>
            <h3>Website Widget</h3>
          </div>
          <p>Copy and paste the widget code into desired location on your website to enable new appointment requests.</p>
        </div>
        <div
          className='preview-wrapper'
          style={{backgroundImage:`url(${backgroundURL})`}}
        >
          <MediaQuery minWidth={1420}>
            <WidgetPreview width={180} />
          </MediaQuery>
          <MediaQuery maxWidth={1419}>
            <WidgetPreview width={180} />
          </MediaQuery>
          <div className='insert-images'>
            <img
              src={Django.static('images/insert-box.svg')}
              className="insert-box"
            />
            <img
              src={Django.static('images/insert-arrow.svg')}
              className="insert-arrow"
            />
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      ::this._renderPreview()
    );
  }
}

export { Preview };
