/** @jsx jsx */

// Library Imports
import { Component } from 'react'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import {
  Button,
  Card,
  Container,
  Content,
  Image,
  Heading,
  Hero,
} from 'components/bulma'
import moment from 'moment'
import earnImg from 'assets/earn3.jpg'
import twitterEarn from 'assets/twitter_earn.jpg'
import { Icon } from 'components/icon'

class Earn extends Component {
  openTwitterTask = () => {
    console.log('opening twitter task')
  }

  render() {
    const month = moment().month()

    return (
      <div>
        <Hero
          style={{
            backgroundImage: `url(${earnImg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            margin: 0,
          }}
        >
          <Hero.Body>
            <Container>
              <div css={css`
                position: relative;
                width: 100%;
              `}>
                <div>
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
            </Container>
          </Hero.Body>
        </Hero>
        <Container>
          <Card
            onClick={month === 3 ? this.openTwitterTask : _.noop}
            css={css`
              cursor: ${month === 3 ? 'pointer' : 'default'};
              &:hover {
                box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 24px;
              }
            `}
          >
            <Card.Content
              css={css`
                padding-top: 0;
                padding-bottom: 0;
                padding-left: 0;
              `}
            >
              <Content>
                <div
                  css={css`
                    display: flex;
                  `}
                >
                  <Image
                    style={{
                      backgroundImage: `url(${twitterEarn})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '50% 50%',
                      margin: 0,
                      height: '264px',
                      width: '50%',
                    }}
                  />
                  <div
                    css={css`
                      width: 50%;
                      display: flex;
                      flex-direction: column;
                      padding: 24px;
                    `}
                  >
                    <Icon
                      className="debut-icon"
                      icon="IconTwitter"
                      size={32}
                      color="#00acee"
                    />
                    <h4 className="mt-one">
                      Twitter <span css={theme => css`color: ${theme.colors.blue}`}>(35%)</span>
                    </h4>
                    <p>
                      Share and tweet about debut.  Invite friends and family.  Get rewarded.
                    </p>
                    <div className="mt-two">
                      <Button
                        color="primary"
                        disabled={moment().month() !== 3}
                        >
                        Begin
                      </Button>
                    </div>
                  </div>
                </div>
              </Content>
            </Card.Content>
          </Card>
        </Container>
      </div>
    )
  }
}

export default Earn
