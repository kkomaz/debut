import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Card,
  Content,
  Container,
} from 'components/bulma'
import './Loader.scss';

const Diamond = () => (
  <div className="cssload-thecube">
    <div className="cssload-cube cssload-c1"></div>
    <div className="cssload-cube cssload-c2"></div>
    <div className="cssload-cube cssload-c4"></div>
    <div className="cssload-cube cssload-c3"></div>
  </div>
)

const loader = ({ text, cardWrapped, contained, styles }) => {
  if (cardWrapped && contained) {
    return (
      <Container className="loader-container">
        <Card className="loader-card loader-card--contained">
          <Card.Content>
              <Content>
                <Diamond />
                {
                  !_.isEmpty(text) && <p className="mt-two">{text}</p>
                }
            </Content>
          </Card.Content>
        </Card>
      </Container>
    )
  }

  if (cardWrapped) {
    return (
      <Card className="loader-card">
        <Card.Content>
            <Content>
              <Diamond />
              {
                !_.isEmpty(text) && <p className="mt-two">{text}</p>
              }
          </Content>
        </Card.Content>
      </Card>
    )
  }
  return (
    <div className="loader-card">
      <Diamond />
      {
        !_.isEmpty(text) && <p className="mt-two">{text}</p>
      }
    </div>
  )
}

loader.propTypes = {
  text: PropTypes.string,
  cardWrapped: PropTypes.bool,
  contained: PropTypes.bool,
}

loader.defaultProps = {
  cardWrapped: false,
  contained: false,
  styles: {},
}

export default loader
