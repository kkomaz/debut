import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestSetBasicInformation } from 'actions/user'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Field,
  Textarea,
  Help,
} from 'react-bulma-components/lib/components/form'
import {
  Input,
  Dropdown,
} from 'components/bulma'
import axios from 'axios'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import './UserIntroForm.scss'

class UserIntroForm extends Component {
  constructor(props) {
    super(props)

    const { user } = props

    this.state = {
      description: user.description || '',
      valid: true,
      area: user.area || '',
      websiteUrl: user.websiteUrl || '',
      name: props.name || '',
      searchResults: [],
      hovered: '',
      open: false,
    }

    this.fetchCityList = _.debounce(this.fetchCityList, 1000)
  }

  static propTypes = {
    username: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      area: PropTypes.string,
      websiteUrl: PropTypes.string,
    }).isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.dropdown.state.open) {
      document.addEventListener('keydown', this.onKeyPress, false)
    }

    if (!this.dropdown.state.open) {
      document.removeEventListener('keydown', this.onKeyPress)
    }
  }

  onChange = (e) => {
    const { valid } = this.props

    if (!valid) {
      this.setState({ valid: true })
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onCityChange = (e) => {
    const { valid } = this.props

    if (!valid) {
      this.setState({ valid: true })
    }

    const target = e.target.value

    if (!this.dropdown.state.open) {
      this.dropdown.toggle()
    }

    this.setState({
      [e.target.name]: e.target.value,
      open: true,
    }, () => {
      this.fetchCityList(target)
    })
  }

  onCancel = (e) => {
    e.preventDefault()
    this.props.onCancel()
  }

  onSubmit = async (e) => {
    const {
      name,
      description,
      location,
      websiteUrl,
    } = this.state

    const {
      username,
    } = this.props

    e.preventDefault()

    if (_.isEmpty(description)) {
      return this.setState({ valid: false })
    }

    const blockstackData = {
      name,
      description,
      location,
      websiteUrl,
    }

    this.props.requestSetBasicInformation(username, blockstackData)
    this.props.onSubmit({ description })
  }

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmit(e)
    }
  }

  fetchCityList = async (value) => {
    const response = await axios.get('http://autocomplete.geocoder.api.here.com/6.2/suggest.json', {
      params: {
        app_id: 'HcfQzK5jZbS7VenQDIPz',
        app_code: '3T1_Gjk5H-BCkrK3QtraUg',
        query: value,
        resultType: 'city'
      }
    })

    const result = _.reduce(response.data.suggestions, (acc, curr) => {
      if (curr.address.city) {
        if (_.includes(acc, `${curr.address.city}, ${curr.address.country}`)) {
          return [...acc]
        }

        return [...acc, `${curr.address.city}, ${curr.address.country}`]
      }

      return [...acc]
    }, [])
    return this.setState({ searchResults: result })
  }

  onDropdownChange = (selected) => {
    this.setState({
      area: selected,
      selected,
    })
  }

  onKeyPress = (e) => {
    const { hovered } = this.state
    if (this.dropdown.state.open && e.keyCode === 13) {
      if (this.state.hovered) {
        this.setState({
          area: hovered,
          selected: hovered,
          open: false
        }, () => {
          this.dropdown.toggle(e)
        })
      }
    }

    // Arrow up
    if (this.dropdown.state.open && e.keyCode === 38) {
      const index = _.findIndex(this.state.searchResults, (username) => {
        return username === this.state.hovered
      })

      return this.setState({ hovered: this.state.searchResults[index - 1]})
    }

    // Arrow down
    if (this.dropdown.state.open && e.keyCode === 40) {
      if (this.state.hovered === '') {
        return this.setState({ hovered: this.state.searchResults[0]})
      } else {
        const index = _.findIndex(this.state.searchResults, (username) => {
          return username === this.state.hovered
        })

        if (index === this.state.searchResults.length - 1) {
          return this.setState({ hovered: this.state.searchResults[index]})
        } else {
          return this.setState({ hovered: this.state.searchResults[index + 1]})
        }
      }
    }
  }

  render() {
    const { valid, searchResults } = this.state

    return (
      <React.Fragment>
        <form className="user-intro-form" onSubmit={this.onSubmit} autoComplete="new-password">
          <Field>
            <Input
              className="mb-half"
              name="name"
              onChange={this.onChange}
              placeholder="Name"
              value={this.state.name}
            />

            <Textarea
              className="mb-half"
              name="description"
              onChange={this.onChange}
              placeholder="About Yourself"
              rows={10}
              onKeyDown={this.onEnterPress}
              value={this.state.description}
              color={valid ? null : 'danger'}
            />
            {
              !valid && <Help color="danger">Field can not be empty!</Help>
            }
            <div className="user-intro-form__location-wrapper">
              <Input
                className="mb-half"
                name="area"
                onChange={this.onCityChange}
                placeholder="Location"
                value={this.state.area}
              />
              <Dropdown
                ref={(dropdown) => this.dropdown = dropdown }
                value={this.state.selected}
                color="info"
                onChange={this.onDropdownChange}
                >
                {
                  _.map(searchResults, (city) => {
                    return (
                      <Dropdown.Item
                        onMouseEnter={() => this.setState({ hovered: city })}
                        value={city}
                        style={this.state.hovered === city ? { background: '#E0E3DA' } : {} }
                        >
                        {city}
                      </Dropdown.Item>
                    )
                  })
                }
              </Dropdown>
            </div>
            <Input
              name="websiteUrl"
              onChange={this.onChange}
              placeholder="Website"
              value={this.state.websiteUrl}
            />
          </Field>
          <SubmitFooter
            onCancel={this.onCancel}
            onSubmit={this.onSubmit}
          />
        </form>
      </React.Fragment>
    )
  }
}

UserIntroForm.defaultProps = {
  description: '',
  onSubmit: _.noop,
  onCancel: _.noop,
}

export default connect(null, {
  requestSetBasicInformation
})(UserIntroForm)
