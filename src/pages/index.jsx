import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Columns,
  Container,
  Control,
  Field,
  Heading,
  Hero,
  Media,
  Radio,
  Table,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import './Page.scss'
import { requestUserIntro } from 'actions/blockstack'
import requestAllUsers from 'actions/user/requestAllUsers'

class Page extends Component {
  state = {
    showTileView: true,
  }

  // TODO: Commented out but might need later
  // componentDidMount = async () => {
  //   const { sessionUser } = this.context.state
  //   const { userState } = this.props;
  //
  //   _.each(userState.users, (user) => {
  //     console.log(user)
  //     this.props.requestUserIntro(user.username, sessionUser.userSession)
  //   })
  // }

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

  onClick = () => {
    this.props.requestAllUsers()
  }

  render() {
    const { userState } = this.props
    const { showTileView } = this.state
    const { defaultImgUrl } = this.context.state

    return (
      <div className="page">
        <Hero color="primary" className="mb-two">
         <Hero.Body>
           <Container>
             <Heading>Choose your user's view!</Heading>
               <Field>
                 <Control>
                   <Radio
                     className="page__radio"
                     onChange={() => this.onChange(true)}
                     checked={showTileView}
                     value="Tile"
                     name="view"
                    >
                     Tile
                   </Radio>
                   <Radio
                     className="page__radio"
                     onChange={() => this.onChange(false)}
                     checked={!showTileView}
                     value="Table"
                     name="view"
                    >
                     Table
                   </Radio>
                 </Control>
               </Field>
           </Container>
         </Hero.Body>
       </Hero>
          <Container>
            {
              showTileView ?
                <Columns breakpoint="tablet" style={{ padding: '0 150px' }}>
                  {
                    _.map(userState.users, (user) => {
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
                              <Media>
                                <Media.Item style={{ textAlign: 'center' }}>
                                  <p className="page__username-text">{user.username}</p>
                                  <p className="page__join-text">joined debut!</p>
                                </Media.Item>
                              </Media>
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
                        _.map(userState.users, (user) => {
                          return <tr key={user.username} className="page__user-row" onClick={() => this.onBoxClick(user)}>
                            <td>{user.username} has joined debut!</td>
                          </tr>
                        })
                      }
                    </tbody>
                  </Table>
                </div>
            }
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
})(Page))
Page.contextType = UserContext
