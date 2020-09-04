import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import axios from 'axios'

import EventsList from "./EventsList"
import EventForm from "./EventForm"
import FormErrors from "./FormErrors"
import validations from "../validations"

class Eventlite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: this.props.events,
      title: { value: '', valid: false },
      start_datetime: { value: '', valid: false },
      location: { value: '', valid: false },
      formErrors: {},
      formValid: false
    }
    this.logo = React.createRef()
  }

  static formValidations = {
    title: [
      value => { return validations.checkMinLength(value, 3) }
    ],
    location: [
      value => { return validations.checkMinLength(value, 1) }
    ],
    start_datetime: [
      value => { return validations.checkMinLength(value, 1) },
      value => { return validations.timeShouldBeInTheFuture(value) }
    ]
  }

  render() {
    return (
      <div>
        <h1 className="logo" ref={this.logo}>Eventlite</h1>
        <FormErrors formErrors={this.state.formErrors} />
        <EventForm handleSubmit={this.handleSubmit}
          handleInput={this.handleInput}
          formValid={this.state.formValid}
          title={this.state.title.value}
          start_datetime={this.state.start_datetime.value}
          location={this.state.location.value}
        />
        <EventsList events={this.state.events} />
      </div>
    )
  }

  changeLogoColour = () => {
    const colors = ["red", "blue", "green", "violet"]
    this.logo.current.style.color = colors[Math.floor(Math.random() * colors.length)]
  }

  addNewEvent = event => {
    const events = [...this.state.events, event].sort(function(a, b) {
      return new Date(a.start_datetime) - new Date(b.start_datetime)
    })
    this.setState({ events: events }, this.changeLogoColour)
  }

  handleInput = (e) => {
    e.preventDefault();

    const name = e.target.name;
    const value = e.target.value;
    const newState = {};

    newState[name] = { ...this.state[name], value: value };
    
    this.setState(newState, () => this.validateField(name, value, Eventlite.formValidations[name]));
  }

  validateForm = () => {
    let formErrors = {}
    let formValid = true

    if (this.state.title.value.length <= 2) {
      formErrors.tite = ["is too short (minimum is 3 characters)"]
      formValid = false;
    }

    if (this.state.location.value.length === 0) {
      formErrors.location = ["can't be blank"]
      formValid = false;
    }

    if (this.state.start_datetime.value.length === 0) {
      formErrors.start_datetime = ["can't be blank"]
      formValid = false;
    } else if (Date.parse(this.state.start_datetime.value) <= Date.now()) {
      formErrors.start_datetime = ["can't be in the past"]
      formValid = false;
    }

    this.setState({ formErrors: formErrors, formValid: formValid })
  }

  validateField = (fieldName, fieldValue, fieldValidations) => {
    let fieldValid = true;
    let errors = fieldValidations.reduce((errors, validation) => {
      let [valid, fieldError] = validation(fieldValue)

      if (!valid) {
        errors = errors.concat([fieldError])
      }

      return errors
    }, []);

    fieldValid = errors.length === 0;

    const newState = { formErrors: { ...this.state.formErrors, [fieldName]: errors } }
    newState[fieldName] = { ...this.state[fieldName], valid: fieldValid }
    this.setState(newState, this.validateForm)
  }

  handleSubmit = e => {
    e.preventDefault()

    let newEvent = {
      title: this.state.title.value, 
      location: this.state.location.value, 
      start_datetime: this.state.start_datetime.value,
    }

    axios({
      method: 'POST',
      url: '/events',
      data: { event: newEvent },
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
      }
    })
    .then(response => {
      this.addNewEvent(response.data)
      this.resetFormErrors();
    })
    .catch(error => {
      console.log(error.response.data)
      this.setState({ formErrors: error.response.data })
    })
  }

  resetFormErrors = () => {
    this.setState({ formErrors: {} })
  }
}

Eventlite.propType = {
  events: PropTypes.array.isRequired
}

document.addEventListener("DOMContentLoaded", () => {
  const node = document.getElementById("events_data")
  const data = JSON.parse(node.getAttribute("data"))

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement("div"))
  )
})