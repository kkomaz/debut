import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import './stylesheets/_submit-footer.scss'

class SubmitFooter extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="submit-footer">
        <Button
          onClick={this.props.onCancel}
          className="mr-half"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </div>
    )
  }
}

export default SubmitFooter
