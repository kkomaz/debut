import React, { Component } from 'react'
import _ from 'lodash'
import 'stylesheets/components/icon/icon-list.scss'

class IconList extends Component {
  addDefaultSrc = (evt) => {
    evt.target.src = 'https://i.imgur.com/w1ur3Lq.jpg'
  }

  render() {
    const { apps } = this.props

    return (
      <ul className="icon-list">
        {
          _.map(apps, (app, index) => {
            return (
              <li className="icon-list__single" key={`${app}-${index}`}>
                <a href={app.url} target="_blank" rel='noreferrer noopener'>
                  <img onError={this.addDefaultSrc} src={app.icons[0].src} alt="dapp" height="42" width="42" />
                </a>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

export default IconList
