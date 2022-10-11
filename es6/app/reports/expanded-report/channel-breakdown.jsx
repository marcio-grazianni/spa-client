import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Table, Column, Cell} from 'fixed-data-table'
import {StarRating} from '../../UI/star-rating'

@branch({
  channel_breakdown: ['reports', 'channel_breakdown'],
})
class SourceImageCell extends Component {
  _renderSourceImageCell() {
    const {channel_breakdown, rowIndex, field} = this.props;
    const data = channel_breakdown[rowIndex][field];
    let slug = data;
    if ('subscribervoice' === slug) {
      slug = 'appointpal';
    }
    const img_src = Django.static(`images/review-logos/${slug}.png`);
    return(
      <Cell>
        <div className='source-image'>
          <img src={img_src} />
        </div>
      </Cell>
    );
  }
  render() {
    return(
      ::this._renderSourceImageCell()
    );
  }
}

@branch({
  channel_breakdown: ['reports', 'channel_breakdown'],
})
class RatingCell extends Component {
  _renderRatingCell() {
    const {channel_breakdown, rowIndex, field} = this.props;
    const data = channel_breakdown[rowIndex][field];
    return(
      <Cell>
      <div className='average-rating'>
        <span className='rating-value'>{data}</span>
        {
          (data >= 0) &&
          <StarRating rating={data} />
        }
      </div>
    </Cell>
    );
  }
  render() {
    return(
      ::this._renderRatingCell()
    );
  }
}

@branch({
  channel_breakdown: ['reports', 'channel_breakdown'],
})
class TextCell extends Component {
  _renderTextCell() {
    const {channel_breakdown, rowIndex, field} = this.props;
    const data = channel_breakdown[rowIndex][field];
    return(
      <Cell>
        <div className='total-reviews'>
          <span className='value'>{data}</span>
        </div>
      </Cell>
    );
  }
  render() {
    return(
      ::this._renderTextCell()
    );
  }
}

@branch({
  channel_breakdown: ['reports', 'channel_breakdown'],
})
class ChannelBreakdown extends Component {
  _renderChannelBreakdown() {
    const {channel_breakdown} = this.props;
    const rows = channel_breakdown.length;
    return(
      // TODO: set height based on number of sources.
      <div className='table channel-breakdown'>
        <Table
          rowsCount={rows}
          headerHeight={46}
          rowHeight={66}
          width={1080}
          height={(rows*66) + 48}
        >
          <Column
            header={<Cell>Source</Cell>}
            cell={<SourceImageCell field='slug' />}
            width={390}
          />
          <Column
            header={<Cell>Average Rating</Cell>}
            cell={<RatingCell field='average' />}
            width={450}
          />
          <Column
            header={<Cell>Total Reviews</Cell>}
            cell={<TextCell field='total_reviews' />}
            width={240}
          />
        </Table>
      </div>
    );
  }
  render() {
    return(
      ::this._renderChannelBreakdown()
    );
  }
}

export { ChannelBreakdown }
