import React, {Component} from 'react'

class StarRating extends Component {
  _renderStarRating() {
    const {rating} = this.props;

    // Round to nearest half
    const rating_half_round = Math.round(rating*2)/2;
    let half_star = false;
    if (rating_half_round % 1 !== 0) {
      half_star = true
    }
    return (
      <span className='rating'>
        <span className='rating-background'>
          {
            Array(5).fill().map((_,i) =>
              <span className='star' key={i}>
                <i className='fa fa-star'></i>
              </span>
            )
          }
        </span>
        <span className='rating-foreground'>
          {
            Array(Math.floor(rating_half_round)).fill().map((_,i) =>
              <span className='star' key={i}>
                <i className='fa fa-star'></i>
              </span>
            )
          }
          {
            (half_star) &&
            <span className='star'>
              <i className='fa fa-star-half'></i>
            </span>
          }
        </span>
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