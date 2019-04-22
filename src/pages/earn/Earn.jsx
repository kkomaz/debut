/** @jsx jsx */

// Library Imports
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import {
  Container,
  Hero,
} from 'components/bulma'
import moment from 'moment'
import earnImg from 'assets/earn3.jpg'

// Component Imports
import { AprilEarn } from 'components/earn'
import { UserContext } from 'components/User/UserProvider'

class Earn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentMonth: moment().month(),
    }
  }

  render() {
    const { sessionUser } = this.context.state

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
          <AprilEarn
            currentMonth={this.state.currentMonth}
            sessionUser={sessionUser}
          />
        </Container>
      </div>
    )
  }
}

export default Earn
Earn.contextType = UserContext
