import React, {Component} from 'react'
import {root} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import tree from './state'
import {TestimonialDesktop} from './desktop/testimonial-desktop'
import {TestimonialMobile} from './mobile/testimonial-mobile'

class TestimonialPage extends Component {
  _renderTestimonialPage() {
    return(
      <div>
        <MediaQuery minWidth={1000}>
         <TestimonialDesktop />
        </MediaQuery>
        <MediaQuery maxWidth={999}>
         <TestimonialMobile />
        </MediaQuery>
     </div>
    );
  }
  render() {
    return (
      ::this._renderTestimonialPage()
    );
  }
}

const RootedTestimonialPage = root(tree, TestimonialPage);

module.exports = RootedTestimonialPage;
