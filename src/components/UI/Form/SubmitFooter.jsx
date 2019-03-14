import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import classNames from 'classnames'
import './stylesheets/_submit-footer.scss'

class SubmitFooter extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
  }

  render() {
    const { className, submitting } = this.props

    const submitFooterClass = classNames({
      'submit-footer': true
    }, className)

    return (
      <div className={submitFooterClass}>
        <Button
          onClick={this.props.onCancel}
          className="mr-half"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={submitting}
        >
          Submit
        </Button>
      </div>
    )
  }
}

SubmitFooter.defaultProps = {
  submitting: false
}

export default SubmitFooter
