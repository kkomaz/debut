import React from 'react'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames';

const IconLoader = (props) => {
  const iconLoaderClass = classNames({
    'icon-loader': true
  }, props.className)

  return (
    <ContentLoader
      className={iconLoaderClass}
      height={400}
      speed={1}
      primaryColor={'#e3dede'}
      secondaryColor={'#999'}
      style={{ height: props.size, width: props.size}}
      >
      {/* Only SVG shapes */}
      <circle cx="200" cy="200" r="200" />
    </ContentLoader>
  )
}

IconLoader.defaultProps = {
  size: 45
}

export default IconLoader
