import {monkey} from 'baobab'
import moment from 'moment'

const testimonials = {
  testimonial_lock: false,
  testimonial_list: [],
  start_date: moment().subtract(90, 'days'),
  end_date: moment().subtract(0, 'days'),
  selected_top_menu: 'pending',
  selected_filter: 'all',
  errors: {
    reply: false
  },
  reply_active: false,
  reply_content: "",
  active_testimonial: null,
  pinned_testimonial: null,
  current_testimonial: monkey({
    cursors: {
      testimonial_list: ['testimonials', 'testimonial_list'],
      active_testimonial: ['testimonials', 'active_testimonial']
    },
    get: (state) => {
      for (var testimonial of state.testimonial_list) {
        if (testimonial.session_id === state.active_testimonial) {
          return testimonial
        }
      }
    },
  }),
  displayed_testimonials: monkey({
    cursors: {
      testimonial_list: ['testimonials', 'testimonial_list'],
      selected_type: ['testimonials', 'selected_top_menu'],
      selected_filter: ['testimonials', 'selected_filter']
    },
    get: (state) => {
      let displayed = [];
      if (state.selected_type != 'posted' || state.selected_filter == 'all') { // if not posted or if filter is all we display all of selected type
        for (var testimonial of state.testimonial_list) {
          if (testimonial.posted_status === state.selected_type) {
            displayed.push(testimonial)
          }
        }
      } else {
        for (var testimonial of state.testimonial_list) {
          if ((testimonial.posted_status === state.selected_type) && (testimonial.status == state.selected_filter)) {
            displayed.push(testimonial)
          }
        }
      }
      return displayed
    },
  }),
  pending_testimonial_count: monkey({
    cursors: {
      testimonial_list: ['testimonials', 'testimonial_list'],
    },
    get: (state) => {
      const pending_testimonials = state.testimonial_list.filter((testimonial) => {
        return (testimonial.posted_status === 'pending')
      });
      return pending_testimonials.length;
    },
  }),
}

export default testimonials;