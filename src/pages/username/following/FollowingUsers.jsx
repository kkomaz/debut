import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Columns,
  Container,
} from 'components/bulma'
import { BarLoader } from 'components/Loader'
import PropTypes from 'prop-types'
import { User } from 'radiks'
import _ from 'lodash'
import { UserContext } from 'components/User/UserProvider'
import NoFollowing from 'components/Follow/NoFollowing'
import { UserCard } from 'components/User'
import './FollowingUsers.scss'

class FollowingUsers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      offset: 0,
      users: [],
      bottomReached: false,
      full: false,
      loading: true
    }

    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    follow: PropTypes.object.isRequired,
    size: PropTypes.number,
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
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  fetchUsers = async () => {
    const { follow } = this.props
    const { offset } = this.state

    if (_.get(follow, 'following.length', 0) > 0) {
      const result = await User.fetchList({
        username: follow.following,
        sort: '-createdAt',
        limit: 12,
        offset,
      })

      if (_.isEmpty(result)) {
        return this.setState({ full: true, loading: false })
      }

      const additionalUsers = _.map(result, 'attrs')
      const finalUsers = [...this.state.users, ...additionalUsers]

      return this.setState({
        users: finalUsers,
        offset: finalUsers.length,
        loading: false
      })
    }

    return this.setState({
      loading: false
    })
  }

  onBoxClick = (user) => {
    const { history } = this.props
    history.push(`/${user.username}`)
  }

  handleScroll = () => {
    const { bottomReached, users } = this.state
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
        if (!this.state.full && users.length >= 12) {
          this.fetchUsers()
        }
      });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }

  render() {
    const { users, bottomReached, full, loading } = this.state
    const { defaultImgUrl, sessionUser } = this.context.state
    const { className, follow } = this.props

    if (loading) {
      return (
        <div className="following-users following-users--loading">
          <BarLoader />
        </div>
      )
    }

    if (!loading && _.isEmpty(users)) {
      return (
        <Container style={{ padding: '0 75px'}}>
          <NoFollowing username={follow.username} />
        </Container>
      )
    }

    return (
      <Container className="following-users">
        <Columns className={className} breakpoint="mobile">
          {
            _.map(users, (user) => {
              return (
                <Columns.Column
                  key={user.username}
                  desktop={{
                    size: 4,
                  }}
                  mobile={{
                    size: 6,
                  }}
                >
                  <UserCard
                    user={user}
                    currentUser={sessionUser.userData}
                    defaultImgUrl={defaultImgUrl}
                    navigateTo={this.onBoxClick}
                  />
                </Columns.Column>
              )
            })
          }
          {
            bottomReached && !full && <BarLoader style={{ height: '200px' }} />
          }
        </Columns>
      </Container>
    )
  }
}

FollowingUsers.defaultProps = {
  size: 4
}

export default withRouter(connect()(FollowingUsers))
FollowingUsers.contextType = UserContext
