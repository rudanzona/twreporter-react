/*eslint no-unused-vars:0*/
'use strict'
import classNames from 'classnames'
import commonStyles from './Common.scss'
import styles from './Introduction.scss'
import React, { Component } from 'react'

// lodash
import get from 'lodash/get'

export const Introduction = ({ data }) => {
  let content
  let block = false
  let introArr = []

  if (Array.isArray(data)) {
    content = data.map((ele, idx) => {
      let element = get(ele, [ 'content', 0 ])
      if (element.length > 0) {
        block = true
        let paragraph = get(ele, [ 'content', 0 ])
        introArr.push(<p key={ele.id || idx} dangerouslySetInnerHTML={{ __html: paragraph }}></p>)
        return paragraph
      }
    } )
  } else {
    if (content.length > 0) {
      block = true
      content = "<p>{get(data, [ 'content', 0 ])}</p>"
      introArr.push(<div dangerouslySetInnerHTML={{ __html: content }} />)
    }
  }

  if (block) {
    return (
      <div className={classNames(styles['intro-container'], 'text-justify')}>
      {introArr}
      </div>
    )
  } else {
    return (<div></div>)
  }
}
