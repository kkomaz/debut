import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Control,
  Field,
  Input,
  Label,
} from 'components/bulma'

class TwitterEarnForm extends Component {
  render() {
    return (
      <form>
        <Field>
          <Label>Name</Label>
          <Control>
            <Input placeholder="Text input" />
          </Control>
        </Field>
      </form>
    )
  }
}

export default TwitterEarnForm
