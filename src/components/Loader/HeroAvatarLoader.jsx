import React from 'react'
import ContentLoader from 'react-content-loader'
import './HeroAvatarLoader.scss'

const HeroAvatarLoader = () => (
  <ContentLoader
    className="hero-avatar-loader"
    height={400}
    speed={1}
    primaryColor={'#e3dede'}
    secondaryColor={'#999'}
  >
    {/* Only SVG shapes */}
    <circle cx="200" cy="200" r="200" />
  </ContentLoader>
)

export default HeroAvatarLoader
