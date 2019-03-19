// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Columns,
  Container
} from 'components/bulma'
import Share from 'model/share'
import { ShareListItem, InvalidShare } from 'components/Share'
import { requestAddShareFeeds } from 'actions/share'
import { RandomUsers } from 'components/User'

class ShareDetail extends Component {
  state = {
    error: false,
    share: {},
    loading: true,
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired
  }

  componentDidMount = async () => {
    const { match, username } = this.props

    try {
      const share = await Share.findOne({ _id: match.params.share_id, username })

      if (!share) {
        throw new Error('That moment does not exist!')
      }

      this.props.requestAddShareFeeds(share.attrs)
    } catch (e) {
      this.setState({ error: true })
    }
  }

  render() {
    const { username, share } = this.props
    const { error } = this.state

    console.log('hitting here?')

    if (error) {
      return (
        <Container>
          <InvalidShare username={username} />
        </Container>
      )
    }

    if (_.isEmpty(share)) {
      return <div>Loading...</div>
    }

    return (
      <Container>
        <Columns>
          <Columns.Column size={6} offset={1}>
            <ShareListItem share={share} username={username} />
          </Columns.Column>
          <Columns.Column size={4}>
            <RandomUsers />
          </Columns.Column>
        </Columns>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const shares = state.share.shares
  const share = _.find(shares.list, (share) => share._id === ownProps.match.params.share_id)
  const loading = shares.loading

  return {
    share,
    loading
  }
}

export default connect(mapStateToProps, {
  requestAddShareFeeds
})(ShareDetail)
