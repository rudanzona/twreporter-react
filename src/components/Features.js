import React, { Component } from 'react'
import FeaturesItem from './FeaturesItem'
import More from '../components/More'
import { getImageSrc, getImageSrcSet } from '../utils/index'

// lodash
import map from 'lodash/map'

if (process.env.BROWSER) {
  require('./Features.css')
}

export default class Features extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { features, hasMore, loadMore } = this.props
    const { device } = this.context
    if (Array.isArray(features)) {
      return (
        <div className="features-list clearfix">
          <ul className="listing">
            { map(features, (a) => {
              let imageSrcSet = getImageSrcSet(a)
              let articleImage = getImageSrc(a)
              if (articleImage) {
                return (
                  <FeaturesItem article={a} image={articleImage} imageSrcSet={imageSrcSet} key={a.id}/>
                  )
              }})
            }
          </ul>
          {hasMore ? <More loadMore={loadMore} device={device} /> : null}
        </div>
      )
    } else {
      return ( <div> </div>)
    }
  }
}

Features.contextTypes = {
  // store: React.PropTypes.object
  device: React.PropTypes.string
}

export { Features }
