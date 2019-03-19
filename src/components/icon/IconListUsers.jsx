// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import _ from 'lodash'
import ReactCSSTransitionReplace from 'react-css-transition-replace';

// Component Imports
import { UserContext } from 'components/User/UserProvider'

// Stylesheets
import './IconListUsers.scss'

class IconListUsers extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  addDefaultSrc = (evt) => {
    evt.target.src = 'https://i.imgur.com/w1ur3Lq.jpg'
  }

  onClick = (user) => {
    const { history } = this.props
    return history.push(`/user/${user.username}`)
  }

  render() {
    const { users } = this.props
    const { defaultImgUrl } = this.context.state

    return (
      <ReactCSSTransitionReplace
        transitionName="cross-fade"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={100}
      >
        {
          _.isEmpty(users) ? null :
          <ul className="icon-list-users" key="icon-list-users">
            {
              _.map(users, (user, index) => {
                return (
                  <li className="icon-list-users__single" key={`${user.username}-${index}`}>
                    <Link className="icon-list-users__single-link" to={`/user/${user.username}`}>
                      <img
                        onError={this.addDefaultSrc}
                        src={_.get(user, 'profileImgUrl', defaultImgUrl)}
                        alt="user"
                        height="42"
                        width="42"
                      />
                    </Link>
                    <p className="icon-list-users__username ml-one mb-half">
                      {user.username}
                    </p>
                  </li>
                )
              })
            }
          </ul>
        }
      </ReactCSSTransitionReplace>
    )
  }
}
export default withRouter(IconListUsers)
IconListUsers.contextType = UserContext
