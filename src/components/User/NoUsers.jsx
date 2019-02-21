import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  Container,
  Content,
} from 'components/bulma'

const NoUsers = (props) => {
  return (
    <Container>
      <Card>
        <Card.Content>
          <Content>
            <p>No more users in debut</p>
            <nav className="pagination" role="navigation" aria-label="pagination">
              <Button
                className="pagination-previous"
                onClick={props.onPreviousClick}
                disabled={props.loading}
              >
                {"<"}
              </Button>
              <Button
                className="pagination-next"
                onClick={props.onNextClick}
                disabled={props.loading || props.full}
              >
                {">"}
              </Button>
            </nav>
          </Content>
        </Card.Content>
      </Card>
    </Container>
  )
}

NoUsers.propTypes = {
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  full: PropTypes.bool.isRequired
}

export default NoUsers
