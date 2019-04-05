/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import {
  Heading,
} from 'components/bulma'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import moment from 'moment'

const UserIntroDisplay = (props) => {
  const { user } = props

  return (
    <div>
      <div className="mb-one">
        {user.name ?
        <Heading
          css={css`
            margin-bottom: 0 !important;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: normal;
          `}
          size={6}>
            {user.name}
        </Heading> :
        <Heading
          css={css`
            margin-bottom: 0 !important;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: normal;
          `}
          size={6}>
            {user.username}
        </Heading>
        }
      </div>
      {
        user.description &&
        <p
          css={css`
            margin-bottom: 10px !important;
          `}
        >
          {linkifyText(user.description)}
        </p>
      }
      {
        user.area &&
        <div
          css={css`
            display: flex;
            justify-content: flex-start;
          `}
        >
          <Icon
            className="debut-icon mr-one mb-half"
            icon="IconLocation"
            size={20}
          />
          <p className="small">{user.area}</p>
        </div>
      }
      {
        user.websiteUrl &&
        <div
          css={css`
            display: flex;
            justify-content: flex-start;
          `}
        >
          <Icon
            className="debut-icon mr-one mb-half"
            icon="IconDisplay"
            size={20}
          />
          <p
            className="small"
            css={css`
              a {
                font-size: 12px;
              }
            `}
          >
            {linkifyText(user.websiteUrl)}
          </p>
        </div>
      }

      <div
        css={css`
          display: flex;
          justify-content: flex-start;
        `}
      >
        <Icon
          className="debut-icon mr-one"
          icon="IconCalendar"
          size={20}
        />
        <p className="small">Joined {moment(user.createdAt).format('MM/YYYY')}</p>
      </div>
    </div>
  )
}

UserIntroDisplay.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    area: PropTypes.string,
    websiteUrl: PropTypes.string,
  }).isRequired
}

export default UserIntroDisplay
