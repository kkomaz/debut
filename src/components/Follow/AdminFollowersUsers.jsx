// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'

// Component Imports
import {
  Columns,
  Card,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import AdminNoFollowers from 'components/Follow/AdminNoFollowers'
import { BarLoader } from 'components/Loader'

// Model Imports
import { User } from 'radiks'

class AdminFollowersUsers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      offset: 0,
      users: [],
      bottomReached: false,
      full: false,
    }

    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    follow: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  componentDidMount = async () => {
    this.fetchUsers()
    window.addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.follow.username !== prevProps.follow.username) {
      this.setState({ users: [], offset: 0 }, () => {
        this.fetchUsers()
      })
    }

    if (this.props.follow.username === prevProps.follow.username) {
      const { sessionUser } = this.context.state

      if (this.props.follow.followersCount > prevProps.follow.followersCount) {
        const user = await User.findOne({ username: sessionUser.username })
        const users = [...this.state.users, user.attrs]
        this.setState({
          users,
          offset: users.length
        })
      }

      if (this.props.follow.followersCount < prevProps.follow.followersCount) {
        const users = _.filter(this.state.users, (user) => user._id !== sessionUser.username)
        this.setState({
          users,
          offset: users.length
        })
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const { bottomReached } = this.state
    const html = document.documentElement; // get the html element
    // window.innerHeight - Height (in pixels) of the browser window viewport including, if rendered, the horizontal scrollbar.
    // html.offsetHeight - read-only property returns the height of an element, including vertical padding and borders, as an integer.
    const windowHeight = "innerHeight" in window ? window.innerHeight : html.offsetHeight;
    const body = document.body; // get the document body
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // Find the max value of the overall doc
    const windowBottom = windowHeight + window.pageYOffset; // Viewport + height offset post scroll

    /**
     * if windowBottom is larger then you know you reached the bottom
    */
    if (windowBottom >= docHeight) {
      this.setState({ bottomReached: true }, () => {
        if (!this.state.full) {
          this.fetchUsers()
        }
      });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }

  fetchUsers = async () => {
    const { follow } = this.props
    const { offset } = this.state

    if (_.get(follow, 'followers.length', 0) > 0) {
      const result = await User.fetchList({
        username: follow.followers,
        sort: '-createdAt',
        limit: 12,
        offset,
      })

      if (_.isEmpty(result)) {
        return this.setState({ full: true })
      }

      const additionalUsers = _.map(result, 'attrs')
      const finalUsers = [...this.state.users, ...additionalUsers]

      return this.setState({
        users: finalUsers,
        offset: finalUsers.length
      })
    }
  }

  onBoxClick = (user) => {
    const { history } = this.props
    history.push(`/user/${user.username}`)
  }

  render() {
    const { users } = this.state
    const { defaultImgUrl } = this.context.state
    const { className, follow, loading } = this.props

    let styles = {}

    if (loading) {
      return <BarLoader />
    }

    if (_.isEmpty(follow.followers) && !loading) {
      return <AdminNoFollowers />
    }

    if (users.length < 3) {
      styles = { minWidth: '190px', minHeight: '190px' }
    }

    return (
      <Columns className={className} breakpoint="tablet">
        {
          _.map(users, (user) => {
            return (
              <Columns.Column
                key={user.username}
                tablet={{
                  size: 3,
                }}
              >
                <Card className="page__card" style={styles} onClick={() => this.onBoxClick(user)}>
                  <Card.Image size="4by3" src={_.get(user, 'profileImgUrl', defaultImgUrl)} />
                  <Card.Content className="page__content">
                    <p className="page__username-text">{user.username}</p>
                  </Card.Content>
                </Card>
              </Columns.Column>
            )
          })
        }
      </Columns>
    )
  }
}

AdminFollowersUsers.defaultProps = {
  size: 3
}

export default withRouter(connect()(AdminFollowersUsers))
AdminFollowersUsers.contextType = UserContext
