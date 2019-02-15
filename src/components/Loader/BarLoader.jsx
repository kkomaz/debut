import React from 'react'
import ContentLoader from 'react-content-loader'

const BarLoader = () => (
  <ContentLoader
    height={140}
    speed={1}
    primaryColor="#e3dede"
    secondaryColor={'#999'}
  >
    {/* Only SVG shapes */}
    <rect x="80" y="17" rx="4" ry="4" width="300" height="7" />
    <rect x="80" y="30" rx="3" ry="3" width="250" height="7" />
    <rect x="80" y="45" rx="3" ry="3" width="100" height="7" />
  </ContentLoader>
)

export default BarLoader
