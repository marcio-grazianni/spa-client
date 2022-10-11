import React, {Component} from 'react'
import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import tree from './state'
import {TestimonialDesktop} from './desktop/testimonial-desktop'
import {TestimonialMobile} from './mobile/testimonial-mobile'

class TestimonialPage extends Component {
    _renderTestimonialPage() {
      return(
        <div>
          <TestimonialDesktop />
        </div>
      );
    }
    render() {
      return (
        ::this._renderTestimonialPage()
      );
    }
}

class TestimonialPageWrapper extends Component {

  constructor(props) {
    super(props);
    const tree = new Baobab(props);
    this.rootedTestimonialPage = root(tree, TestimonialPage);
  }

  render() {
    let TestimonialPage = this.rootedTestimonialPage;
    return <TestimonialPage />
  }

}

module.exports = TestimonialPageWrapper;
