import React from 'react'
import _ from 'lodash'
import 'stylesheets/components/icon/icon-list.scss'

const IconList = ({ apps }) => {
  return (
    <ul className="icon-list">
      {
        _.map(apps, (app) => {
          return (
            <li className="icon-list__single">
              <a href={app.url} target="_blank" rel='noreferrer noopener'>
                <img src={app.icons[0].src} alt="dapp" height="42" width="42" />
              </a>
            </li>
          )
        })
      }
    </ul>
  )
}

export default IconList
