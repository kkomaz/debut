import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import classNames from 'classnames'
import './stylesheets/_submit-footer.scss'

class SubmitFooter extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
  }

  render() {
    const { className } = this.props

    const submitFooterClass = classNames({
      'submit-footer': true
    }, className)

    return (
      <div className={submitFooterClass}>
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
