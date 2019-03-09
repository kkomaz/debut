import React from 'react'
import { Icon } from 'components/icon'
import _ from 'lodash'

const keys = {
  twitter: {
    icon: 'IconTwitter',
    url: 'https://twitter.com'
  },
  facebook: {
    icon: 'IconFacebook',
    url: 'https://facebook.com'
  },
  github: {
    icon: 'IconGithub',
    url: 'https://github.com'
  },
  linkedIn: {
    icon: 'IconLinkedIn',
    url: 'https://www.linkedin.com/in'
  }
}

const IconProofs = ({ message, userProofs, username }) => {
  return (
    <React.Fragment>
      <p style={{ color: '#281134' }}>{message}</p>
      <div className="mt-one" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          _.map(userProofs, (proof) => {
            return (
              <Icon
                key={proof.service}
                className="debut-icon debut-icon--pointer mr-half"
                icon={keys[`${proof.service}`].icon}
                onClick={() => window.open(`${keys[`${proof.service}`].url}/${proof.identifier}`)}
                size={32}
              />
            )
          })
        }
        {
          _.isEmpty(userProofs) &&
          <p style={{ color: '#281134' }}>Unfortunately {username} does not have any social proofs!</p>
        }
      </div>
    </React.Fragment>
  )
}

export default IconProofs
