import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SectionHeader} from '../UI/section-header'
import {TopMenu} from '../UI/top-menu'
import {onChangeSection} from './actions'


@branch({
  selected: ['testimonials', 'selected_top_menu'],
  pending_testimonial_count: ['testimonials', 'pending_testimonial_count'],
})
class TestimonialsHeader extends Component {
  _renderTestimonialsHeader() {
    const {selected, pending_testimonial_count} = this.props;

    let pending_label = 'pending';
    if (pending_testimonial_count) {
      pending_label = `pending (${pending_testimonial_count})`;
    }

    // TODO: keep configurable menu items in a seperate file

    const MenuItems = [{value: 'pending', label: pending_label}, {value: 'posted', label: 'posted'}, {value: 'flagged', label: 'flagged'}];
    return (
      <SectionHeader
        id="testimonials"
        icon="fa-edit"
        title="Testimonials"
        datePickerEnabled={false}
      >
        <TopMenu
          section="testimonials"
          selected={selected}
          MenuItems={MenuItems}
          onChange={onChangeSection}
        />
      </SectionHeader>
    );
  }
  render() {
    return (
      ::this._renderTestimonialsHeader()
    );
  }
}

export { TestimonialsHeader };