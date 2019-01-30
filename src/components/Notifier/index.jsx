import React, { Component } from 'react'
import Notification from 'react-bulma-components/lib/components/notification'
import _ from 'lodash'

class Notifier extends Component {
  state = {
    alerts: [],
  }

  generate = (type, message) => {
    const newAlert = {
      type,
      message
    }
    this.setState(prevState => ({
      alerts: [...prevState.alerts, newAlert]
    }))
  }

  render() {
    const { alerts } = this.state

    return (
      <React.Fragment>
        {
          _.map(alerts, (alert) => (
            <Notification color={alert.type}>
              {alert.message}
            </Notification>
          ))
        }

      </React.Fragment>
    )
  }
}

export default Notifier
