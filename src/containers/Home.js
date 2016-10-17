/*eslint no-unused-vars:0, no-console:0 */
'use strict'
import { HOME, CATEGORY, REVIEW_CH_STR, SPECIAL_TOPIC_CH_STR } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles, getCatId } from '../utils/index'
import { devCatListId, prodCatListId } from '../conf/list-id'
import { fetchArticlesByUuidIfNeeded, fetchFeatureArticles } from '../actions/articles'
import { setPageType } from '../actions/header'
import Daily from '../components/Daily'
import DocumentMeta from 'react-document-meta'
import Features from '../components/Features'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import SystemError from '../components/SystemError'
import TopNews from '../components/TopNews'
import async from 'async'

// lodash
import get from 'lodash/get'

const MAXRESULT = 10
const PAGE = 1

if (process.env.BROWSER) {
  require('./Home.css')
}

class Home extends Component {
  static fetchData({
    store
  }) {
    let params = {
      page: PAGE,
      max_results: MAXRESULT
    }
    return new Promise((resolve, reject) => {
      // load tagged articles in parallel
      async.parallel([
        function (callback) {
          store.dispatch(fetchFeatureArticles())
            .then(() => {
              callback(null)
            })
        },
        function (callback) {
          store.dispatch(fetchArticlesByUuidIfNeeded(getCatId(REVIEW_CH_STR), CATEGORY, params))
            .then(() => {
              callback(null)
            })
        },
        function (callback) {
          store.dispatch(fetchArticlesByUuidIfNeeded(getCatId(SPECIAL_TOPIC_CH_STR), CATEGORY, params))
            .then(() => {
              callback(null)
            })
        }
      ], (err, results) => {
        if (err) {
          console.warn('fetchData occurs error:', err)
        }
        resolve()
      })
    })
  }

  constructor(props, context) {
    super(props, context)
    this.specialTopicListId = getCatId(SPECIAL_TOPIC_CH_STR)
    this.reviewListId = getCatId(REVIEW_CH_STR)
    this.loadMoreArticles = this._loadMoreArticles.bind(this, this.specialTopicListId)
  }

  componentDidMount() {
    this.props.setPageType(HOME)
  }

  componentWillMount() {
    const { articlesByUuids, featureArticles, fetchArticlesByUuidIfNeeded, fetchFeatureArticles } = this.props
    let params = {
      page: PAGE,
      max_results: MAXRESULT
    }
    if (get(featureArticles, 'items.length', 0) === 0) {
      fetchFeatureArticles()
    }
    if (get(articlesByUuids, [ this.reviewListId, 'items', 'length' ], 0) < MAXRESULT) {
      fetchArticlesByUuidIfNeeded(this.reviewListId, CATEGORY, params)
    }
    if (get(articlesByUuids, [ this.specialTopicListId, 'items', 'length' ], 0) < MAXRESULT) {
      fetchArticlesByUuidIfNeeded(this.specialTopicListId, CATEGORY, params)
    }
  }

  _loadMoreArticles(catId) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded } = this.props

    if (get(articlesByUuids, [ catId, 'hasMore' ]) === false) {
      return
    }

    let itemSize = get(articlesByUuids, [ catId, 'items', 'length' ], 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1
    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { articlesByUuids, entities, featureArticles } = this.props
    const topnews_num = 5
    let topnewsItems = denormalizeArticles(get(featureArticles, 'items', []), entities)
    let specialTopicItems = denormalizeArticles(get(articlesByUuids, [ this.specialTopicListId, 'items' ], []), entities)
    let reviewItems = denormalizeArticles(get(articlesByUuids, [ this.reviewListId, 'items' ], []), entities)
    const meta = {
      title: '報導者 The Reporter',
      description: '《報導者》是由「財團法人報導者文化基金會」成立的非營利網路媒體，致力於公共領域的深度報導及調查報導，為讀者持續追蹤各項重要議題。我們秉持開放參與的精神，結合各種進步價值與公民力量，共同打造多元進步的社會與媒體環境。',
      canonical: 'https://www.twreporter.org/',
      meta: { property: {} },
      auto: { ograph: true }
    }

    if (topnewsItems) {
      return (
        <DocumentMeta {...meta}>
          <TopNews topnews={topnewsItems} />
          <Daily daily={reviewItems}
          />
          <Features
            features={specialTopicItems}
            hasMore={ get(articlesByUuids, [ this.specialTopicListId, 'hasMore' ])}
            loadMore={this.loadMoreArticles}
          />
          {
            this.props.children
          }
          <Footer />
        </DocumentMeta>
      )
    } else {
      return ( <SystemError /> )
    }
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    featureArticles: state.featureArticles || {}
  }
}

export { Home }

export default connect(mapStateToProps, {
  fetchArticlesByUuidIfNeeded,
  fetchFeatureArticles,
  setPageType
})(Home)
