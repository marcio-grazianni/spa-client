import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {YLabel, BarGraph} from '../../UI/graphs/bar-graph'

@branch({
  report: ['reports', 'current_report'],
})
class ReviewBreakdown extends Component {
  _renderReviewBreakdown() {
    const {star_breakdown} = this.props.report.data;
    const values = [
      star_breakdown['star_5'],
      star_breakdown['star_4'],
      star_breakdown['star_3'],
      star_breakdown['star_2'],
      star_breakdown['star_1'],
    ]
    return(
      <div className='review-breakdown'>
        <BarGraph
          width={280}
          barHeight={20}
          barPadding={7}
          gridAdjust={5}
          xGrid={false}
          xLabels={false}
          values={values}
        >
          {
            Array(5).fill().map((_,i) => {
              // 5 stars to 1 star
              let star = 5 - i;
              return (
                <YLabel key={star}>
                  {star} <i className='fa fa-star'></i>
                </YLabel>
              )
            })
          }
        </BarGraph>
      </div>
    );
  }
  render() {
    return(
      ::this._renderReviewBreakdown()
    );
  }
}

export { ReviewBreakdown }
