import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import Card from 'react-bulma-components/lib/components/card'
import Columns from 'react-bulma-components/lib/components/columns'
import Content from 'react-bulma-components/lib/components/content'
import Media from 'react-bulma-components/lib/components/media'
import Image from 'react-bulma-components/lib/components/image'
import Heading from 'react-bulma-components/lib/components/heading'
import _ from 'lodash'
import { lookupProfile } from 'blockstack'
import { UserContext } from 'components/User/UserProvider'
import { returnFilteredUrls } from 'utils/apps'

async function fetchUserBlockstackApps(blockstackDapps, userDapps) {
  const promises = _.map(userDapps, async (userDapp) => {
    const blockstackApp = _.find(blockstackDapps, (bDapp) => bDapp.url === userDapp)

    if (blockstackApp) {
      return blockstackApp
    } else {
      try {
        const { data } = await axios.get(`${userDapp}/manifest.json`)
        await axios.post('https://debut-3fcee.firebaseio.com/dapps.json', {...data, url: userDapp })
        return {...data, url: userDapp }
      } catch (e) {
        console.log(e.message)
      }
    }
  })

  const results = await Promise.all(promises)

  return _.compact(results)
}

class UsernamePage extends Component {
  state = {
    loading: true
  }

  static propTypes = {
    blockstackApps: PropTypes.array.isRequired,
  }

  async componentDidMount() {
    const { username } = this.props
    const user = await lookupProfile(username)
    if (user) {
      this.loadUserInfo(user)
    }
  }

  async loadUserInfo(profile) {
    const { userSession } = this.context.state.sessionUser
    const { location, username, blockstackApps } = this.props
    const options = { decrypt: false }
    const result = await userSession.getFile(`user-intro-${location.state.identityAddress}.json`, options)
    const apps = _.map((profile.apps), (k,v) => {
      return v
    })

    const filteredDapps = returnFilteredUrls(apps)

    const userDapps = await fetchUserBlockstackApps(blockstackApps, filteredDapps)

    this.setState({
      userInfo: {
        description: JSON.parse(result).description,
        profile,
        username,
        apps: userDapps,
      },
      loading: false
    })
  }

  render() {
    const { userInfo, loading } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image style={{ margin: 0 }} renderAs="p" size={64} alt="64x64" src={userInfo.profile.image[0].contentUrl} />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{userInfo.profile.name}</Heading>
              <Heading subtitle size={6}>
                {userInfo.username}
              </Heading>
            </Media.Item>
          </Media>
          <Content>
            <Columns className="mt-one" gapless>
              <Columns.Column size={6}>
                <h4>My Apps</h4>
                <ul style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '0', marginLeft: '0', width: '50%' }}>
                  {
                    _.map(userInfo.apps, (app) => {
                      return (
                        <li style={{ marginRight: '10px' }}>
                          <a href={app.url} target="_blank" rel='noreferrer noopener'>
                            <img src={app.icons[0].src} alt="dapp" height="42" width="42" />
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
              </Columns.Column>
              <Columns.Column size={6}>
                <h4>About Myself</h4>
                {userInfo.description}
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blockstackApps: state.blockstack.apps
  }
}

UsernamePage.contextType = UserContext
export default connect(mapStateToProps)(UsernamePage)
