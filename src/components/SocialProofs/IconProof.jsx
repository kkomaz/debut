import React from 'react'
import { keys } from 'utils/proofs'
import { Icon } from 'components/icon'

const IconProof = ({ proof, className, size, color, linkStyles}) => {
  return (
    <Icon
      key={proof.service}
      className={className}
      icon={keys[`${proof.service}`].icon}
      onClick={() => window.open(`${keys[`${proof.service}`].url}/${proof.identifier}`)}
      size={size}
      color={color || keys[`${proof.service}`]['color']}
      linkStyles={linkStyles}
    />
  )
}

IconProof.defaultProps = {
  size: 32,
  linkStyles: {
    height: '30px'
  }
}

export default IconProof
