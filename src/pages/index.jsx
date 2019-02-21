import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  Columns,
  Container,
  Heading,
  Hero,
  Table,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import './Page.scss'
import { requestUserIntro } from 'actions/blockstack'
import requestAllUsers from 'actions/user/requestAllUsers'
import Switch from 'react-bulma-switch/lib';
import { Loader } from 'components/Loader'
import { requestPaginatedUsers, revertPaginatedUsersFull } from 'actions/user'
import { NoUsers } from 'components/User'

class Page extends Component {
  state = {
    showTileView: true,
    page: 0,
  }

  componentDidMount() {
    const { userState } = this.props
    const { page } = this.state
    this.props.requestAllUsers()

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
    if (!prevProps.homePageClicked && this.props.homePageClicked) {
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
    this.setState({ page: nextPage }, () => {})
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
    const { defaultImgUrl } = this.context.state

    if (userState.paginatedObj.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className="page">
        <Hero color="primary" className="mb-two">
         <Hero.Body>
           <Container>
             <Heading>Choose your user's view!</Heading>
              <Switch
                className="page__slider"
                color="success"
                onChange={this.toggleSwitch}
                checked={showTileView}
                rounded
              >
                  Tile View
              </Switch>
              <Switch
                className="page__slider"
                color="success"
                onChange={this.toggleSwitch}
                checked={!showTileView}
                rounded
              >
                  Table View
              </Switch>
           </Container>
         </Hero.Body>
       </Hero>
          <Container>
            {
              userState.loading &&
              <Loader
                cardWrapped
                contained
                text="App is warming up..."
              />
            }
            {
              userState.paginatedObj.full ? (
                <NoUsers
                  onPreviousClick={this.onPreviousClick}
                  onNextClick={this.onNextClick}
                  loading={userState.paginatedObj.loading}
                  full={userState.paginatedObj.full}
                />
              ): showTileView ?
                <Columns breakpoint="tablet" style={{ padding: '0 150px' }}>
                  {
                    _.map(userState.paginatedUsers[page].list, (user) => {
                      return (
                        <Columns.Column
                          key={user.username}
                          tablet={{
                            size: 3,
                          }}
                        >
                          <Card className="page__card" onClick={() => this.onBoxClick(user)}>
                            <Card.Image size="4by3" src={_.get(user, 'profile.image[0].contentUrl', defaultImgUrl)} />
                            <Card.Content className="page__content">
                              <p className="page__username-text">{user.username}</p>
                            </Card.Content>
                          </Card>
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
            <nav
              className="pagination mt-two"
              role="navigation"
              aria-label="pagination"
            >
              <Button
                className="pagination-previous"
                onClick={this.onPreviousClick}
                disabled={userState.paginatedObj.loading || page === 0}
              >
                {"<"}
              </Button>
              <Button
                className="pagination-next"
                onClick={this.onNextClick}
                disabled={userState.paginatedObj.loading || userState.paginatedObj.full}
              >
                {">"}
              </Button>
            </nav>
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
  requestUserIntro,
  requestAllUsers,
  requestPaginatedUsers,
  revertPaginatedUsersFull,
})(Page))
Page.contextType = UserContext
