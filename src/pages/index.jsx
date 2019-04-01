import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Columns,
  Container,
  Heading,
  Hero,
  Table,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import { Loader } from 'components/Loader'
import { requestPaginatedUsers, revertPaginatedUsersFull } from 'actions/user'
import { NoUsers, UserCard } from 'components/User'
import './Page.scss'

class Page extends Component {
  state = {
    showTileView: true,
    page: 0,
  }

  componentDidMount() {
    const { userState } = this.props
    const { page } = this.state

    // Another hot fix will fix/refactor for april
    if (this.props.homePageClicked) {
      this.props.setHomePageClickedFalse()

      if (this.props.userState.paginatedObj.full) {
        this.props.revertPaginatedUsersFull()
      }
    }

    if (_.isEmpty(userState.paginatedUsers[page].list)) {
      this.fetchPaginatedUsers()
    }
  }

  componentWillUnmount() {
    const { userState } = this.props

    if (userState.paginatedObj.full) {
      this.props.revertPaginatedUsersFull()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.homePageClicked) {
      this.props.setHomePageClickedFalse()
      if (this.props.userState.paginatedObj.full) {
        this.props.revertPaginatedUsersFull()
      }
      this.setState({ page: 0 })
    }
  }

  onBoxClick = (user) => {
    const { history } = this.props

    return history.push({
      pathname: `/${user.username}`,
      state: {
        identityAddress: user.blockstackId
      }
    })
  }

  onChange = (val) => {
    this.setState({
      showTileView: val
    })
  }

  toggleSwitch = () => {
    this.setState({ showTileView: !this.state.showTileView })
  }

  fetchPaginatedUsers = (nextPage = 0) => {
    const { userState } = this.props
    this.props.requestPaginatedUsers(nextPage, userState.paginatedObj.offset)
    return this.setState({ page: nextPage })
  }

  onNextClick = () => {
    const { page } = this.state
    const { userState } = this.props

    if (!userState.paginatedUsers[page + 1]) {
      const nextPage = page + 1
      return this.fetchPaginatedUsers(nextPage)
    }

    return this.setState({ page: page + 1 })
  }

  onPreviousClick = () => {
    const { page } = this.state
    const { userState } = this.props
    if (userState.paginatedObj.full) {
      this.props.revertPaginatedUsersFull()
    }
    return this.setState({ page: page - 1 })
  }

  render() {
    const { userState } = this.props
    const { showTileView, page } = this.state
    const { defaultImgUrl, sessionUser } = this.context.state

    return (
      <div className="page">
        <Hero color="primary" className="page__hero mb-two">
         <Hero.Body>
           <Container className="page__container">
             {
               !userState.paginatedObj.full &&
               <Columns>
                 <Columns.Column size={12}>
                   <Heading>Welcome to debut!</Heading>
                   <Heading size={5}>Here are the list of user currently signed up!</Heading>
                   <Heading size={6}>Feel free to adjust your view, explore profiles, and introduce yourself by updating your profile via "My Page"!</Heading>
                 </Columns.Column>
               </Columns>
             }
           </Container>
         </Hero.Body>
       </Hero>
          <Container className="page__user-container">
            {
              userState.paginatedObj.loading ?
              <Loader
                cardWrapped
                text="App is warming up..."
              /> :
              userState.paginatedObj.full ? (
                <NoUsers
                  onPreviousClick={this.onPreviousClick}
                  onNextClick={this.onNextClick}
                  loading={userState.paginatedObj.loading}
                  full={userState.paginatedObj.full}
                />
              ): showTileView ?
                <Columns breakpoint="mobile">
                  {
                    _.map(userState.paginatedUsers[page].list, (user) => {
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
                            defaultImgUrl={defaultImgUrl}
                            navigateTo={this.onBoxClick}
                            currentUser={sessionUser.userData}
                          />
                        </Columns.Column>
                      )
                    })
                  }
                </Columns> :
                <div style={{ padding: '0 150px' }}>
                  <Table>
                    <tbody>
                      {
                        _.map(userState.paginatedUsers[page].list, (user) => {
                          return <tr key={user.username} className="page__user-row" onClick={() => this.onBoxClick(user)}>
                            <td>{user.username} has joined debut!</td>
                          </tr>
                        })
                      }
                    </tbody>
                  </Table>
                </div>
            }
            <div
              className="page__pagination pagination mt-two"
              role="navigation"
              aria-label="pagination"
            >
              <Button
                color="link"
                className="pagination-previous"
                onClick={this.onPreviousClick}
                disabled={userState.paginatedObj.loading || page === 0}
              >
                {"<"}
              </Button>
              <Button
                color="link"
                className="pagination-next"
                onClick={this.onNextClick}
                disabled={userState.paginatedObj.loading || userState.paginatedObj.full}
              >
                {">"}
              </Button>
            </div>
          </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userState: state.user,
  }
}

export default withRouter(connect(mapStateToProps, {
  requestPaginatedUsers,
  revertPaginatedUsersFull,
})(Page))
Page.contextType = UserContext
