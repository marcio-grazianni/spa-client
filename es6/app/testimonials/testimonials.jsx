import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {FixedHeightAppContainer} from '../app-container-fixed'
import {UpgradeOverlay} from '../UI/upgrade-overlay'
import {Confirmation, ConfirmationButtons} from '../UI/confirmation'
import {TestimonialsHeader} from './testimonials-header'
import {SelectTestimonial} from './select-testimonial'
import {TestimonialDisplay} from './testimonial-display'
import {initialLoad, post, unPost, flag, unFlag, pin, unPin, reply} from './actions'


@branch({
  confirmation: ['confirmation'],
  testimonial_lock: ['testimonials', 'testimonial_lock'],
  selected_account_id: ['accounts', 'selected_account_id']
})
class Testimonials extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad)
  }
  componentDidUpdate(prevProps, prevState) {
    const {selected_account_id} = this.props;
    if(prevProps.selected_account_id != selected_account_id) {
      this.props.dispatch(initialLoad)
    }
  }
  _confirm() {
    const {confirmation} = this.props;
    let confirmation_function = null;
    switch (confirmation) { //different functions based current confirmation shown
      case 'post':
        confirmation_function = post;
        break;
      case 'unpost':
        confirmation_function = unPost;
        break;
      case 'flag':
        confirmation_function = flag;
        break;
      case 'unflag':
        confirmation_function = unFlag;
        break;
      case 'pin':
        confirmation_function = pin;
        break;
      case 'unpin':
        confirmation_function = unPin;
        break;
      case 'reply':
        confirmation_function = reply;
        break;
    }
    this.props.dispatch(
      confirmation_function
    )
  }
  render() {
    const ConfirmationInfo = {
      post: {
        icon: 'fa-list',
        title: 'Post entry to testimonial page',
        confirm_text: 'Are you sure you would like to post this entry to your testimonial page?',
        button_text: 'Post entry'
      },
      unpost: {
        icon: 'fa-list',
        title: 'Remove post',
        confirm_text: 'Are you sure you would like to remove this entry from your testimonial page? Any replies will be removed from unposted entries.',
        button_text: 'Remove entry'
      },
      flag: {
        icon: 'fa-flag',
        title: 'Flag as spam',
        confirm_text: 'Are you sure you would like to flag this entry? The SubscriberVoice team will be notified and spam will be removed.',
        button_text: 'Flag entry'
      },
      unflag: {
        icon: 'fa-flag',
        title: 'Unflag entry',
        confirm_text: 'Are you sure you would like to unflag this entry? The entry will be re-added to your queue of pending entries.',
        button_text: 'Unflag entry'
      },
      pin: {
        icon: 'fa-map-pin',
        title: 'Pin entry to top',
        confirm_text: 'Are you sure you would like to pin this entry to the top of your testimonial page? Any current pinned entries will be un-pinned.',
        button_text: 'Pin entry'
      },
      unpin: {
        icon: 'fa-map-pin',
        title: 'Unpin entry from top',
        confirm_text: 'Are you sure you would like to unpin this entry from the top of your testimonial page?',
        button_text: 'Unpin entry'
      },
      reply: {
        icon: 'fa-reply',
        title: 'Confirm reply',
        confirm_text: 'Your reply will added to your testimonial page.',
        button_text: 'Reply to entry'
      }
    }
    const {confirmation, testimonial_lock} = this.props;
    return (
      <FixedHeightAppContainer section="testimonials">
        <div id="testimonialsApp" className="newApp">
          {
            confirmation &&
            <Confirmation
              icon={ConfirmationInfo[confirmation].icon}
              title={ConfirmationInfo[confirmation].title}
              confirm_text={ConfirmationInfo[confirmation].confirm_text}
            >
              <ConfirmationButtons>
                <button
                  type='button'
                  className='btn btn-confirm'
                  onClick={::this._confirm}
                >
                  {ConfirmationInfo[confirmation].button_text}
                </button>
              </ConfirmationButtons>
            </Confirmation>
          }
          <div className='testimonials-wrapper main-wrapper'>
            <TestimonialsHeader />
            <SelectTestimonial />
            <TestimonialDisplay />
          </div>
        </div>
        {
          (testimonial_lock) &&
          <UpgradeOverlay
            prompt="You need to upgrade your SubscriberVoice plan in order to post testimonials."
          />
        }
      </FixedHeightAppContainer>
    );
  }
}

export { Testimonials };