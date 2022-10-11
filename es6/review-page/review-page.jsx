import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {root} from 'baobab-react/higher-order'
import MediaQuery from 'react-responsive'
import tree from './state'
import {ReviewDesktop} from './desktop/review-desktop'
import {ReviewMobile} from './mobile/review-mobile'

@branch({
})
class ReviewPage extends Component {
  _renderTestimonialPage() {
    return(
      <div>
        <MediaQuery minWidth={1000}>
          <ReviewDesktop />
        </MediaQuery>
        <MediaQuery maxWidth={999}>
          <ReviewMobile />
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

const RootedReviewPage = root(tree, ReviewPage);

module.exports = RootedReviewPage;
