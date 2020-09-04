import React from 'react'
import PropTypes from "prop-types"

const EventForm = (props) => (
  <div>
    <h4>Create an Event:</h4>
    <form onSubmit={props.handleSubmit}>
      <input type="text" name="title" placeholder="Title" value={props.title} onChange={props.handleInput} />
      <input type="text" name="start_datetime" placeholder="Date" value={props.start_datetime} onChange={props.handleInput} />
      <input type="text" name="location" placeholder="Location" value={props.location} onChange={props.handleInput} />
      <button type="submit" disabled={!props.formValid} value="Make Event">Create Event</button>
    </form>
  </div>
)

EventForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  start_datetime: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  formValid: PropTypes.bool.isRequired
}

export default EventForm