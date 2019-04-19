/** @jsx jsx */

// Library Imports
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import {
  Container,
  Image,
} from 'components/bulma'
import earnImg from 'assets/earn3.jpg'

class Earn extends Component {
  render() {
    return (
      <div>
        <div css={css`
          position: relative;
          width: 100%;
        `}>
          <Image
            renderAs="p"
            onMouseEnter={this.setAvatarHoveredTrue}
            onMouseLeave={this.setAvatarHoveredFalse}
            onClick={this.openModal}
            style={{
              backgroundImage: `url(${earnImg})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 50%',
              margin: 0,
              height: '400px'
            }}
          />
          <div css={css`
            position: absolute;
            transform: translateX(-50%) translateY(-50%);
            top: 50%;
            left: 50%;
          `}>
            <h1 css={theme => css`
              font-size: 56px;
              font-weight: 600;
              line-height: 64px;
              color: ${theme.colors.white};
              margin: 13px 0;
              text-align: center;
            `}>
              Earn crypto
            </h1>
            <h2 css={theme => css`
              font-size: 35px;
              font-weight: 600;
              line-height: 64px;
              color: ${theme.colors.white};
              margin: 13px 0;
              text-align: center;
            `}>
              as a early adopter of debut
            </h2>
            <h4 css={theme => css`
              font-size: 25px;
              color: ${theme.colors.white};
              text-align: center;
              margin-bottom: 10px;
            `}
            >
              Complete tasks to help the community grow!
            </h4>
            <br />
            <h4 css={theme => css`
              font-size: 16px;
              color: ${theme.colors.white};
              text-align: center;
            `}
            >

              Get rewarded every month you participate by splitting *
                <span
                  css={theme => css`
                    color: ${theme.colors.pink};
                    font-weight: 800;
                  `}
                >
                  35%
                </span>* of the App Mining rewards debut receieves amongst the pool of participants.
            </h4>
          </div>
        </div>
        <Container>
          <div>
            Hello World
          </div>
        </Container>
      </div>
    )
  }
}

export default Earn
