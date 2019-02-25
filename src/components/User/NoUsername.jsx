import React from 'react'
import {
  Card,
  Container,
  Content,
  Heading,
} from 'components/bulma'
import first from 'assets/instructions/first.png'
import second from 'assets/instructions/second.png'
import third from 'assets/instructions/third.png'
import fourth from 'assets/instructions/fourth.png'
import last from 'assets/instructions/last.png'
import './NoUsername.scss'

const NoUsername = () => {
  return (
    <Container className="no-username">
      <Card>
        <Card.Content>
          <Content>
            <Heading size={4}>You are logged in without a username!</Heading>
            <p>
              Thanks for checking out debut!  Unfortunately your current blockstack id does not have an associated username!  That's okay! Just follow the steps below and your id should be generated! After you finish reading the instructions you can log out here!
            </p>

            <div className="no-username__instructions">
              <Heading size={6}>1. Open your blockstack browswer and click IDs</Heading>
              <img src={first} alt="Logo" height={500} width={500} />

              <Heading size={6}>2. Click "More"</Heading>
              <img src={second} alt="Logo" height={500} width={500} />

              <Heading size={6}>3. Click "Add Username" for your respective id</Heading>
              <img src={third} alt="Logo" height={500} width={500} />

              <Heading size={6}>4. Add a username and click "Search"</Heading>
              <img src={fourth} alt="Logo" height={500} width={500} />

              <Heading size={6}>5. You can either opt for a free username with the "id.blockstack" or pay for a  "id" username!</Heading>
              <img src={last} alt="Logo" height={500} width={500} />
            </div>
          </Content>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default NoUsername
