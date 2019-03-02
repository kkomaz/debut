import React, { Component } from 'react'
import {
  Card,
  Columns,
  Container,
  Content,
  Heading,
} from 'components/bulma'
import { Link } from 'react-router-dom'
import { Icon } from 'components/icon'
import help from 'assets/help.jpg'

class HelpPage extends Component {
  onClick = () => {
    window.open('https://github.com/kkomaz/debut/issues')
  }

  render() {
    return (
      <Container>
        <Card className="no-users">
          <Card.Content>
            <Content>
              <Columns>
                <Columns.Column size={6}>
                  <img src={help} alt="Logo" height={1000} width={1000} style={{ height: '100%'}} />
                </Columns.Column>
                <Columns.Column size={6} className="no-users__text-column">
                  <div className="no-users__more-info">
                    <Heading size={4}>
                      Any issues, bugs, or feature request for debut?
                    </Heading>
                    <p>
                      Thank you for checking out and using debut!  My name is <Link to="/kkomaz.id">Alex Lee</Link> and I am currently a full time software engineer who works on debut on the side. (nights and weekends)
                    </p>
                    <p>
                      If there are any bugs, issues, or feature requests, you can message me on the blockstack slack channel or add a github issue.
                    </p>
                    <Icon
                      className="debut-icon debut-icon--pointer"
                      icon='IconGithub'
                      onClick={this.onClick}
                      size={32}
                    />
                    <p className="mt-two">
                      If you are developer new to blockstack or experienced but wanting to learn more, I also create youtube tutorials.  Check it out below!
                    </p>
                    <iframe
                      title="tech-rally-playlist"
                      width="560"
                      height="315"
                      src="https://www.youtube.com/embed/videoseries?list=PLDQHh6RjV5oUJNbtnzV11VVghiJTPJ5Wv"
                      frameborder="0"
                      allow="autoplay;
                      encrypted-media"
                      allowfullscreen
                      style={{ height: '315px' }}
                    >
                    </iframe>
                  </div>
                </Columns.Column>
              </Columns>
            </Content>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

export default HelpPage
