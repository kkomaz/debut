/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { Icon } from 'components/icon'
import _ from 'lodash'
import {
  Section,
  Heading,
} from 'components/bulma'

class LikeModalContent extends Component {
  render() {
    const { detailObj } = this.props
    return (
      <Section
        css={theme => css`
          background-color: ${theme.colors.white};
          padding: 0 0 10px 0;
          border-bottom: 1px solid black;
          padding-bottom: 20px;
        `}
      >
        <div
          css={theme => css`
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${theme.colors.shadow};
            padding: 1em;
          `}
        >
          <Heading
            size={4}
            css={css`
              margin-bottom: 0 !important;
            `}
            >
            {`Liked ${_.get(detailObj, 'votes.length', 0) === 1 ? `${_.get(detailObj, 'votes.length', 0)} time` : `${_.get(detailObj, 'votes.length', 0)} times`}`}
          </Heading>
          <Icon
            className="debut-icon debut-icon--pointer"
            icon="IconX"
            size={32}
            color="8b8687"
            onClick={this.props.closeModal}
          />
        </div>
        <ul style={{ padding: '20px' }}>
          {
            _.map(detailObj.votes, (vote) => {
              return (
                <li key={vote.username}>
                  {vote.username}
                </li>
              )
            })
          }
        </ul>
      </Section>
    )
  }
}

export default LikeModalContent
