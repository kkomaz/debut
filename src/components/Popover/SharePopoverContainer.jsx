import React from 'react'
import { ArrowContainer } from 'react-tiny-popover'

const sharePopoverContainer = ({ position, targetRect, popoverRect, togglePopover }) => {
  return (
    <ArrowContainer
      position={position}
      targetRect={targetRect}
      popoverRect={popoverRect}
      arrowColor={'#383A3F'}
      arrowSize={10}
    >
      <div
        className="username__popover-container"
        onClick={togglePopover}
      >
        <p className="small">
          Share gives you the ability to express yourself with pictures or just text!  Let others know you feel!
        </p>
      </div>
    </ArrowContainer>
  )
}

export default sharePopoverContainer
