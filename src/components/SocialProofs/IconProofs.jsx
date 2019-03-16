import React from 'react'
import _ from 'lodash'
import IconProof from './IconProof'

const IconProofs = ({ message, userProofs, username }) => {
  return (
    <React.Fragment>
      <p style={{ color: '#281134' }}>{message}</p>
      <div className="mt-one" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          _.map(userProofs, (proof) => {
            return (
              <IconProof
                className="debut-icon debut-icon--pointer mr-half"
                proof={proof}
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
