/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Card,
  Content,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

// Action Imports
import { requestAdminComments } from 'actions/comment'

// CSS imports
import './RecentComments.scss'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}

class RecentComments extends Component {
  static propTypes = {
    commentsObj: PropTypes.shape({
      list: PropTypes.array.isRequired,
      full: PropTypes.bool.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired
  }

  componentDidMount() {
    const { sessionUser } = this.context.state

    this.props.requestAdminComments({
      parent_creator: sessionUser.username,
      limit: 10
    })
  }

  onCommentCreatorClick = (e, username) => {
    e.stopPropagation()
    const { history } = this.props

    history.push(`/${username}`)
  }

  navigateToMoment = (shareId) => {
    const { history } = this.props
    const { sessionUser } = this.context.state

    history.push(`/${sessionUser.username}/moments/${shareId}`)
  }

  render() {
    const { commentsObj } = this.props

    if (commentsObj.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className="recent-comments">
        <CSSTransitionGroup
          transitionName="recent-comments-feed-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {
            _.map(commentsObj.list, (comment) => {
              return (
                <Card
                  css={css`
                    cursor: pointer;
                  `}
                  key={comment._id}
                  className="mb-one"
                  onClick={() => this.navigateToMoment(comment.share_id)}
                >
                  <Card.Content>
                    <Content>
                      <div>
                        <p>
                          <strong
                            onClick={(e) => this.onCommentCreatorClick(e, comment.creator)}
                            css={theme => css`
                              cursor: pointer;

                              &:hover {
                                color: ${theme.colors.blue}
                              }
                            `}
                          >
                            {comment.creator}
                          </strong> <span className="small">- {formatDate(comment.createdAt)}</span>
                        </p>

                        <p
                          className="small mb-one"
                          css={theme => css`
                            color: ${theme.colors.powder}
                          `}
                        >
                          Responding to {comment.parent_creator}
                        </p>
                      </div>
                      <p className="small">
                        {comment.text}
                      </p>
                    </Content>
                  </Card.Content>
                </Card>
              )
            })
          }
        </CSSTransitionGroup>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const comments = state.recent.comments

  return {
    commentsObj: comments,
  }
}

export default withRouter(connect(mapStateToProps, {
  requestAdminComments,
})(RecentComments))
RecentComments.contextType = UserContext
