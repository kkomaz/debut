import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Columns,
  Heading,
  Hero,
  Container,
  Card,
  Content,
} from 'components/bulma'
import "./_login.scss"
import logo from 'assets/debut-app-icon-text.svg'
import { Loader } from 'components/Loader'
// Opera 8.0+
export const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // eslint-disable-line no-undef

// Firefox 1.0+
export const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
export const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)); // eslint-disable-line no-undef

// Internet Explorer 6-11
export const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
export const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
export const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
export const isBlink = (isChrome || isOpera) && !!window.CSS;

class Login extends Component {
  state = {
    loadingUser: false,
  }

  static propTypes = {
    loggingIn: PropTypes.bool.isRequired,
  }

  signIn = (e) => {
    const { userSession } = this.props

    e.preventDefault()
    userSession.redirectToSignIn()
    this.setState({ loadingUser: true })
  }

  render() {
    const { loadingUser } = this.state;
    const { loggingIn } = this.props

    if (loggingIn) {
      return (
        <Loader
          cardWrapped
          contained
          text="Logging user in...."
        />
      )
    }

    return (
      <Columns className="login">
        {
          !isChrome &&
          <Hero color="danger" style={{ width: '100%'}}>
            <Hero.Body>
              <Container>
                <Heading>Login is currently disabled for your browser!</Heading>
                <Heading subtitle size={6}>
                  Currently a bug exists with login specific to your browser!  The Blockstack team is addressing this issue but for now Debut is Chrome compatible.  You can download it <a href="https://www.google.com/chrome/?brand=CHBD&gclid=Cj0KCQiAzePjBRCRARIsAGkrSm41my5SQgEvV46dGIsStOgaIg61R2Jo52faG3mI1VPakLp9z-pDWRAaAvalEALw_wcB&gclsrc=aw.ds" rel="noopener noreferrer" target="_blank" style={{ color: '#3ac569' }}>here</a>
                </Heading>
              </Container>
            </Hero.Body>
          </Hero>
        }
        <Columns.Column className="login__column-left" size={6}>
          <div className="login__column-left-blockstack-details">
            <div className="login__left-container">
              <Heading style={{ color: 'white' }}>
                Our Platform
              </Heading>
              <div className="login__card-container">
                <Card style={{ width: '50%'}} className="mr-one mb-one">
                  <Card.Content>
                    <Content>
                      <Heading size={4}>
                        Mission
                      </Heading>
                      <p>
                        debut is a social networking app alternative that ensures your data is safe. Only <strong>YOU</strong> as the user have access to your data.  By signing in, you can <strong>confidently</strong> share your <strong>secured</strong> moments and connect with friends and family.
                      </p>
                      <p>
                        Follow us on twitter <a href="https://twitter.com/the_debut_app" rel="noopener noreferrer" target="_blank">here!</a>
                      </p>
                    </Content>
                  </Card.Content>
                </Card>
                <Card style={{ width: '50%'}} className="mb-one">
                  <Card.Content>
                    <Content>
                      <Heading size={4}>
                        Data Security
                      </Heading>
                      <p>
                        The Blockstack team has developed a decentralized high-performance storage system to allow users to store their data wherever they please.  Include but limited to S3, Azure, etc
                      </p>
                      <br />
                      <p>
                        For more information click <a href="https://github.com/blockstack/gaia" rel="noopener noreferrer" target="_blank">here!</a>
                      </p>
                    </Content>
                  </Card.Content>
                </Card>
              </div>
              <div className="login__card-container">
                <Card style={{ width: '50%'}} className="mr-one">
                  <Card.Content>
                    <Heading size={4}>
                      What is Blockstack?
                    </Heading>
                    <p className="mb-half">
                      Blockstack is a new internet that provides infrastructure for decentralized apps(dapps) where users own their data directly.
                    </p>
                    <p>
                      For more information click <a href="https://youtu.be/qtOIh93Hvuw?t=449" rel="noopener noreferrer" target="_blank">here!</a>
                    </p>
                  </Card.Content>
                </Card>
                <Card style={{ width: '50%'}}>
                  <Card.Content>
                    <Content>
                      <Heading size={4}>
                        How to use Blockstack
                      </Heading>
                      <p>
                        A Blockstack app/browser needs to be installed before you can use debut
                      </p>
                      <p style={{ marginTop: '30px'}}>
                        View or install the browswer <a href="https://blockstack.org/install/" rel="noopener noreferrer" target="_blank">here!</a>
                      </p>
                    </Content>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
        </Columns.Column>

        <Columns.Column className="login__column-right" size={6}>
          {
            loadingUser ? <div>Loading...</div> :
            <div className="login-blockstack">
              <img className="mb-one" src={logo} alt="Logo" height={250} width={250} />
                <Content className="login__sign-in-content">
                  <Button
                    className="mt-half login__button-sign-in"
                    color="link"
                    onClick={this.signIn}
                    disabled={!isChrome}
                    >
                    Sign in with Blockstack
                  </Button>
                </Content>
              <Heading size={6}>
                Curious about our technical roadmap? Click <a href="https://trello.com/b/he3qvtA0/debut" rel="noopener noreferrer" target="_blank">here!</a>
              </Heading>
            </div>
          }
        </Columns.Column>
      </Columns>
    );
  }
}

export default Login;
