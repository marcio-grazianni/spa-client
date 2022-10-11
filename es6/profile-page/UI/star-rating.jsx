import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
  blue_star_url: ['blue_star_url'],
  grey_star_url: ['grey_star_url']
})
class StarRating extends Component {
  _renderStarRating() {
    const {rating, blue_star_url, grey_star_url} = this.props;

    // Round to nearest half
    const rating_round = Math.round(rating);
    const rating_left = 5 - rating_round;
    return (
      <span className='rating' itemScope itemProp="reviewRating" itemType="http://schema.org/Rating">
      {
        (rating != 0) && <meta itemProp='ratingValue' content={rating} />
      }
      {
        (rating != 0) && <meta itemProp='bestRating' content={5} />
      }
      {
        (rating != 0) && <meta itemProp='worstRating' content={1} />
      }
      {
         (rating_round !== 0) &&
         Array(Math.floor(rating_round)).fill().map((_,i) =>
           <span className='star' key={i}>
             <img src={blue_star_url} />
           </span>
         )
       }
       {
         (rating_left !== 0) &&
         Array(Math.floor(rating_left)).fill().map((_,i) =>
           <span className='star' key={i}>
             <img src={grey_star_url} />
           </span>
         )
       }
      </span>
    );
  }
  render() {
    return (
      ::this._renderStarRating()
    );
  }
}


export { StarRating };