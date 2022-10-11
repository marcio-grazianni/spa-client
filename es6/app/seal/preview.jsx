import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import classnames from 'classnames'

@branch({
  message_seal: ['seal', 'message_seal'],
  account_slug: ['account', 'account_slug']
})
class VerticalPreview extends Component {
  _renderVerticalPreview() {
    const {account_slug} = this.props;
    const {icon, call_to_action, uuid} = this.props.message_seal;
    const icon_img_width = 90;
    const seal_img_width = 150;
    const seal_padding_bottom = 10;
    const CTA_font_size = 16;
    const seal_url = Django.url('reviews:testimonial_give_review', account_slug);
    const icon_url = Django.static(`images/${icon}.jpg`);
    return(
      <tr width='100%'>
        <td width='100%'> 
          <a
            href={seal_url}
            target='_blank'
            style={{
              textDecoration: 'none',
            }}
          > 
            <h2
              style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#868686',
                fontSize: CTA_font_size,
                lineHeight: '1.1em',
                margin: 0,
                paddingTop: '0.8em',
                paddingBottom:'0.4em',
              }}
            >
              {call_to_action}
            </h2>
            <div style={{
                width: '100%',
              }}>
            <img
              src={icon_url}
              style={{
                width: icon_img_width,
                maxWidth: icon_img_width,
              }}
              alt='SubscriberVoice'
              /> 
            </div>
            <div
              style={{
                width: '100%',
                paddingBottom: seal_padding_bottom,
              }}
            >
            <img
              src={Django.static("images/seal.jpg")}
              style={{
                width: seal_img_width,
                maxWidth: seal_img_width,
              }}
              alt='SubscriberVoice' 
            />
            </div>
          </a> 
        </td>
      </tr>
    )
  }
  render() {
    return (
      ::this._renderVerticalPreview()
    );
  }
}

@branch({
  message_seal: ['seal', 'message_seal'],
  account_slug: ['account', 'account_slug']
})
class HorizontalPreview extends Component {
  _renderVerticalPreview() {
    const {account_slug} = this.props;
    const {icon, call_to_action, uuid} = this.props.message_seal;
    const CTA_padding_top = 10;
    const icon_img_width = 90;
    const seal_img_width = 180;
    const seal_padding_bottom = 10;
    const CTA_font_size = 16;
    const seal_url = Django.url('reviews:testimonial_give_review', account_slug);
    const icon_url = Django.static(`images/${icon}.jpg`);
    return(
      <tr width='100%'>
        <td width='50%'>
          <a
            href={seal_url}
            target='_blank'
            style={{
              textDecoration: 'none'
            }}
          > 
            <h2
              style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#868686',
                fontSize: CTA_font_size,
                lineHeight: '1.1em',
                margin: 0,
                paddingTop: CTA_padding_top,
                paddingBottom:'0.18em',
              }}
            >
              {call_to_action}
            </h2>
            <div
              style={{
                width: '100%',
                paddingBottom: '0.3em',
              }}
            >
            <img
              src={icon_url}
              style={{
                width: icon_img_width,
                maxWidth: icon_img_width,
              }}
              alt='SubscriberVoice'
              /> 
            </div>
          </a> 
        </td>
        <td width='50%'>
          <a
            href={seal_url}
            target='_blank'
          > 
            <div
              style={{
                width: '100%'
              }}
            >
            <img
              src={Django.static("images/seal.jpg")}
              style={{
                width: seal_img_width,
                maxWidth: seal_img_width,
              }}
              alt='SubscriberVoice'
            />
            </div>
          </a> 
        </td>
      </tr>
    )
  }
  render() {
    return (
      ::this._renderVerticalPreview()
    );
  }
}

@branch({
  message_seal: ['seal', 'message_seal']
})
class SealPreview extends Component {
  _getSealStyle() {
    const {border} = this.props.message_seal;
    let borderWidth;
    if (border === 'none') {
      borderWidth = 0;
    } else {
      borderWidth = 2;
    }
    const seal_style = {
      width: '100%',
      fontFamily: 'Arial, Helvetica, sans-serif',
      textAlign: 'center',
      background: 'white',
      position: 'relative',
      borderStyle: 'solid',
      borderWidth: borderWidth,
      borderColor: '#e5e5e5',
    }
    return seal_style
  }
  _renderSealPreview() {
    const {width} = this.props;
    const {format} = this.props.message_seal;
    const seal_style = ::this._getSealStyle();
    const seal_width = width;
    const padding_top = 15;
    const preview_class = classnames('seal-preview', format);
    let inner_preview = null;
    if (format === 'vertical') {
      inner_preview = <VerticalPreview />
    } else if (format === 'horizontal') {
      inner_preview = <HorizontalPreview />
    }
    return(
      <div className={preview_class}
        style={{
          width: seal_width,
          paddingTop: padding_top,
        }}>
        <table
          style={seal_style}
          cellPadding='0'
          cellSpacing='0'
        >
          <tbody>
            {inner_preview}
          </tbody> 
        </table>
      </div>
    )
  }
  render() {
    return (
      ::this._renderSealPreview()
    );
  }
}

@branch({
  message_seal: ['seal', 'message_seal'],
})
class Preview extends Component {
  _renderPreview() {

    // TODO: get rid of the DjangoJS dependency
    const backgroundURL = Django.static('images/seals-browser-bg.svg');
    const {first_feedback, last_feedback} = this.props.message_seal;
    let uninstalled;
    let status_span;
    if (first_feedback) {
      uninstalled = false;
      status_span = <span className='active'><b>Active:</b> {last_feedback}</span>
    } else {
      uninstalled = true;
      status_span = <span className='active'>Inactive</span>
    }
    const seal_status_class = classnames('status', {'un-installed': uninstalled});
    return(
      <div>
        <div className='seal-prompt'>
          <div className='top-info'>
            <h3>Message Seal</h3>
            <div className='seal-status'>
              <div className='inner-wrapper'>
                <span className={seal_status_class}><i className='fa fa-circle'></i>
                  {status_span}
                </span>
              </div>
            </div>
          </div>
          <p>Copy and paste the below message seal code into the footer of your email templates to increase positive reviews and highlight your overall experience.</p>
        </div>
        <div
          className='preview-wrapper'
          style={{backgroundImage:`url(${backgroundURL})`}}
        >
          <MediaQuery minWidth={1420}>
            <SealPreview width={600} />
          </MediaQuery>
          <MediaQuery maxWidth={1419}>
            <SealPreview width={460} />
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
