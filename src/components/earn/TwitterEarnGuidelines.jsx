/** @jsx jsx */
import PropTypes from 'prop-types'
import { css, jsx } from '@emotion/core'
import _ from 'lodash'
import {
  Button,
  Heading
} from 'components/bulma'

const TwitterEarnGuidelines = (props) => {
  return (
    <div>
      <Heading
        css={css`
          margin-bottom: 10px !important;
        `}
        size={4}
      >
        Guidelines
      </Heading>
      <p
        css={css`
          margin-bottom: 10px;
        `}
      >
        <strong>
            Please each line carefully.  Failure to follow these guidelines will disqualify your entry or receive your BTC that month.
        </strong>
      </p>
      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        1. One entry per blockstack ID
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        2. Twitter account must have more than five followers
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        3. Must include a valid tweet link
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        4. Must include a valid BTC address
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        5. Tweet must mention the <strong>@the_debut_app</strong> followed by what the app does or call to action to join.
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        <strong>Note</strong>
      </p>

      <p
        css={css`
          margin-bottom: 5px;
        `}
      >
        All fields can be editable until the end of the month in which your entry will go into a review process.  If accepted, you will receive your BTC from
        the next months rewards.  (May submission recieves June awards)  If rejected, refer to guidelines 1-4.
      </p>

      <p>
        If suspected of using a twitter bot, you will automatically be disqualified that current month.
      </p>
      <div
        css={css`
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
        `}
      >
        <Button
          color="danger"
          onClick={props.onDecline}
        >
          Decline
        </Button>
        <Button
          color="primary"
          onClick={props.onAccept}
        >
          Accept
        </Button>
      </div>
    </div>
  )
}

TwitterEarnGuidelines.propTypes = {
  onDecline: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  setShowTwitterForm: PropTypes.func,
}

TwitterEarnGuidelines.defaultProps = {
  setShowTwitterForm: _.noop,
}

export default TwitterEarnGuidelines
