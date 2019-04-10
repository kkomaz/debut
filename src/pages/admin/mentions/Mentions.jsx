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

// Component Imports
import { BarLoader } from 'components/Loader'

// Action Imports
import { requestAdminComments } from 'actions/comment'

// CSS imports
import recentCommentStyles from '../recent-comments/RecentCommentStyles'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}

class RecentComments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bottomReached: false,
    }

    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

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
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
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

  handleScroll = () => {
    const { bottomReached } = this.state
    const { sessionUser } = this.context.state
    const { commentsObj } = this.props

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
        if (!commentsObj.full && commentsObj.list.length >= 10) {
          const comment = _.last(commentsObj.list)

          this.props.requestAdminComments({
            parent_creator: sessionUser.username,
            limit: 10,
            lt: _.get(comment, 'createdAt', null),
          })
        }
      });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }


  render() {
    const { commentsObj } = this.props
    const { bottomReached } = this.state

    if (commentsObj.loading && commentsObj.list.length === 0) {
      return <BarLoader style={{ height: '200px' }} />
    }

    return (
      <div
        css={theme => recentCommentStyles.feedTransitionStyles()}
        className="recent-comments"
      >
        <div
          className="mb-half"
          css={theme => css`
            display: flex;
            justify-content: center;
            background: ${theme.colors.danger};
            color: ${theme.colors.white};
            padding: 10px;
          `}
        >
          <div>
            <p className="small">Get real time feedback whenever someone comments on your moments!</p>
            <p className="small">
              Note: This feature is currently in alpha/development.
            </p>
          </div>
        </div>

        {
          !commentsObj.loading && commentsObj.list.length === 0 && (
            <Card>
              <Card.Content>
                <p>Currently no comments replied to your moments!</p>
              </Card.Content>
            </Card>
          )
        }

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
          {
            bottomReached && commentsObj.list.length >= 10 && !commentsObj.full && <BarLoader style={{ height: '200px' }} />
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
