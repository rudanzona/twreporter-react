/*eslint no-unused-vars:0*/
'use strict'
import React, { Component } from 'react'
import classNames from 'classnames'
import commonStyles from './Common.scss'
import getArticleComponent from './getArticleComponent'
import styles from './Body.scss'

// lodash
import get from 'lodash/get'

export class Body extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props
    let sectionCnt = 0

    if (Array.isArray(data)) {
      let Blocks = data.map((ele) => {
        let anchor = null
        let styles = {}
        let type = ele.type
        let Component = getArticleComponent(type)

        if(type === 'header-one') {
          sectionCnt++
          anchor = <div id={`section-${sectionCnt}`} className={styles['anchor']}></div>
        } else if (type === 'embeddedcode') {
          let embeddedContent = get(ele, [ 'content', 0 ], {})
          let width = get(embeddedContent, 'width')
          let height = get(embeddedContent, 'height')
          if (width) {
            styles.maxWidth = width
          }
          if (height) {
            styles.minHeight = height
          }
        }

        if (!Component) {
          return null
        }

        return (
          <div
            key={ele.id}
            className={classNames(commonStyles['component'], commonStyles[type])}
            style={styles}
          >
            {anchor}
            <Component
              alignment={ele.alignment}
              content={ele.content}
              id={ele.id}
              styles={ele.styles}
            />
          </div>
        )
      })
      return (
        <div
          className={commonStyles['components']}
        >
          {Blocks}
        </div>
      )
    }
  }
}
