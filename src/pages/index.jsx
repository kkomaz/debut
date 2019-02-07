import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Columns,
  Content,
  Heading,
  Image,
  Media,
  Table
} from 'components/bulma'
import './Page.scss'

class Page extends Component {
  onBoxClick = (user) => {
    const { history } = this.props

    return history.push({
      pathname: `/${user.username}`,
      state: {
        identityAddress: user.blockstackId
      }
    })
  }

  render() {
    const { users } = this.props

    return (
      <div className="page">
        <Columns breakpoint="desktop">
          {
            _.map(users, (user) => {
              return (
                <Columns.Column
                  key={user.username}
                  desktop={{
                    size: 3
                  }}
                >
                  <Card>
                    <Card.Image size="4by3" src="http://bulma.io/images/placeholders/1280x960.png" />
                    <Card.Content>
                      <Media>
                        <Media.Item renderAs="figure" position="left">
                          <Image renderAs="p" size={64} alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
                        </Media.Item>
                        <Media.Item>
                          <Heading size={4}>John Smith</Heading>
                          <Heading subtitle size={6}>
                            @johnsmith
                          </Heading>
                        </Media.Item>
                      </Media>
                      <Content>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                        <a href="#1">#css</a> <a href="#2">#responsive</a>
                        <br />
                        <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                      </Content>
                    </Card.Content>
                  </Card>
                </Columns.Column>
              )
            })
          }
          <Columns.Column
            desktop={{
              size: 3
            }}
          >
            <p className="bd-notification is-success">
              First Column
            </p>
          </Columns.Column>
          <Columns.Column
            desktop={{
              size: 3
            }}
          >
            <p className="bd-notification is-info">Second Column</p>
          </Columns.Column>
          <Columns.Column
            desktop={{
              size: 3
            }}
          >
            <p className="bd-notification is-warning">Third Column</p>
          </Columns.Column>
          <Columns.Column
            desktop={{
              size: 3
            }}
          >
            <p className="bd-notification is-warning">Fourth Column</p>
          </Columns.Column>
          <Columns.Column
            desktop={{
              size: 3
            }}
          >
            <p className="bd-notification is-warning">Fourth Column</p>
          </Columns.Column>
        </Columns>
        <Table>
          <tbody>
            {
              _.map(users, (user) => {
                return <tr key={user.username} className="page__user-row" onClick={() => this.onBoxClick(user)}>
                  <td>{user.username} has joined debut!</td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users
  }
}

export default withRouter(connect(mapStateToProps)(Page))
